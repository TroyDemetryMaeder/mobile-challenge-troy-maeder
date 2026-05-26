# Notes

> The `android/` and `ios/` native folders were not included in the starter repo. I generated and committed them so the project is ready to run.

## Key architectural decisions

**Built on the starter's `IWeatherService` interface**

- **Server state vs client state** — weather data is server state (remote, async, cacheable) and is managed by React Query. Location input and selected service are client state (local, synchronous) and are managed with `useState`. Keeping these two concerns separate means the fetching layer handles caching, deduplication, and background refetches, while the UI state remains simple and predictable. The `queryKey: ['weather', query, service.name]` acts as an automatic dependency — changing either value triggers a refetch with no additional wiring.

- **Error handling — two distinct layers** — input errors and fetch errors are kept separate because they have different causes and different UI treatments. `validateLocation` catches obviously bad input before it hits the network and returns a typed union (`{ valid: true, value } | { valid: false, reason }`). Network failures and API errors are handled downstream via `WeatherServiceError`, which carries a typed `code` — `NOT_FOUND`, `NETWORK`, or `SERVICE_UNAVAILABLE` — so the UI can give the user a meaningful, actionable message rather than a generic failure state.

- **Testing through separation of concerns** — the architecture was shaped with testability in mind from the start. Each service extracts its response mapping as a pure function, which means translating a raw API response into the shared `WeatherData` shape can be tested with no mocks at all. The `useWeather` hook accepts an `IWeatherService` parameter rather than owning its dependencies, which means tests can inject a mock service directly and exercise the hook's error-mapping logic without any network involvement.

---

## Trade-offs

- **State kept local to the hook as opposed to using Zustand or something similar** — works for a single screen but sharing it across multiple screens would require lifting state up or prop-drilling; a global state manager could be the cleaner solution as the app grows
- **`retry: false`** — React Query retries failed requests 3 times by default, which means a 404 for an unknown location would delay the error message by several seconds. Disabling retries shows the error immediately. The trade-off is that a genuine transient network blip won't recover silently — the user will see an error and have to try again manually.
- **`staleTime` set to 5 minutes** — React Query defaults to `staleTime: 0`, which marks data as stale immediately after fetching. That means cached data may refetch on remount, window focus, or reconnect events. Setting `staleTime` to 5 minutes allows recently fetched weather data to be reused from cache — for example when switching services and back — instead of triggering unnecessary network requests. The trade-off is that data may be up to 5 minutes old, though both APIs update relatively infrequently anyway.

---

## What I'd improve with more time

- **API response validation with Zod** — the mappers currently trust the API response shape; if a provider changes a field name it fails silently. Zod could validate the response at the boundary and fail loudly instead.
- **Debouncing** — the query fires on every valid keystroke; a `useDebounce` hook would reduce unnecessary API calls significantly
- **Per-service theming** — the architecture already supports it (`selectedService` is already in the hook), just not implemented in the time available
- **Weather icons** — a proper icon set mapped to weather conditions would improve the UI significantly over plain text condition strings
- **Consistent formatting** — some files have inconsistent import spacing due to Prettier running on save in the editor but not across all files; a format pass across the whole codebase would clean this up
- **End-to-end tests** — given how focused the app is (one screen, two services, one input), it could be worth exploring a lightweight E2E suite. A happy-path flow — enter a valid location, see weather data, switch service, see data refresh — would potentially cover the entire core user journey in a single test.
- **Android testing** — not so much an improvement, but given more time I would have set up my machine for Android testing. All testing was done on iOS.

- **Input performance** — typing in the location field feels slightly janky, which could be a simulator limitation or a genuine performance issue worth profiling. Debouncing the input would reduce the number of queries firing on each keystroke and may help, but the root cause would need investigating on a real device before drawing conclusions.

**Refactoring**

- **`act` deprecation in hook tests** — the `useWeather` tests use `act` from `@testing-library/react-native`, which is marked as deprecated in the current version. It works and all tests pass, but I'd like to revisit this and find a cleaner approach with more time.
- **`(global as any).fetch` in service tests** — uses an untyped cast to avoid pulling in a dedicated mock library like `jest-fetch-mock`. Loses some type safety on the mock, but avoids adding another library just for tests. Worth revisiting with more time.
- **Redundant code and stale comments** — worth a pass to remove any leftover comments or scaffolding from the starter that are no longer relevant now that the implementation is in place.

---

## AI usage

Claude (Claude Sonnet 4.6 via Claude Code) was used for:

- Accelerating onboarding to the starter project and understanding the existing structure
- Generating the initial `android/` and `ios/` native folders, since they were not included in the starter
- Discussing and evaluating architectural approaches — initial research was done independently then refined through AI-assisted discussion
- Assisting with implementation and scaffolding (hooks, services, screen wiring, and tests)
- Iterating on solutions based on my own review and direction — issues and improvements were identified by me, then discussed and implemented with AI assistance
- Documentation — the content and decisions are my own; AI was used to improve the clarity and readability of the writing
- Writing tests — what to test, the coverage strategy, and the architectural decisions around testability were my own; AI assisted with the implementation of the test cases

AI was not used for:

- Reading or interpreting API documentation — Open-Meteo, OpenWeatherMap, and React Query docs were reviewed directly to understand request/response structures, query behaviour, and configuration options
- Verifying WMO weather codes — these were checked against the official WMO reference table in the Open-Meteo documentation rather than relying on AI-generated mappings
- Code quality — all changes were checked and verified before each commit
- Testing — network calls, caching behaviour, and end-to-end flows were verified directly in the app
