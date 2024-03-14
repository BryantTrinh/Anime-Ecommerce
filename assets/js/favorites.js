var favoriteDisplayEl = document.getElementById('favoriteDisplay');
var favoriteResults = [];

var resultsCopy = [];


function renderFavorites() {
  favoriteResults = JSON.parse(localStorage.getItem(favAnime)) || [];
  resultsCopy = JSON.parse(localStorage.getItem(favAnime)) || []


  let inLocalStorage = true;
  for (let i = 0; i < favoriteResults.length; i++) {
    let columnEl = document.createElement('div');
    let articleEl = document.createElement('article');
    let cardButton = document.createElement('button');
    let animeImage = document.createElement('img');
    let cardHeader = document.createElement('header');
    let cardHeaderText = document.createElement('h2');
    let cardFooter = document.createElement('footer');
    let favoriteBtn = renderFavoriteBtn(inLocalStorage);

    columnEl.setAttribute('class', 'flex my-1 px-1 w-1/2 max-[380px]:w-full max-[380px]:justify-center md:w-1/3 lg:my-4 lg:px-4 lg:w-1/4');
    articleEl.setAttribute('class', 'flex flex-col w-full justify-between overflow-hidden bg-white rounded-lg shadow-lg result-content');
    cardButton.setAttribute('type', 'button');
    cardButton.setAttribute('data-bs-toggle','modal');
    cardButton.setAttribute('data-bs-target', '#animeModal');
    cardButton.setAttribute('onclick','renderModal(this)')
    cardButton.setAttribute('class','w-full')

    cardButton.setAttribute('id', favoriteResults[i].animeId);
    animeImage.setAttribute('alt', favoriteResults[i].title);
    animeImage.setAttribute('class', 'block w-full aspect-[3/4] object-cover anime-img');
    animeImage.setAttribute('src', favoriteResults[i].image);

    cardHeader.setAttribute('class', 'flex items-center justify-between leading-tight p-2 md:p-4');
    cardHeaderText.setAttribute('class', 'text-md md:text-xl m-auto anime-title');
    cardHeaderText.dataset.id = favoriteResults[i].animeId;
    cardFooter.setAttribute('class', 'flex items-center justify-between leading-none p-2 md:p-4');

    cardHeaderText.textContent = favoriteResults[i].title;

    cardHeader.appendChild(cardHeaderText);
    cardFooter.appendChild(favoriteBtn);
    cardButton.append(animeImage,cardHeader);
    articleEl.append(cardButton, cardFooter);
    columnEl.appendChild(articleEl);
    favoriteDisplayEl.appendChild(columnEl);
  }
}



function renderFavoriteBtn(inLocalStorage) {
  let favoriteBtn = document.createElement('button');
  let favoriteIcon = document.createElement('i');
  let unfavoriteIcon = document.createElement('i');
  let favoriteText = document.createElement('p');

  favoriteBtn.setAttribute('id', 'favorite-button');
  favoriteBtn.setAttribute('type', 'button');
  favoriteBtn.setAttribute('class', 'w-full mt-2 py-2 flex justify-center items-end rounded-lg shadow-md');

  if (inLocalStorage) {
    unfavoriteIcon.setAttribute('class', 'fa-regular fa-star p-1 collapse');
    favoriteIcon.setAttribute('class', 'fa-solid fa-star p-1');
    favoriteText.textContent = 'Favorited';
  } else {
    unfavoriteIcon.setAttribute('class', 'fa-regular fa-star p-1');
    favoriteIcon.setAttribute('class', 'fa-solid fa-star p-1 collapse');
    favoriteText.textContent = 'Favorite';
  }
  favoriteBtn.append(favoriteIcon, unfavoriteIcon, favoriteText);
  return favoriteBtn;
}


function renderModal(button) {
  for ( let i = 0; i < favoriteResults.length; i++ ){
    if (button.id === favoriteResults[i].animeId) {
      let productDisplayEl = document.getElementById('related-products');
      let animeTitleEl = document.getElementById('anime-title');
      let animeSynopsisEl = document.getElementById('anime-synopsis');
      let productCards = renderProductCard(favoriteResults[i].products, productDisplayEl);

      animeTitleEl.textContent = favoriteResults[i].title;
      animeSynopsisEl.textContent = favoriteResults[i].synopsis;
    }
  }
}

function renderProductCard(productInfo, parent) {
  parent.innerHTML ='';

  for (let i = 0; i < productInfo.length; i++) {
    let productContainerEl = document.createElement('div');
    let productCardEl = document.createElement('div');
    let productUrlEl = document.createElement('a');
    let productImgEl = document.createElement('img');
    let productNameEl = document.createElement('h4');
    let productPriceEl = document.createElement('p');

    productContainerEl.setAttribute('class', 'product-container rounded-lg shadow-md');
    productCardEl.setAttribute('class', 'product-card');
    productUrlEl.setAttribute('href', productInfo[i].url);
    productImgEl.setAttribute('class', 'aspect-square object-contain');
    productImgEl.setAttribute('src', productInfo[i].image);
    
    productNameEl.textContent = productInfo[i].name;
    productPriceEl.textContent = productInfo[i].price;

    productUrlEl.append(productImgEl, productNameEl, productPriceEl);
    productCardEl.appendChild(productUrlEl);
    productContainerEl.appendChild(productCardEl);
    parent.appendChild(productContainerEl);
    
  }
}

function toggleFavoriteBtn(favoriteBtn) {
  let favoriteIcon = favoriteBtn.querySelector('.fa-solid.fa-star');
  let notFavoriteIcon = favoriteBtn.querySelector('.fa-regular.fa-star');

  var point = favoriteBtn.closest('.result-content');

  if (favoriteIcon.classList.contains('collapse')) {
    favoriteIcon.classList.remove('collapse');
    notFavoriteIcon.classList.add('collapse');
    favoriteBtn.getElementsByTagName('p')[0].innerHTML = 'Favorited';

    SaveAnime(GetAnimeById(point.querySelector('.anime-title').dataset.id));
  } else {

    favoriteIcon.classList.add('collapse');
    notFavoriteIcon.classList.remove('collapse');
    favoriteBtn.getElementsByTagName('p')[0].innerHTML = 'Favorite';

    removeFromFavoritesArray( point.querySelector('.anime-title').dataset.id);
  }
}


function GetAnimeById(id)
{
  for (var i = 0; i < resultsCopy.length; i++){
    if (resultsCopy[i].animeId == id)
      return resultsCopy[i];
  }
}


function checkClicked(event) {
  if (event.target.id === 'favorite-button') {
    toggleFavoriteBtn(event.target)
  } else if (event.target.parentNode.id === 'favorite-button') {
    toggleFavoriteBtn(event.target.parentNode);
  }
}

favoriteDisplayEl.addEventListener('click', checkClicked);
renderFavorites();