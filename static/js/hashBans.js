var boardUri;

if (!DISABLE_JS) {

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    boardUri = boardIdentifier.value;
  }

  document.getElementById('createFormButton').style.display = 'none';
  document.getElementById('createJsButton').style.display = 'inline';

  var hashBansDiv = document.getElementById('hashBansDiv');

  for (var j = 0; j < hashBansDiv.childNodes.length; j++) {
    processHashBanCell(hashBansDiv.childNodes[j]);
  }
}

function processHashBanCell(cell) {

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    liftHashBan(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

}

function liftHashBan(hashBan) {
  apiRequest('liftHashBan', {
    hashBanId : hashBan
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function placeHashBan() {

  var typedHash = document.getElementById('hashField').value.trim();

  var parameters = {
    hash : typedHash
  };

  if (boardUri) {
    parameters.boardUri = boardUri;
  }

  apiRequest('placeHashBan', parameters,
      function requestComplete(status, data) {

        if (status === 'ok') {

          location.reload(true);

        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

}