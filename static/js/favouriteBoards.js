function setFavouriteBoards() {

  var favouriteBoards = JSON.parse(localStorage.favouriteBoards || '[]');

  var boardsSpan = document.getElementById('navBoardsSpan');

  while (boardsSpan.hasChildNodes()) {
    boardsSpan.removeChild(boardsSpan.lastChild);
  }

  if (favouriteBoards.length) {

    var firstBracket = document.createElement('span');
    firstBracket.innerHTML = '[';
    boardsSpan.appendChild(firstBracket);

    boardsSpan.appendChild(document.createTextNode(' '));

    for (var i = 0; i < favouriteBoards.length; i++) {

      var link = document.createElement('a');
      link.href = '/' + favouriteBoards[i];
      link.innerHTML = favouriteBoards[i];
      boardsSpan.appendChild(link);

      boardsSpan.appendChild(document.createTextNode(' '));

      if (i < favouriteBoards.length - 1) {

        var divider = document.createElement('span');
        divider.innerHTML = '/';
        boardsSpan.appendChild(divider);

        boardsSpan.appendChild(document.createTextNode(' '));
      }

    }

    var seconrdBracket = document.createElement('span');
    seconrdBracket.innerHTML = ']';
    boardsSpan.appendChild(seconrdBracket);
  }

}

if (!DISABLE_JS) {

  setFavouriteBoards();

  var boardLabel = document.getElementById('labelName')
      || document.getElementById('labelBoard');

  if (boardLabel) {

    var favouriteBoards = JSON.parse(localStorage.favouriteBoards || '[]');

    var favouriteButton = document.createElement('span');
    favouriteButton.id = 'favouriteButton';
    boardLabel.parentNode.appendChild(favouriteButton);

    if (favouriteBoards.indexOf(boardUri) > -1) {
      favouriteButton.setAttribute('class', 'checkedFavouriteButton');
    }

    favouriteButton.onclick = function() {
      favouriteBoards = JSON.parse(localStorage.favouriteBoards || '[]');

      var index = favouriteBoards.indexOf(boardUri);

      if (index > -1) {
        favouriteBoards.splice(index, 1);
        favouriteButton.removeAttribute('class');
      } else {
        favouriteBoards.push(boardUri);
        favouriteBoards.sort();
        favouriteButton.setAttribute('class', 'checkedFavouriteButton');
      }

      localStorage.setItem('favouriteBoards', JSON.stringify(favouriteBoards));

      setFavouriteBoards();

    };

  }

}
