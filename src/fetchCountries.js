export function fetchCountries(name) {
    const url = 'https://restcountries.com/v3.1/name';
    return fetch(`${url}/${name}?fields=name,capital,population,flags,languages`)
        .then(responce =>{
      if (responce.ok) {
         return responce.json();
      }
    throw new Error('Error fetching data');
    })
}