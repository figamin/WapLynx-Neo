var boardUri;

if (!DISABLE_JS) {

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    boardUri = boardIdentifier.value;
  }

  document.getElementById('createFormButton').style.display = 'none';
  document.getElementById('createJsButton').style.display = 'inline';

  var rangeBanCells = document.getElementsByClassName('rangeBanCell');

  for (var j = 0; j < rangeBanCells.length; j++) {
    processRangeBanCell(rangeBanCells[j]);
  }
}

function processRangeBanCell(cell) {

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    liftBan(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

}

function liftBan(ban) {
  apiRequest('liftBan', {
    banId : ban
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function placeRangeBan() {

  var typedRange = document.getElementById('rangeField').value.trim();

  var parameters = {
    range : typedRange
  };

  if (boardUri) {
    parameters.boardUri = boardUri;
  }

  apiRequest('placeRangeBan', parameters,
      function requestComplete(status, data) {

        if (status === 'ok') {

          location.reload(true);

        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

}