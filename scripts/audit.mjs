import puppeteer from 'puppeteer-core';
import { AxePuppeteer } from '@axe-core/puppeteer';

const baseUrl = process.argv[2] ?? 'http://localhost:4321';
const chromePath =
  process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const widths = [320, 360, 375, 414, 768, 1024, 1440, 1920];
const routeKinds = ['', 'work/arbin-ai-assistant', 'work/uxo-chatbot-detection'];
const locales = ['en', 'vi'];

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const failures = [];
const overflow = [];
const axe = [];
const focusOrders = {};
const amberCounts = {};
const heroProof = {};
const sectionMetrics = {};
const localeSwitch = [];

try {
  const redirectPage = await browser.newPage();
  const response = await redirectPage.goto(`${baseUrl}/`, { waitUntil: 'networkidle0' });
  const redirect = {
    status: response?.status(),
    finalUrl: redirectPage.url(),
    chain: response?.request().redirectChain().map((request) => request.url()),
  };
  if (
    redirect.status !== 200 ||
    !/\/en\/?$/.test(redirect.finalUrl) ||
    (response?.request().redirectChain().length ?? 0) === 0
  ) failures.push({ redirect });
  await redirectPage.close();

  const switchPage = await browser.newPage();
  await switchPage.setViewport({ width: 1440, height: 900 });
  await switchPage.goto(`${baseUrl}/en`, { waitUntil: 'networkidle0' });
  await switchPage.waitForSelector('[data-diagram].is-drawn');

  for (const locale of ['vi', 'en']) {
    await Promise.all([
      switchPage.waitForNavigation({ waitUntil: 'networkidle0' }),
      switchPage.click(`button[lang="${locale}"]`),
    ]);
    await switchPage.waitForFunction(() =>
      [...document.querySelectorAll('[data-diagram]')].some(
        (figure) => getComputedStyle(figure).display !== 'none' && figure.classList.contains('is-drawn'),
      ),
    );
    const state = await switchPage.evaluate(() => ({
      lang: document.documentElement.lang,
      url: location.pathname,
      diagramDrawn: [...document.querySelectorAll('[data-diagram]')].some(
        (figure) => getComputedStyle(figure).display !== 'none' && figure.classList.contains('is-drawn'),
      ),
    }));
    localeSwitch.push(state);
    if (state.lang !== locale || !state.diagramDrawn) failures.push({ localeSwitch: state });
  }
  await switchPage.close();

  for (const locale of locales) {
    for (const route of routeKinds) {
      const routeName = `/${locale}/${route}`.replace(/\/$/, '');
      for (const width of widths) {
        const page = await browser.newPage();
        await page.setViewport({ width, height: width <= 414 ? 812 : 900 });
        await page.goto(`${baseUrl}${routeName}`, { waitUntil: 'networkidle0' });
        const dimensions = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        if (dimensions.scrollWidth > dimensions.clientWidth) {
          overflow.push({ route: routeName, width, ...dimensions });
        }
        await page.close();
      }

      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      await page.goto(`${baseUrl}${routeName}`, { waitUntil: 'networkidle0' });

      const results = await new AxePuppeteer(page).withTags(['wcag2a', 'wcag2aa']).analyze();
      const violations = results.violations.map(({ id, impact, nodes }) => ({
        id,
        impact,
        nodes: nodes.length,
      }));
      axe.push({ route: routeName, violations });
      if (violations.length) failures.push({ route: routeName, violations });

      amberCounts[routeName] = await page.evaluate(() =>
        [...document.querySelectorAll('body *')].filter(
          (element) => getComputedStyle(element).color === 'rgb(180, 118, 42)',
        ).length,
      );
      sectionMetrics[routeName] = await page.evaluate(() =>
        [...document.querySelectorAll('main section')].map((section) => {
          const rect = section.getBoundingClientRect();
          const style = getComputedStyle(section);
          return {
            id: section.id,
            top: Math.round(rect.top + scrollY),
            height: Math.round(rect.height),
            paddingTop: style.paddingTop,
            paddingBottom: style.paddingBottom,
          };
        }),
      );

      const order = [];
      await page.keyboard.press('Tab');
      for (let i = 0; i < 80; i += 1) {
        const focused = await page.evaluate(() => {
          const element = document.activeElement;
          if (!element || element === document.body) return null;
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          const nodeRect = element.querySelector?.('.dg-box');
          const nodeStyle = nodeRect ? getComputedStyle(nodeRect) : null;
          return {
            id: [...document.querySelectorAll('a[href], button, input, select, textarea, [tabindex="0"]')].indexOf(element),
            tag: element.tagName.toLowerCase(),
            text: (element.getAttribute('aria-label') || element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 90),
            href: element.getAttribute('href'),
            visible: rect.width > 0 && rect.height > 0,
            focusVisible:
              (style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) >= 2) ||
              Boolean(nodeStyle && Number.parseFloat(nodeStyle.strokeWidth) >= 2),
          };
        });
        if (!focused || order.some((item) => item.id === focused.id)) break;
        order.push(focused);
        if (!focused.visible || !focused.focusVisible) failures.push({ route: routeName, focus: focused });
        await page.keyboard.press('Tab');
      }
      focusOrders[routeName] = order;

      if (!route) {
        const content = await page.evaluate(() => ({
          htmlLang: document.documentElement.lang,
          projects: [...document.querySelectorAll('#work h3')].map((node) => node.textContent?.trim()),
          experiments: [...document.querySelectorAll('#experiments h3')].map((node) => node.textContent?.trim()),
          sections: [...document.querySelectorAll('main > section')].map((section) => ({
            id: section.id,
            top: Math.round(section.getBoundingClientRect().top + scrollY),
            height: Math.round(section.getBoundingClientRect().height),
          })),
          cvLink: Boolean(document.querySelector('a[download][href="/cv.pdf"]')),
        }));
        if (content.htmlLang !== locale) failures.push({ route: routeName, htmlLang: content.htmlLang });
        if (content.projects.join('|') !== 'Arbin AI Assistant|AI Agent for Student Assessment|Smart Calendar') failures.push({ route: routeName, projects: content.projects });
        if (content.experiments.join('|') !== 'UXO Chatbot & Detection System') failures.push({ route: routeName, experiments: content.experiments });
        if (content.cvLink) failures.push({ route: routeName, cvLink: true });

        for (const width of [375, 1440]) {
          await page.setViewport({ width, height: width === 375 ? 812 : 900 });
          await page.reload({ waitUntil: 'networkidle0' });
          heroProof[`${routeName}@${width}`] = await page.evaluate(() => {
            const matches = [...document.querySelectorAll('body *:not(script):not(style)')].filter(
              (element) => element.children.length === 0 && /Arbin|~500/i.test(element.textContent || ''),
            );
            return matches.map((element) => ({
              text: element.textContent?.trim(),
              top: Math.round(element.getBoundingClientRect().top + scrollY),
              withinOnePointFiveScreens:
                element.getBoundingClientRect().top + scrollY <= window.innerHeight * 1.5,
            }));
          });
          if (!heroProof[`${routeName}@${width}`].some((item) => /Arbin/i.test(item.text) && item.withinOnePointFiveScreens)) failures.push({ route: routeName, width, hero: 'Arbin outside 1.5 screens' });
          if (!heroProof[`${routeName}@${width}`].some((item) => /~500/.test(item.text) && item.withinOnePointFiveScreens)) failures.push({ route: routeName, width, hero: '~500 outside 1.5 screens' });
        }
      } else {
        const study = await page.evaluate(() => ({
          decisions: Boolean(document.querySelector('#decisions')),
          draftText: document.body.textContent?.includes('to be filled in') || document.body.textContent?.includes('chờ bổ sung'),
          diagramDescription: Boolean(document.querySelector('svg[aria-describedby] desc')),
        }));
        if (study.decisions || study.draftText || !study.diagramDescription) failures.push({ route: routeName, study });
      }
      await page.close();
    }
  }

  const report = { redirect, localeSwitch, overflow, axe, amberCounts, sectionMetrics, focusOrders, heroProof, failures };
  const summary = {
    redirect,
    localeSwitch,
    overflow,
    axe,
    amberCounts,
    sectionMetrics,
    focusCounts: Object.fromEntries(Object.entries(focusOrders).map(([route, order]) => [route, order.length])),
    heroProof: Object.fromEntries(
      Object.entries(heroProof).map(([key, items]) => [
        key,
        items.filter((item) => /Arbin AI Assistant|~500 USERS \/ DAY/i.test(item.text)).slice(0, 3),
      ]),
    ),
    failures,
  };
  console.log(JSON.stringify(process.argv.includes('--summary') ? summary : report, null, 2));
  if (failures.length || overflow.length) process.exitCode = 1;
} finally {
  await browser.close();
}
