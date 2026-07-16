const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const refreshBtn = document.getElementById("refreshBtn");

const API_URL = "https://hn.algolia.com/api/v1/search_by_date?tags=story&query=AI&hitsPerPage=15";

function timeAgo(unixTimestamp) {
  const seconds = Math.floor(Date.now() / 1000) - unixTimestamp;
  const hours = Math.floor(seconds / 3600);
  if (hours < 1) return "just now";
  if (hours < 24) return hours + "h ago";
  return Math.floor(hours / 24) + "d ago";
}

function render(hits) {
  resultsEl.innerHTML = "";
  if (!hits.length) {
    resultsEl.innerHTML = "<div class='meta'>No results returned.</div>";
    return;
  }
  hits.forEach(hit => {
    const div = document.createElement("div");
    div.className = "story";

    const link = document.createElement("a");
    link.href = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
    link.target = "_blank";
    link.textContent = hit.title || "(untitled)";

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${hit.points || 0} points · ${hit.num_comments || 0} comments · ${timeAgo(hit.created_at_i)}`;

    div.appendChild(link);
    div.appendChild(meta);
    resultsEl.appendChild(div);
  });
}

async function loadStories() {
  statusEl.textContent = "Loading...";
  resultsEl.innerHTML = "";
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      statusEl.textContent = "Request failed: " + response.status;
      return;
    }
    const data = await response.json();
    statusEl.textContent = `Updated ${new Date().toLocaleTimeString()}`;
    render(data.hits || []);
  } catch (err) {
    statusEl.textContent = "Error: " + err.message;
  }
}

refreshBtn.addEventListener("click", loadStories);
document.addEventListener("DOMContentLoaded", loadStories);
loadStories();
