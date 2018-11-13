var mediaManagement = {};

mediaManagement.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  api.convertButton('deleteFormButton', mediaManagement.deleteMedia);

};

mediaManagement.deleteMedia = function() {

  var checkBoxes = document.getElementsByClassName('identifierCheckbox');

  var identifiers = [];

  for (var i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      identifiers.push(checkBoxes[i].name);
    }
  }

  api.apiRequest('deleteMedia', {
    identifiers : identifiers
  }, function deletedMedia(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

mediaManagement.init();