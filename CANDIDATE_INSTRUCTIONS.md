# Weather App — Technical Challenge

Thanks for taking the time to work on this challenge. Please read this whole document before starting.

## Time expectation

**Roughly 3–4 hours.** Please do not spend significantly more than this.

If you run out of time before completing everything, that's fine — document what you would have done next in the `NOTES.md` file (or extend this README). We'd rather see thoughtful, partial work than a rushed full submission.

## What we're evaluating

In rough order of importance:

1. **Architecture and modularity** — how you separate concerns, and how easy it would be to extend the app.
2. **Testability and tests** — at minimum, the service abstraction and input validation should be tested.
3. **Code clarity** — naming, structure, readability. We should be able to read your code without you in the room.
4. **Reasoning and trade-offs** — explained in your `NOTES.md`.

We care **less** about: visual polish, exhaustive feature coverage, perfect error states, animations, or styling beyond what's needed to demonstrate the UI works.

## The task

Build a small mobile app where the user enters a location and sees the current weather for that location.

### Functional requirements

- A text input where the user can enter a location.
- A display area showing weather for the entered location.
- A toggle (or selector) that switches between **two different weather services**.
- When a location is already entered and the user switches services, the weather should refresh automatically using the newly selected service.
- Input validation on the location field. Decide for yourself what counts as valid input and document your decision.

### Suggested weather services

We suggest:

- **Open-Meteo** — https://open-meteo.com/ (no API key required, easiest to start with)
- **OpenWeatherMap** — https://openweathermap.org/api (free tier, requires signing up for an API key)

Feel free to substitute one or both if you prefer. Both services should return at minimum the current temperature and a textual condition; beyond that, choose what to display.

### Technical constraints

- Must be built with **React Native + TypeScript** (the starter is configured for this).
- **Unit tests are required** for at minimum:
  - your service abstraction layer (mocks are fine — do not hit live APIs from tests)
  - your input validation logic
- The starter repo includes Jest and React Native Testing Library already configured.

### Architectural focus

Design your service layer so that **adding or replacing a weather provider is straightforward**. We'll dig into this in the follow-up interview.

## What's provided

The starter repo gives you:

- A working React Native + TypeScript project setup
- Jest, React Native Testing Library, ESLint, Prettier configured
- An `IWeatherService` interface and empty service stubs to implement
- Stub components and screen — you decide how state flows
- An empty validator stub

What's **not** provided (deliberately):

- State management — local state, Context, custom hooks, or a library: your call.
- Error-handling patterns — your call.
- Theming — a minimal `colors.ts` is there; extend or replace as you see fit.
- A passing test example — write your tests in the style you prefer.

You can use the starter or start fresh; we recommend the starter to save setup time.

## Deliverables

1. **A link to your repository** (GitHub, GitLab, etc.) — public or share access with us.
2. **A `NOTES.md` file** at the repo root covering:
   - How to run the project (if different from the starter)
   - **Key architectural decisions** and why you made them
   - **Trade-offs** you made because of the time limit
   - What you'd improve or change with more time
   - Anything you'd like us to know before the follow-up

## On using AI tools
You may use AI assistants (Claude, ChatGPT, Copilot, Cursor, etc.) — this reflects how real work happens. We ask two things:

In your NOTES.md, briefly describe how you used AI: which tools, for which parts (scaffolding, debugging, generating tests, brainstorming architecture, etc.), and where you chose not to use it.
Be prepared to explain and defend every architectural decision and every line of non-trivial code in the follow-up interview. If you can't explain why something is the way it is, that's the signal we care about.

## For the follow-up interview

We'll do a technical discussion (~1 hour) where we'll act somewhat like a customer and walk through your solution. Come prepared to discuss:

- How you'd **adapt the UI** (colors, theming, layout) depending on which weather service is selected.
- How you'd handle one of the services going **down or being deprecated** — how easy is it to swap?
- How you'd **extend** the app: more services, caching, offline mode, location autocomplete, etc.

You don't need to have implemented any of these; we want to discuss your thinking.

## Questions?

If anything is unclear, please ask before starting. Clarifying questions are welcome and won't count against you.

Good luck — we're looking forward to seeing what you build.
