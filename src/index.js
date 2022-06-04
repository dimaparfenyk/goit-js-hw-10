import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputField: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputField.addEventListener('input', debounce(onInputFieldSearch, DEBOUNCE_DELAY));

function onInputFieldSearch(e) {

  const countryName = e.target.value.trim();

  if (countryName === '') {
     refs.countryInfo.innerHTML = '';
          refs.countryList.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
      .then(data => {
        
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        refs.inputField.requestFullscreen();
        return;
      }

        renderMarkup(data);
        
    })
      .catch(error => {

          Notify.failure('Oops, there is no country with that name');
          
          refs.countryInfo.innerHTML = '';
          refs.countryList.innerHTML = '';
          console.log('Error',error)
    });
}

function renderMarkup(countries) {

  if (countries.length > 1) {
    refs.countryList.innerHTML = createPreviewMarkup(countries);
      refs.countryInfo.innerHTML = '';
    }
  if(countries.length === 1)  {
    refs.countryInfo.innerHTML = createCountryInfoMarkup(countries);
      refs.countryList.innerHTML='';
  }
}

function createPreviewMarkup(countries) {

  return countries
    .map(
      ({ flags, name }) =>
        `<li class="country-list_item"><img src="${flags.svg}" alt="${name.official}" width="60" height="40"><p style="font-weight:bold">${name.official}</p></li>`
    )
    .join('');
}

function createCountryInfoMarkup(countries) {

  return countries
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<div class="country-img-container">
            <img src="${flags.svg}" alt="${name.official}" width="80" height="60"/>
            <h2>${name.official}</h2>
        </div>
        <ul>
          <li><p><span>Capital:</span> ${capital}</p></li>
          <li><p><span>Population:</span> ${population}</p></li>
          <li><p><span>Languages:</span> ${Object.values(languages)}</p></li>
        </ul>`
    )
    .join('');
}
