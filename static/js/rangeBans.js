var rangeBans = {};

rangeBans.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    api.boardUri = boardIdentifier.value;
  }

  document.getElementById('createFormButton').style.display = 'none';
  document.getElementById('createJsButton').style.display = 'inline';

  var rangeBanCells = document.getElementsByClassName('rangeBanCell');

  for (var j = 0; j < rangeBanCells.length; j++) {
    rangeBans.processRangeBanCell(rangeBanCells[j]);
  }

};

rangeBans.processRangeBanCell = function(cell) {

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    rangeBans.liftBan(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

};

rangeBans.liftBan = function(ban) {

  api.apiRequest('liftBan', {
    banId : ban
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

rangeBans.placeRangeBan = function() {

  var typedRange = document.getElementById('rangeField').value.trim();

  var parameters = {
    range : typedRange,
    boardUri : api.boardUri
  };

  api.apiRequest('placeRangeBan', parameters,
      function requestComplete(status, data) {

        if (status === 'ok') {

          location.reload(true);

        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

};

rangeBans.init();