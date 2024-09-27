<template>
  <main class="home-page page-wrapper">
    <div class="home-page__top">
      <h1 class="main-title">Find holidays in any country in the World</h1>

      <div v-if="errorMessage" class="error-message">
        <p>{{ errorMessage }}</p>
      </div>
    </div>

    <div class="home-page__countries">
      <div class="home-page__countries-conteiner">
        <h2 class="subtitle">Countries list</h2>
        <div class="search-coutry">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Country name"
            @input="filterCountries"
          />
        </div>

        <ul class="countries-list">
          <li v-for="country in filteredCountries" :key="country.countryCode">
            <router-link
              :to="`/country/${country.countryCode}`"
              class="countries-list__item"
              >{{ country.name }}</router-link
            >
          </li>
        </ul>
      </div>
      <div class="home-page__countries-conteiner countries-conteiner2">
        <div class="countries-widget">
          <h2 class="subtitle">Random countries</h2>
          <div
            v-for="country in randomCountries"
            :key="country.countryCode"
            class="countries-widget__country"
          >
            <h3>{{ country.name }}</h3>
            <div v-if="country.nextHoliday">
              <p>The nearest holiday: {{ country.nextHoliday.name }}</p>
              <p>Date: {{ country.nextHoliday.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Country {
  countryCode: string;
  name: string;
  nextHoliday?: Holiday | null;
}

interface Holiday {
  date: string;
  name: string;
}

const countries = ref<Country[]>([]);
const randomCountries = ref<Country[]>([]);
const searchQuery = ref<string>('');
const filteredCountries = ref<Country[]>([]);
const errorMessage = ref<string>('');

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const fetchCountries = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/AvailableCountries`);
    countries.value = await response.json();
    filteredCountries.value = countries.value;
  } catch (error) {
    errorMessage.value = 'Error loading countries. Try again later.';
  }
};

const getNextHoliday = async (countryCode: string): Promise<Holiday | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/NextPublicHolidays/${countryCode}`
    );
    const holidays: Holiday[] = await response.json();
    return holidays.length > 0 ? holidays[0] : null;
  } catch (error) {
    errorMessage.value = `Error loading holidays for ${countryCode}.`;
    return null;
  }
};

const getRandomCountries = async () => {
  const randomCountriesArray: Country[] = [];
  while (randomCountriesArray.length < 3) {
    const randomIndex = Math.floor(Math.random() * countries.value.length);
    const country = countries.value[randomIndex];
    if (!randomCountriesArray.includes(country)) {
      country.nextHoliday = await getNextHoliday(country.countryCode);
      randomCountriesArray.push(country);
    }
  }
  randomCountries.value = randomCountriesArray;
};

const filterCountries = () => {
  filteredCountries.value = countries.value.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
};

onMounted(async () => {
  await fetchCountries();
  await getRandomCountries();
});
</script>

<style scoped></style>
