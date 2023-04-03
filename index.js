// Import stylesheets
import './style.css';

const apiKey = 'your-api-key'; // Replace with your Discogs API key
const apiSecret = 'your-api-secret'; // Replace with your Discogs API secret
const searchButton = document.getElementById('searchButton');
const songList = document.getElementById('songList');
const results = document.getElementById('results');

async function searchDiscogs(query) {
  const response = await fetch(`https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&key=${apiKey}&secret=${apiSecret}`);
  return response.json();
}

async function getPriceSuggestions(releaseId) {
  const response = await fetch(`https://api.discogs.com/marketplace/price_suggestions/${releaseId}?key=${apiKey}&secret=${apiSecret}`);
  return response.json();
}

async function displayPrices(data) {
  results.innerHTML = '';
  for (const result of data.results) {
    const listItem = document.createElement('li');
    listItem.textContent = `${result.title} - ${result.type} - ${result.uri}`;

    if (result.type === 'release') {
      const priceSuggestions = await getPriceSuggestions(result.id);
      const priceList = document.createElement('ul');
      for (const condition in priceSuggestions) {
        const priceItem = document.createElement('li');
        priceItem.textContent = `${condition}: ${priceSuggestions[condition].value} ${priceSuggestions[condition].currency}`;
        priceList.appendChild(priceItem);
      }
      listItem.appendChild(priceList);
    }

    results.appendChild(listItem);
  }
}

searchButton.addEventListener('click', async () => {
  const songs = songList.value.split('\n');
  for (const song of songs) {
    const data = await searchDiscogs(song);
    await displayPrices(data);
  }
});