# Notes

## 1. Architecture and modularity

The app is built around four distinct layers, each with a single responsibility:

**Services — data fetching and translation.** Each service knows how to talk to one specific API. URL construction, API keys, parsing the raw response, mapping it to `WeatherData`. Nothing else in the app touches any of this. The shared contract is `IWeatherService`:

```ts
interface IWeatherService {
  readonly name: string;
  fetchWeather(location: Location): Promise<WeatherData>;
}
```

Adding a new provider is one new file that implements this interface and one line in the service registry. Removing one is the reverse.

**`useWeather` hook — orchestration.** Knows which service is selected, calls `fetchWeather`, and manages loading and error state via React Query. Has no knowledge of what the UI looks like or how any specific API works. `queryKey: ['weather', location, selectedService]` acts as a dependency array — React Query automatically refetches whenever either value changes, satisfying the requirement that switching services re-fetches for the current location with no additional wiring.

**Screen — wiring.** Calls the hook, receives the results, passes them down as props. No fetching logic, no service knowledge. Connects the hook to the components.

**Components — display.** `WeatherDisplay`, `LocationInput`, `ServiceToggle`. Receive props and render them. Given the same props they always render the same output.

Each layer only knows about the layer directly below it. The practical benefit: you can swap a weather provider without touching the hook, screen, or components. You can redesign the UI without touching the hook or services. You can test each layer in isolation.

---

## 2. Testability and tests

The architecture was designed with testability in mind from the start. The key decision was separating the mapping logic from the fetching logic inside each service.

Each service does two things: make an HTTP call, and translate the raw response into `WeatherData`. The translation is extracted as a pure function (`mapOpenMeteoResponse`, `mapOpenWeatherMapResponse`). These can be tested directly with no mocks — just input in, output out. This is where bugs are most likely to live, and it is the easiest possible thing to test.

Similarly, `weatherCodeToCondition` is extracted as its own pure function so each weather code can be verified individually with zero setup.

The fetch-level tests are then kept minimal — just verifying that 404s and network failures produce the correct `WeatherServiceError` code. `validateLocation` is a pure function with no dependencies and requires no setup at all.

The result is a test suite where the interesting logic is tested without mocks, and mocks are only used for the thin layer of HTTP error handling.

---

## 3. Input validation

One rule: the input must be at least 2 characters after trimming.

We deliberately kept this minimal. A "must contain a letter" rule was considered but dropped — both Open-Meteo and OpenWeatherMap accept postcodes like `"90210"` or `"SW1A"` as valid queries, so rejecting digit-only input would block real use cases. A character allowlist would risk blocking valid place names from non-Latin scripts. The validator's only job is to prevent obviously empty or trivial input from hitting the network. Anything that passes is close enough — if the location doesn't exist, the API returns `NOT_FOUND` and we surface that to the user.

A maximum length is a real concern — very long strings shouldn't hit the network. However, any specific number would be arbitrary without data on what real queries look like, so this is left to the API for now. This is worth revisiting.

**Why 2 characters?** It's the shortest a real place name or postcode can reasonably be — "LA" is valid, a single "a" is not. It's a floor, not an arbitrary cap.

**Why trim first?** Two reasons. First, correctness of our own rule: `"  a  "` is 5 characters and would pass a naive 2-char check, even though the user only typed one letter. Trimming means we check what they actually typed. Second, React Query uses the location as part of the cache key — `"London"` and `"London "` would be cached separately without trimming. The trimmed value is also what gets sent to the API.

---
