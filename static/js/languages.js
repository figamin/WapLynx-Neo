var languages = {};

languages.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  document.getElementById('addJsButton').style.display = 'inline';

  document.getElementById('addFormButton').style.display = 'none';

  var cells = document.getElementsByClassName('languageCell');

  for (var i = 0; i < cells.length; i++) {
    languages.setLanguageCell(cells[i]);
  }

};

languages.setLanguageCell = function(cell) {

  var jsButton = cell.getElementsByClassName('deleteJsButton')[0];
  jsButton.style.display = 'inline';
  cell.getElementsByClassName('deleteFormButton')[0].style.display = 'none';

  jsButton.onclick = function() {

    api.apiRequest('deleteLanguage', {
      languageId : cell.getElementsByClassName('languageIdentifier')[0].value
    }, function requestComplete(status, data) {

      if (status === 'ok') {

        location.reload(true);

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  };

};

languages.addLanguage = function() {

  var typedHeaderValues = document.getElementById('fieldHeaderValues').value
      .trim();

  var parsedHeaderValues = typedHeaderValues.split(',').map(function(value) {
    return value.trim()
  });

  var typedFrontEnd = document.getElementById('fieldFrontEnd').value.trim();

  var typedLanguagePack = document.getElementById('fieldLanguagePack').value
      .trim();

  var payload = {
    frontEnd : typedFrontEnd,
    languagePack : typedLanguagePack,
    headerValues : parsedHeaderValues
  };

  api.apiRequest('addLanguage', {
    frontEnd : typedFrontEnd,
    languagePack : typedLanguagePack,
    headerValues : parsedHeaderValues
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

languages.init();