var boardModeration = {};

boardModeration.init = function() {

  api.convertButton('saveSpecialFormButton',
      boardModeration.saveSpecialSettings, 'specialSettingsField');

  api.convertButton('deleteFormButton', boardModeration.deleteBoard,
      'deleteBoardField');

  api.convertButton('transferFormButton', boardModeration.transferBoard,
      'transferField');

  api.boardUri = document.getElementById('boardTransferIdentifier').value;

};

boardModeration.transferBoard = function() {

  api.formApiRequest('transferBoardOwnership', {
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

  if (!document.getElementById('confirmDelCheckbox').checked) {
    alert('You must confirm that you wish to delete this board.')
    return;
  }

  api.formApiRequest('deleteBoard', {
    boardUri : api.boardUri,
    confirmDeletion : true
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

  api.formApiRequest('setSpecialBoardSettings', {
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