const url = "/.netlify/functions/getNews?query=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(`${url}${query}`);
    const data = await res.json();

    // Check if articles exist before proceeding
    if (!data.articles) {
      console.error("Error fetching articles:", data.message || "Unknown error");
      alert("Unable to load news. Please try again later.");
      return;
    }

    bindData(data.articles, query);
  } catch (err) {
    console.error("Fetch error:", err);
    alert("An unexpected error occurred while fetching news.");
  }
}

function bindData(articles, query) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");
  cardsContainer.innerHTML = "";

  const resultsMessage = document.getElementById("results-message");
  resultsMessage.innerHTML = `<h2>Showing results for the topic: <strong>${query || "No topic selected"}</strong></h2>`;

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let curSelectedNav = null;

function onNavItemClick(id) {
  fetchNews(id);
const navItem = document.getElementById(id);

if (!navItem) {
    console.warn(`No nav item found for ID: ${id}`);
    return;
}

curSelectedNav?.classList.remove("active");
curSelectedNav = navItem;
curSelectedNav.classList.add("active");


  const resultsMessage = document.getElementById("results-message");
  resultsMessage.innerHTML = `<h2>Showing results for the topic: <strong>${id}</strong></h2>`;
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
  searchText.value = "";
  searchText.focus();
});

searchText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchButton.click();
  }
});
