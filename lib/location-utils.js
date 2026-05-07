import { City, State } from "country-state-city";

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function normalizeName(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCase(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function createLocationSlug(city, state) {
  if (!city || !state) return "";

  const citySlug = slugify(city);
  const stateSlug = slugify(state);

  return `${citySlug}--${stateSlug}`;
}

export function parseLocationSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return {
      city: null,
      state: null,
      isValid: false,
    };
  }

  const parts = slug.split("--");

  if (parts.length !== 2) {
    return {
      city: null,
      state: null,
      isValid: false,
    };
  }

  const cityName = titleCase(parts[0].replace(/-/g, " "));
  const stateName = titleCase(parts[1].replace(/-/g, " "));

  const indianStates = State.getStatesOfCountry("IN");

  const stateObj = indianStates.find(
    (state) => normalizeName(state.name) === normalizeName(stateName),
  );

  if (!stateObj) {
    return {
      city: null,
      state: null,
      isValid: false,
    };
  }

  const cities = City.getCitiesOfState("IN", stateObj.isoCode);

  const matchedCity = cities.find(
    (city) => normalizeName(city.name) === normalizeName(cityName),
  );

  if (!matchedCity) {
    return {
      city: null,
      state: null,
      isValid: false,
    };
  }

  return {
    city: matchedCity.name,
    state: stateObj.name,
    isValid: true,
  };
}
