import { City, State } from "country-state-city";

export function createLocationSlug(city, state) {
  if (!city || !state) return "";
  const citySlug = city.toLowerCase().replace(/\s+/g, "-");
  const stateSlug = state.toLowerCase().replace(/\s+/g, "-");

  return `${citySlug}-${stateSlug}`;
}

export function parseLocationSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return { city: null, state: null, isValid: false };
  }
  const parts = slug.split("-");
  if (parts.length < 2) {
    return { city: null, state: null, isValid: false };
  }
  const cityName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const stateName = parts
    .slice(1)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");

  const indianStates = State.getStatesOfCountry("IN");

  const stateObj = indianStates.find(
    (state) => state.name.toLowerCase() === stateName.toLowerCase(),
  );
  if (!stateObj) {
    return { city: null, state: null, isValid: false };
  }

  const cities = City.getCitiesOfCountry("IN", stateObj.isoCode);
  const cityObj = cities.some(
    (city) => city.name.toLowerCase() === cityName.toLowerCase(),
  );
  if (!cityObj) {
    return { city: null, state: null, isValid: false };
  }
  return { city: cityName, state: stateName, isValid: true };
}
