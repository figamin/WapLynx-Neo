var hashBans = {};

hashBans.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    api.boardUri = boardIdentifier.value;
  }

  api.convertButton('createFormButton', hashBans.placeHashBan,
      'addHashBanField');

  var hashBansDiv = document.getElementById('hashBansDiv');

  for (var j = 0; j < hashBansDiv.childNodes.length; j++) {
    hashBans.processHashBanCell(hashBansDiv.childNodes[j]);
  }

};

hashBans.processHashBanCell = function(cell) {

  var button = cell.getElementsByClassName('liftFormButton')[0];

  api.convertButton(button, function() {
    hashBans.liftHashBan(cell.getElementsByClassName('idIdentifier')[0].value);
  });

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