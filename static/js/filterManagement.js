var filterManagement = {};

filterManagement.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  api.boardUri = document.getElementById('boardIdentifier').value;

  api.convertButton('addFormButton', filterManagement.addFilter,
      'addFilterField');

  var filtersDiv = document.getElementById('divFilters');

  for (var j = 0; j < filtersDiv.childNodes.length; j++) {
    filterManagement.processFilterCell(filtersDiv.childNodes[j]);
  }

};

filterManagement.processFilterCell = function(cell) {

  var button = cell.getElementsByClassName('deleteFormButton')[0];

  api.convertButton(button, function() {
    filterManagement.removeFilter(cell
        .getElementsByClassName('filterIdentifier')[0].value);
  });

};

filterManagement.removeFilter = function(filter) {

  api.apiRequest('deleteFilter', {
    boardUri : api.boardUri,
    filterIdentifier : filter
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

filterManagement.addFilter = function() {

  var typedOriginal = document.getElementById('fieldOriginalTerm').value.trim();
  var typedReplacement = document.getElementById('fieldReplacementTerm').value
      .trim();
  var caseInsensitive = document.getElementById('checkboxCaseInsensitive').checked;

  if (!typedOriginal.length || !typedReplacement.length) {
    alert('Both fields are mandatory.');
    return;
  } else if (typedOriginal.length > 32 || typedReplacement.length > 32) {
    alert('Both fields cannot exceed 32 characters.');
    return;
  }

  api.apiRequest('createFilter', {
    boardUri : api.boardUri,
    originalTerm : typedOriginal,
    caseInsensitive : caseInsensitive,
    replacementTerm : typedReplacement
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

filterManagement.init();