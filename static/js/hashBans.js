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

  api.formApiRequest('liftHashBan', {
    hashBanId : cell.getElementsByClassName('idIdentifier')[0].value
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      cell.remove();
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

hashBans.showNewHashBan = function(typedHash, id) {

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
  identifier.value = id;
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

};

hashBans.placeHashBan = function() {

  var typedHash = document.getElementById('hashField').value.trim();

  api.formApiRequest('placeHashBan', {
    hash : typedHash,
    boardUri : api.boardUri
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      document.getElementById('hashField').value = '';
      hashBans.showNewHashBan(typedHash, data);
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

hashBans.init();