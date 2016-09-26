if (!DISABLE_JS) {

  document.getElementById('deleteJsButton').style.display = 'inline';
  document.getElementById('deleteFormButton').style.display = 'none';

}

function deleteMedia() {

  var checkBoxes = document.getElementsByClassName('identifierCheckbox');

  var identifiers = [];

  for (var i = 0; i < checkBoxes.length; i++) {
    if (checkBoxes[i].checked) {
      identifiers.push(checkBoxes[i].name);
    }
  }

  apiRequest('deleteMedia', {
    identifiers : identifiers
  }, function deletedMedia(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

}