const animeReturnCount = 5;


var searchResults = document.querySelector("#search-results");
var randomButton = document.querySelector("#randomize-button");

randomButton.addEventListener("click", function (event) {
  event.target.blur();

  GetRandomAnime(5)
    .then(function (data) {
      CleanSearchResults();
      return data;
    })
    .then((data) => {
      DisplayResults(data);
    });
});



function StoreSearchData(data) {

  var searchResults = [];

  for (var i = 0; i < animeReturnCount; i++) {
    var anime = {
      title: data[i].title_english ? data[i].title_english : data[i].title,
      image: data[i].images.jpg.image_url,
      synopsis: data[i].synopsis,
      animeId: data[i].mal_id
    };
    searchResults.push(anime);
  }
  return searchResults;
}


var ranAnimeLink = "https://api.jikan.moe/v4/random/anime?sfw";

async function GetRandomAnime(count = 1) {
  var searchResults = [];

  for (var i = 0; i < count; i++) {
    const resp = await fetch(ranAnimeLink)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var anime = {
          title: data.data.title_english
            ? data.data.title_english
            : data.data.title,
          image: data.data.images.jpg.image_url,
          synopsis: data.data.synopsis,
          animeId: data.data.mal_id
        };
        return anime;
      });
    searchResults.push(resp);
  }

  return Promise.resolve(searchResults);
}

