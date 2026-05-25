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
