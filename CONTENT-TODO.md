# What the site still needs from you

Everything on the site right now is either a fact from your brief or a labelled
placeholder. Nothing is invented. This file lists the gaps, in the order I would
fill them.

Answers can be rough — bullet points are fine. I will write them into the
`{ en, vi }` fields in the right voice and keep the two languages the same length
so the layout does not shift.

---

## 1. Blocking: the Key decisions sections

The brief calls this "phần quan trọng nhất" and it is the part I cannot write for
you. There are 14 cards across the four case studies, each rendered with a dashed
border and a **Draft — to be filled in** badge. Each one needs three things:

- **Problem** — what forced a choice? What broke, or what was at risk?
- **Choice** — what you picked, specifically (numbers, names, settings).
- **Trade-off** — what it cost. A decision with no stated cost is not a decision.

### Arbin AI Assistant — `content/projects/arbin.ts`

**Qdrant vs Pinecone**
- Was self-hosting a requirement, or a preference? Why?
- Was there a cost ceiling, and roughly what was it?
- Did metadata filtering (for the permission tiers) drive the choice?
- What did you give up by not using a managed service?

**Chunking strategy**
- Chunk size and overlap, in tokens or characters?
- Do you split on document structure (headings, sections) or a fixed count?
- Do PDFs and crawled pages get different treatment? If so, how?
- What broke with the first approach you tried?

**Multi-turn context**
- How do follow-up questions get their referent — query rewriting, a rolling
  summary, a fixed window of N turns, something else?
- How many turns of history do you keep?
- What did that add to latency or token cost per turn?

**Permission tiers in retrieval**
- One collection with a filter, or separate collections per tier?
- Where is the tier check enforced — the API layer, the retrieval call, or both?
- What stops the filter being forgotten on a new endpoint?

### AI Agent for Student Assessment — `content/projects/student-assessment.ts`

**Structured output, not prose**
- What went wrong when the model answered in free text? Parse failures, missing
  fields, invented students?
- What does the JSON schema look like (field names are enough)?
- How does the prompt enforce it — tool use, an example, a validation retry?

**Batch vs per-request**
- Why is real-time the wrong shape here — cost, rate limits, or nobody needing
  the answer within seconds?
- Batch size and schedule?
- Roughly what does one run cost?

**Retry & failure handling**
- Which failures actually happened: rate limits, timeouts, malformed JSON,
  partial batches?
- Retry count and backoff shape?
- What happens to a batch that never succeeds — is anyone told?

**Google Workspace as the database**
- Why Sheets and Docs rather than a real database?
- How is the sheet laid out?
- Have you hit API quotas? Has anyone edited the store by accident?

### Smart Calendar — `content/projects/smart-calendar.ts`

**Suggest, do not auto-assign**
- Full auto-scheduling is technically possible. What made you stop at
  suggestions — teacher preferences the data cannot see, or trust?
- What does the engine rank slots on?

**Two-way sync & conflicts**
- When the app and Google Calendar disagree, which side wins?
- How do you detect a change on the Google side — polling, webhook, push
  notifications?
- What does that cost in API quota or freshness?

**XLSX as an output format**
- Why an export at all, when the schedule is already on screen?
- What does the sheet contain, and who opens it?

### UXO Chatbot & Detection — `content/projects/uxo.ts`

**Two models, not one multimodal model**
- A single vision-language model could answer both kinds of question. Why keep
  the paths separate?

**Labelling the dataset by hand**
- How many images, how many classes, where did the images come from?
- What augmentations did you apply in Roboflow?

**Confidence threshold for a safety alert**
- A false negative is far worse than a false positive here. Where did you set the
  threshold, and why that number?
- How is the alert worded so a low-confidence hit is not read as certainty?

---

## 2. Missing numbers

The `results` block of each case study is where figures go. I only filled in what
your brief actually stated, because the brief said not to invent numbers.

| Project | Currently shown | Would like |
| --- | --- | --- |
| Arbin | ~500 daily users · 3 tiers · 500+ sources | Anything about answer quality — deflection rate, how often supporters rate an answer good, average response time. |
| Student Assessment | 3 metrics per student | Students or classes per run. Time a report used to take by hand vs now. How long a full run takes. |
| Smart Calendar | 20 teachers | Classes scheduled per week or term. Time the coordinator used to spend. |
| UXO | 2 modalities | Detector metrics from the actual training run: mAP, precision/recall, dataset size, number of classes. Read them off the run — do not estimate. |

## 3. Files to add

- **`public/cv.pdf`** — the build detects this file automatically. Until it
  exists, no download control is rendered.
- **Screenshots and demo videos** — each case study has boxes at the right aspect
  ratio with the exact path printed inside them, e.g.
  `public/media/arbin/01-chat.png`. Dropping files in does not move anything.

## 4. Facts to confirm before publishing

- **Project status.** The previous content described Arbin, Student Assessment,
  and Smart Calendar as in production, so they are currently mapped to `live`.
  Confirm or change each one to `in-progress` / `prototype` as appropriate.
- **LinkedIn URL.** `linkedinUrl` in `content/profile.ts` is deliberately `null`.
  Add the verified profile URL to publish it in Contact and JSON-LD `sameAs`.

## 5. Decisions I made on your behalf

Flagging these because they are judgement calls, not facts, and you may disagree:

- **UXO is presented as a prototype**, so the status-derived metric does not
  count it as a live system. A technical interviewer will dig here, and being
  caught overstating costs more than the extra number gains.
- **"Nine years"** everywhere, counting the overall 2015–2025 backend and
  integration period.
- **No dark-mode toggle.** Your brief's reason for a light background (recruiters
  read fast and print) argues against one. I added a print stylesheet instead.
