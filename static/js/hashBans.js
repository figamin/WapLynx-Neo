var hashBans = {};

hashBans.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    api.boardUri = boardIdentifier.value;
  }

  document.getElementById('createFormButton').style.display = 'none';
  document.getElementById('createJsButton').style.display = 'inline';

  var hashBansDiv = document.getElementById('hashBansDiv');

  for (var j = 0; j < hashBansDiv.childNodes.length; j++) {
    hashBans.processHashBanCell(hashBansDiv.childNodes[j]);
  }

};

hashBans.processHashBanCell = function(cell) {

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    hashBans.liftHashBan(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

};

hashBans.liftHashBan = function(hashBan) {

  api.apiRequest('liftHashBan', {
    hashBanId : hashBan
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

hashBans.placeHashBan = function() {

  var typedHash = document.getElementById('hashField').value.trim();

  api.apiRequest('placeHashBan', {
    hash : typedHash,
    boardUri : api.boardUri
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

hashBans.init();