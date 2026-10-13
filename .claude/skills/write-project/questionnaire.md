# Questionnaire

## Part 1: core questions (ask all of them, in one message, before reading the code)

1. **Work or Personal?** If Work, what should the employer and platform be called on the
   page? (The existing write-ups never name the employer. They say "the automation
   platform", "the web application".)
2. **When?** Start year and end year, or "ongoing".
3. **What problem did it solve, and for whom?** One or two sentences in your own words.
   What was painful or impossible before?
4. **What was your role, and how was it built?** Solo, lead, one of a team (how big)?
   Which parts were yours? Was it AI-assisted, and how much (guided, pair-programmed,
   mostly generated and reviewed)? The role becomes the meta row ("Solo", "Lead
   developer", ...). Leave it blank to omit it. AI assistance is stated on the page.
5. **What should a reader come away remembering?** The part you're proudest of, or
   enjoyed most. "Nothing in particular, it was a quick project" is a fine answer. The
   page then stays modest.
6. **Any numbers?** Scale, speed, volume, adoption, time saved (e.g. "500 Mb/s", "200+
   operations", "prevented hundreds of regressions"). Only ones you're comfortable
   publishing.
7. **Live link?** A URL to the running project, if there is one.
8. **Write-up, case study, or both?** The write-up is the default (the "how it works"
   page). A case study is a short first-person story: why you built it, what you learned.
   See Web Portfolio's.
9. **Anything to leave out?** Names (employer, clients, internal product names), features
   still under wraps, security-sensitive details. Names listed here are passed to the lint
   as `--forbid` and must never appear on the page.
10. **Related projects on the site?** Anything this builds on, replaces, or pairs with.

## Part 2: follow-ups (after reading the code, 2–4 questions)

Generate these from what you found. They exist to settle what the code can't tell you:

- **Is this decision worth featuring?** For each notable implementation choice you found
  (a threading model, a storage trick, a protocol), ask whether it's major enough to
  mention. The default is no.
- **What's the story behind this component?** When a component's purpose isn't obvious
  from the code, or seems to exist for a historical reason.
- **Which of these is the heart of it?** When the code has more major components than a
  page should carry, ask which ones matter.
- **Is this still accurate?** When the README and the code disagree, or the code shows
  half-finished work.

Don't ask what you can read for yourself (tech list, file layout, which libraries are used).
