var mediaManagement = {};

mediaManagement.init = function() {

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

      for (var i = checkBoxes.length - 1; i > -1; i--) {
        if (checkBoxes[i].checked) {
          checkBoxes[i].parentNode.parentNode.remove();
        }
      }

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

mediaManagement.init();