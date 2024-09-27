<template>
  <main class="coutry-page">
    <h1 class="main-title">Holidays in {{ countryName }}</h1>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <ul v-if="holidays.length > 0" class="country-holidays">
      <li
        v-for="holiday in holidays"
        :key="holiday.date"
        class="country-holidays__item"
      >
        <p>
          {{ holiday.name }} - {{ holiday.date }} ({{
            holiday.types.join(', ')
          }})
        </p>
      </li>
    </ul>

    <div class="country-years">
      <button
        v-for="year in years"
        :key="year"
        @click="fetchHolidays(year)"
        class="country-years__btn"
      >
        {{ year }}
      </button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
}

interface CountryInfo {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: string[];
}

const route = useRoute();
const countryKey = route.params.countryKey as string;

const holidays = ref<Holiday[]>([]);
const countryName = ref('');
const years = ref(Array.from({ length: 11 }, (_, i) => 2020 + i));
const errorMessage = ref('');
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const fetchCountryInfo = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/CountryInfo/${countryKey}`);
    if (!response.ok) {
      throw new Error(`Country request error: ${response.status}`);
    }
    const countryData: CountryInfo = await response.json();
    countryName.value = countryData.commonName || countryData.officialName;
  } catch (error) {
    errorMessage.value = 'Failed to load country information. Try again later.';
  }
};

const fetchHolidays = async (year: number) => {
  errorMessage.value = '';
  try {
    const response = await fetch(
      `${apiBaseUrl}/PublicHolidays/${year}/${countryKey}`
    );
    if (!response.ok) {
      throw new Error(`There is an error: ${response.status}`);
    }
    holidays.value = await response.json();
    if (holidays.value.length === 0) {
      errorMessage.value = 'No holidays were found.';
    }
  } catch (error) {
    errorMessage.value = 'Failed to load holidays. Try again later.';
    holidays.value = [];
  }
};

onMounted(() => {
  fetchCountryInfo();
  fetchHolidays(new Date().getFullYear());
});
</script>

<style scoped></style>
