// Import stylesheets
import './style.css';

const apiKey = 'zMYjIWoyvQwxELwSgHFB'; // Replace with your Discogs API key
const apiSecret = 'rICpSLfRHfePzyaCSJYhYNEYvfXKNXPU'; // Replace with your Discogs API secret
const searchButton = document.getElementById('searchButton');
const songList = document.getElementById('songList');
const resultsTable = document.getElementById('resultsTable');
const tableHeaders = ['Song', 'Master ID', 'Lowest Price'];

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

function createTableHeader() {
  const tableHeader = document.createElement('thead');
  const row = document.createElement('tr');
  for (const header of tableHeaders) {
    const cell = document.createElement('th');
    cell.textContent = header;
    row.appendChild(cell);
  }
  tableHeader.appendChild(row);
  return tableHeader;
}

function createTableRow(song, masterInfo) {
  const row = document.createElement('tr');
  const songCell = document.createElement('td');
  songCell.textContent = song;
  const masterIdCell = document.createElement('td');
  masterIdCell.textContent = masterInfo.id;
  const priceCell = document.createElement('td');
  priceCell.textContent = masterInfo.lowest_price;
  row.appendChild(songCell);
  row.appendChild(masterIdCell);
  row.appendChild(priceCell);
  return row;
}

function clearTable() {
  const rowCount = resultsTable.rows.length;
  for (let i = rowCount - 1; i > 0; i--) {
    resultsTable.deleteRow(i);
  }
}

searchButton.addEventListener('click', async () => {
  clearTable();
  const songs = songList.value.split('\n');
  const tableHeader = createTableHeader();
  resultsTable.appendChild(tableHeader);
  for (const song of songs) {
    const data = await searchDiscogs(song);
    if (data.results && data.results.length > 0) {
      const masterId = data.results[0].master_id;
      if (masterId) {
        const masterInfo = await getMasterInfo(masterId);
        const tableRow = createTableRow(song, masterInfo);
        resultsTable.appendChild(tableRow);
      } else {
        const row = document.createElement('tr');
        const songCell = document.createElement('td');
        songCell.textContent = song;
        const messageCell = document.createElement('td');
        messageCell.textContent = 'No master release found';
        row.appendChild(songCell);
        row.appendChild(messageCell);
        resultsTable.appendChild(row);
      }
    } else {
      const row = document.createElement('tr');
      const songCell = document.createElement('td');
      songCell.textContent = song;
      const messageCell = document.createElement('td');
      messageCell.textContent = 'No results found';
      row.appendChild(songCell);
      row.appendChild(messageCell);
      resultsTable.appendChild(row);
    }
  }
});
