var boardModeration = {};

boardModeration.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  document.getElementById('transferJsButton').style.display = 'inline';
  document.getElementById('deleteJsButton').style.display = 'inline';
  document.getElementById('saveSpecialJsButton').style.display = 'inline';

  document.getElementById('saveSpecialFormButton').style.display = 'none';
  document.getElementById('deleteFormButton').style.display = 'none';
  document.getElementById('transferFormButton').style.display = 'none';

  api.boardUri = document.getElementById('boardTransferIdentifier').value;

};

boardModeration.transferBoard = function() {

  api.apiRequest('transferBoardOwnership', {
    login : document.getElementById('fieldTransferLogin').value.trim(),
    boardUri : api.boardUri
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      window.location.pathname = '/' + api.boardUri + '/';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

boardModeration.deleteBoard = function() {
  api.apiRequest('deleteBoard', {
    boardUri : api.boardUri,
    confirmDeletion : document.getElementById('confirmDelCheckbox').checked
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      window.location.pathname = '/';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

boardModeration.saveSpecialSettings = function() {

  var specialSettings = [];

  if (document.getElementById('checkboxSfw').checked) {
    specialSettings.push('sfw');
  }

  if (document.getElementById('checkboxLocked').checked) {
    specialSettings.push('locked');
  }

  api.apiRequest('setSpecialBoardSettings', {
    boardUri : api.boardUri,
    specialSettings : specialSettings
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      alert('Special settings saved');
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

boardModeration.init();