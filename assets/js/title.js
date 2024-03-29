var searchSection = document.querySelector("#search-results");
var searchContainer = document.querySelector("#result-container");
var searchInputText = document.querySelector("#search-title");
var searchButton = document.querySelector("#search-title-btn");


function getAnime(animeCriteria) {
  var animeTitleAPI = "https://api.jikan.moe/v4/anime?q=TITLE&sfw";
  var animeTitle = animeCriteria;
  fetch(animeTitleAPI.replace("TITLE", animeTitle))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      getSearchData(data.data);
    });
}

function getSearchData(data) {
  var searchResults = [];
  CleanSearchResults();

  for (var i = 0; i < animeReturnCount && i < data.length; i++) {
    var anime = {
      title: data[i].title,
      image: data[i].images.jpg.image_url,
      synopsis: data[i].synopsis,
      animeId: data[i].mal_id
    };

    searchResults.push(anime);
  }
  DisplayResults(searchResults);
  return searchResults;
}


function DisplayResults(searchResults) {
  ReceiveSearchResults(searchResults);
  for (var i = 0; i < searchResults.length; i++) {
    var animeNode = searchContainer.cloneNode(true);
    animeNode.id = animeNode.id + "-" + i;
    var animeTitle = animeNode.querySelector("#anime-title");
    var animeSynopsis = animeNode.querySelector("#anime-synopsis");
    var animeImg = animeNode.querySelector("#anime-icon");

    var animeCollapse = animeNode.querySelector("#result-header");
    animeCollapse.setAttribute("aria-controls", "id" + i);
    animeCollapse.setAttribute("href", "#id" + i);
    var collapseContent = animeCollapse.nextElementSibling;
    collapseContent.id = "id" + i;

    animeTitle.innerHTML = searchResults[i].title;
    animeTitle.dataset.id = searchResults[i].animeId;
    animeSynopsis.firstElementChild.innerHTML = searchResults[i].synopsis;
    animeImg.firstElementChild.src = searchResults[i].image;

    var favoriteBtn = animeNode.querySelector("#favorite-button");
    let favoriteIcon = animeNode.querySelector(".fa-solid.fa-star");
    let notFavoriteIcon = animeNode.querySelector(".fa-regular.fa-star");


    if (IsAnimeSaved(ScrapeAnimeObject(favoriteBtn)))
    {
      favoriteIcon.classList.remove("collapse");
      notFavoriteIcon.classList.add("collapse");
      favoriteBtn.querySelector("p").textContent = "Favorited";
    }

    favoriteBtn.addEventListener("click", function (event) {
      toggleFavoriteAnime(event.target, favoriteIcon, notFavoriteIcon);
    });

    searchSection.append(animeNode);
  }
}


function searchAnime() {
  var anime = searchInputText.value || '';
  console.log(anime);
  if (anime !== '') {
    getAnime(anime);
  }
}


searchButton.addEventListener("click", searchAnime);
searchInputText.addEventListener("keyup", function(event){
  if (event.key === "Enter") {
    searchAnime();
  }
});


function toggleFavoriteAnime(favoriteBtn, favoriteIcon, notFavoriteIcon) {
  if (!favoriteBtn.closest(".result-content").dataset.canFav)
    return;

  if (favoriteBtn.getAttribute("id" == "favorite-button")) {
    if (favoriteIcon.classList.contains("collapse")) {
      favoriteIcon.classList.remove("collapse");
      notFavoriteIcon.classList.add("collapse");
      favoriteBtn.querySelector("p").textContent = "Favorited";

      SaveAnime(ScrapeAnimeObject(favoriteBtn));
    } else {
      favoriteIcon.classList.add("collapse");
      notFavoriteIcon.classList.remove("collapse");
      favoriteBtn.querySelector("p").textContent = "Favorite";

      RemoveAnime(ScrapeAnimeObject(favoriteBtn));
    }
  } else {
    if (favoriteIcon.classList.contains("collapse")) {
      favoriteIcon.classList.remove("collapse");
      notFavoriteIcon.classList.add("collapse");
      favoriteBtn.parentElement.querySelector("p").textContent = "Favorited";

      SaveAnime(ScrapeAnimeObject(favoriteBtn));
    } else {
      favoriteIcon.classList.add("collapse");
      notFavoriteIcon.classList.remove("collapse");
      favoriteBtn.parentElement.querySelector("p").textContent = "Favorite";

      RemoveAnime(ScrapeAnimeObject(favoriteBtn));
    }
  }
}

function ScrapeAnimeObject(startPoint) {
  var point = startPoint.closest('.result-content');


  var anime = {
    title: point.querySelector("#anime-title").textContent,
    synopsis: point.querySelector("#anime-synopsis").firstElementChild.textContent,
    image: point.querySelector(".anime-img").getAttribute("src"),
    animeId: point.querySelector("#anime-title").dataset.id,
    products: []
  }
  

  var products = point.querySelector("#gift-ideas").querySelectorAll(".product-card");
  for (var i = 0; i < products.length ; i++){
    var prod = {
      name: products[i].querySelector('h4').textContent,
      price: products[i].querySelector('p').textContent,
      image: products[i].querySelector('img').getAttribute("src"),
      url: products[i].querySelector('a').getAttribute("href")
    }
    anime.products.push(prod);
  }
  return anime;
}

function IsAnimeSaved(anime){
  var favoritedAnime = JSON.parse(localStorage.getItem(favAnime)) || [];

  for (var i = 0; i < favoritedAnime.length; i++){
    if (favoritedAnime[i].animeId == anime.animeId)
      return true;
  }
  return false;
}

searchSection.addEventListener("click", function(event) {
  if (event.target.id === 'result-header' || event.target.parentNode.id === 'result-header') {
    let caret = event.target.parentNode.querySelector(".fa-caret-down");
    if (caret.classList.contains("rotate-180")) {
      caret.classList.remove("rotate-180");
    } else {
      caret.classList.add("rotate-180");
    }
  }
});

function CleanSearchResults() {
  var count = searchSection.children.length;

  for (var i = 0; i < count; i++) {
    searchSection.removeChild(searchSection.children[0]);
  }
}

CleanSearchResults();

document.getElementById('tabs-tab').addEventListener('click', function(event){
  if (event.target.href) {
    CleanSearchResults();
  }
})
