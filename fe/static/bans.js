if (!DISABLE_JS) {

  var bansDiv = document.getElementById('bansDiv')
      || document.getElementById('appealedBansPanel');

  if (bansDiv) {

    for (var j = 0; j < bansDiv.childNodes.length; j++) {
      processBanCell(bansDiv.childNodes[j]);
    }
  }
}

function processBanCell(cell) {

  if (cell.className !== 'banCell') {
    return;
  }

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    liftBan(cell.getElementsByClassName('liftIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

  if (cell.getElementsByClassName('denyForm')[0]) {

    var denyButton = cell.getElementsByClassName('denyJsButton')[0];
    denyButton.style.display = 'inline'

    denyButton.onclick = function() {
      denyAppeal(cell.getElementsByClassName('denyIdentifier')[0].value);
    };

    cell.getElementsByClassName('denyFormButton')[0].style.display = 'none';

  }

}

function denyAppeal(ban) {
  apiRequest('denyAppeal', {
    banId : ban
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
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