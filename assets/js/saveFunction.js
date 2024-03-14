
const favAnime = "favoritedAnime"

var favArray = [];

function SaveAnime(animeObj) {
  favArray.push(animeObj);
  SavingArray();
} 

function SavingArray() {
  localStorage.setItem(favAnime, JSON.stringify(favArray));
}

function InitArray(){
  favArray = JSON.parse(localStorage.getItem(favAnime)) || [];
}

function RemoveAnime(anime){
  for (var i = 0; i < favArray.length; i++){
    if (anime.animeId == favArray[i].animeId)
    {
      favArray.splice(i,1);
      SavingArray();
      return;
    }
  }
}
function removeFromFavoritesArray(targetId) {
  let findAnime = favArray.find(anime => anime.animeId === targetId) 
    
  var removeIndex = favArray.indexOf(findAnime)
  favArray.splice(removeIndex, 1)

  SavingArray();
}


InitArray();