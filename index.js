// Import stylesheets
import './style.css';

const apiKey = 'zMYjIWoyvQwxELwSgHFB'; // Replace with your Discogs API key
const apiSecret = 'rICpSLfRHfePzyaCSJYhYNEYvfXKNXPU'; // Replace with your Discogs API secret
const searchButton = document.getElementById('searchButton');
const songList = document.getElementById('songList');
const results = document.getElementById('results');

async function searchDiscogs(query) {
  const response = await fetch(
    `https://api.discogs.com/database/search?q=${encodeURIComponent(
      query
    )}&key=${apiKey}&secret=${apiSecret}`
  );
  return response.json();
}

async function getMasterInfo(masterId) {
  const response = await fetch(
    `https://api.discogs.com/masters/${masterId}?key=${apiKey}&secret=${apiSecret}`
  );
  return response.json();
}

async function displayPrices(query, masterInfo) {
  const listItem = document.createElement('li');
  listItem.textContent = `${query} - Master ID: ${masterInfo.id} - Lowest price: ${masterInfo.lowest_price}`;
  results.appendChild(listItem);
}

searchButton.addEventListener('click', async () => {
  results.innerHTML = '';
  const songs = songList.value.split('\n');
  for (const song of songs) {
    const data = await searchDiscogs(song);
    if (data.results && data.results.length > 0) {
      const masterId = data.results[0].master_id;
      if (masterId) {
        const masterInfo = await getMasterInfo(masterId);
        displayPrices(song, masterInfo);
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = `${song} - No master release found`;
        results.appendChild(listItem);
      }
    } else {
      const listItem = document.createElement('li');
      listItem.textContent = `${song} - No results found`;
      results.appendChild(listItem);
    }
  }
});
