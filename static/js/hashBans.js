var hashBans = {};

hashBans.init = function() {

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

  hashBans.div = hashBansDiv;

};

hashBans.processHashBanCell = function(cell) {

  var button = cell.getElementsByClassName('liftFormButton')[0];

  api.convertButton(button, function() {
    hashBans.liftHashBan(cell);
  });

};

hashBans.liftHashBan = function(cell) {

  api.apiRequest('liftHashBan', {
    hashBanId : cell.getElementsByClassName('idIdentifier')[0].value
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      cell.remove();
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

hashBans.showNewHashBan = function(typedHash) {

  var url = '/hashBans.js?json=1'

  if (api.boardUri) {
    url += '&boardUri=' + api.boardUri;
  }

  // TODO once 2.2 returns the data of the new hash ban
  api.localRequest(url, function(error, data) {

    if (error) {
      return;
    }

    data = JSON.parse(data);

    for (var i = 0; i < data.length; i++) {
      var hashBan = data[i];

      if (hashBan.md5 === typedHash) {
        data = hashBan;
        break;
      }

    }

    var form = document.createElement('form');
    form.method = 'post';
    form.enctype = 'multipart/form-data';
    form.action = '/liftHashBan.js';
    form.className = 'hashBanCell';

    form.appendChild(document.createElement('hr'));

    var hashPara = document.createElement('p');
    hashPara.innerHTML = 'MD5: ';
    form.appendChild(hashPara);

    var hashLabel = document.createElement('span');
    hashLabel.className = 'hashLabel';
    hashLabel.innerHTML = typedHash;
    hashPara.appendChild(hashLabel);

    var identifier = document.createElement('input');
    identifier.type = 'hidden';
    identifier.value = hashBan._id;
    identifier.name = 'hashBanId';
    identifier.className = 'idIdentifier';
    form.appendChild(identifier);

    var submit = document.createElement('button');
    submit.type = 'submit';
    submit.innerHTML = 'Lift hash ban';
    submit.className = 'liftFormButton';
    form.appendChild(submit);

    hashBans.div.appendChild(form);

    hashBans.processHashBanCell(form);

  });

};

hashBans.placeHashBan = function() {

  var typedHash = document.getElementById('hashField').value.trim();

  api.apiRequest('placeHashBan', {
    hash : typedHash,
    boardUri : api.boardUri
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      document.getElementById('hashField').value = '';
      hashBans.showNewHashBan(typedHash);
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

hashBans.init();