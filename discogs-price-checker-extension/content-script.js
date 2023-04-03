const apiKey = 'zMYjIWoyvQwxELwSgHFB'; // Replace with your Discogs API key
const apiSecret = 'rICpSLfRHfePzyaCSJYhYNEYvfXKNXPU'


async function searchDiscogs(query) {
  const response = await fetch(`https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&key=${apiKey}&secret=${apiSecret}`);
  return response.json();
}

async function getMasterInfo(masterId) {
  const response = await fetch(`https://api.discogs.com/masters/${masterId}?key=${apiKey}&secret=${apiSecret}`);
  return response.json();
}

async function displayPrice(videoTitle, masterInfo) {
  const videoDetails = document.querySelector('#info #info-contents');
  const priceInfo = document.createElement('p');
  priceInfo.textContent = `Lowest price on Discogs: ${masterInfo.lowest_price} ${masterInfo.currency}`;
  videoDetails.appendChild(priceInfo);
}

function waitForElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
  } else {
    setTimeout(() => waitForElement(selector, callback), 500);
  }
}

waitForElement('.title.style-scope.ytd-video-primary-info-renderer', (videoTitleElement) => {
  const videoTitle = videoTitleElement.textContent.trim();
  searchDiscogs(videoTitle).then((data) => {
    if (data.results && data.results.length > 0) {
      const masterId = data.results[0].master_id;
      if (masterId) {
        getMasterInfo(masterId).then((masterInfo) => {
          displayPrice(videoTitle, masterInfo);
        });
      }
    }
  });
});