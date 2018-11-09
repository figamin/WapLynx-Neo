var bans = {};

bans.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  var bansDiv = document.getElementById('bansDiv')
      || document.getElementById('appealedBansPanel');

  if (bansDiv) {

    for (var j = 0; j < bansDiv.childNodes.length; j++) {
      bans.processBanCell(bansDiv.childNodes[j]);
    }
  }

};

bans.processBanCell = function(cell) {

  if (cell.className !== 'banCell') {
    return;
  }

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    bans.liftBan(cell.getElementsByClassName('liftIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

  if (cell.getElementsByClassName('denyForm')[0]) {

    var denyButton = cell.getElementsByClassName('denyJsButton')[0];
    denyButton.style.display = 'inline'

    denyButton.onclick = function() {
      bans.denyAppeal(cell.getElementsByClassName('denyIdentifier')[0].value);
    };

    cell.getElementsByClassName('denyFormButton')[0].style.display = 'none';

  }

};

bans.denyAppeal = function(ban) {

  api.apiRequest('denyAppeal', {
    banId : ban
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

bans.liftBan = function(ban) {

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

bans.init();