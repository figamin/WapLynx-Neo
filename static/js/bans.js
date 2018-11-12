var bans = {};

bans.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  var banCells = document.getElementsByClassName('banCell');

  for (var j = 0; j < banCells.length; j++) {
    bans.processBanCell(banCells[j]);
  }

};

bans.processBanCell = function(cell) {

  var liftButton = cell.getElementsByClassName('liftFormButton')[0];

  api.convertButton(liftButton, function() {
    bans.liftBan(cell.getElementsByClassName('liftIdentifier')[0].value);
  });

  if (cell.getElementsByClassName('denyForm')[0]) {

    var denyButton = cell.getElementsByClassName('denyFormButton')[0];

    api.convertButton(denyButton, function() {
      bans.denyAppeal(cell.getElementsByClassName('denyIdentifier')[0].value);
    });

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