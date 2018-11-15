var rangeBans = {};

rangeBans.init = function() {

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    api.boardUri = boardIdentifier.value;
  }

  api.convertButton('createFormButton', rangeBans.placeRangeBan,
      'rangeBanField');

  var rangeBanCells = document.getElementsByClassName('rangeBanCell');

  for (var j = 0; j < rangeBanCells.length; j++) {
    rangeBans.processRangeBanCell(rangeBanCells[j]);
  }

  rangeBans.bansDiv = document.getElementById('rangeBansDiv');

};

rangeBans.processRangeBanCell = function(cell) {

  var button = cell.getElementsByClassName('liftFormButton')[0];

  api.convertButton(button, function() {
    rangeBans.liftBan(cell);
  });

};

rangeBans.liftBan = function(cell) {

  api.apiRequest('liftBan', {
    banId : cell.getElementsByClassName('idIdentifier')[0].value
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      cell.remove();
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

rangeBans.showNewRangeBan = function(typedRange) {

  var shownBans = document.getElementsByClassName('idIdentifier');

  var knownIds = [];

  for (var i = 0; i < shownBans.length; i++) {
    knownIds.push(shownBans[i].value);
  }

  var form = document.createElement('form');
  form.className = 'rangeBanCell';
  form.action = '/liftBan.js';
  form.method = 'post';
  form.enctype = 'multipart/form-data';

  form.appendChild(document.createElement('hr'));

  var rangePara = document.createElement('p');
  rangePara.innerHTML = 'Range: ';
  form.appendChild(rangePara);

  var rangeLabel = document.createElement('span');
  rangeLabel.innerHTML = typedRange;
  rangeLabel.className = 'rangeLabel';
  rangePara.appendChild(rangeLabel);

  var idIdentifier = document.createElement('input');
  idIdentifier.className = 'idIdentifier';
  idIdentifier.type = 'hidden';
  form.appendChild(idIdentifier);

  var liftButton = document.createElement('button');
  liftButton.type = 'submit';
  liftButton.innerHTML = 'Lift ban';
  liftButton.className = 'liftFormButton';
  form.appendChild(liftButton);

  var url = '/rangeBans.js?json=1';

  if (api.boardUri) {
    url += '&boardUri=' + api.boardUri;
  }

  api.localRequest(url, function(error, data) {

    if (error) {
      return;
    }

    data = JSON.parse(data);

    for (i = 0; i < data.length; i++) {
      if (knownIds.indexOf(data[i]._id) < 0) {
        data = data[i];
        break;
      }
    }

    idIdentifier.value = data._id;

    rangeBans.bansDiv.appendChild(form);

    rangeBans.processRangeBanCell(form);

  });

};

rangeBans.placeRangeBan = function() {

  var typedRange = document.getElementById('rangeField').value.trim();

  var parameters = {
    range : typedRange,
    boardUri : api.boardUri
  };

  api.apiRequest('placeRangeBan', parameters, function requestComplete(status,
      data) {

    if (status === 'ok') {

      document.getElementById('rangeField').value = '';
      // TODO refactor after adding info on back-end
      rangeBans.showNewRangeBan(typedRange);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

rangeBans.init();