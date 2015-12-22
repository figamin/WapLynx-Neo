var boardIdentifier = document.getElementById('boardIdentifier').value;

if (!DISABLE_JS) {

  document.getElementById('addJsButton').style.display = 'inline';

  document.getElementById('addFormButton').style.display = 'none';

  var filtersDiv = document.getElementById('divFilters');

  for (var j = 0; j < filtersDiv.childNodes.length; j++) {
    processFilterCell(filtersDiv.childNodes[j]);
  }

}

function processFilterCell(cell) {

  var button = cell.getElementsByClassName('deleteJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    removeFilter(cell.getElementsByClassName('filterIdentifier')[0].value);
  };

  cell.getElementsByClassName('deleteFormButton')[0].style.display = 'none';
}

function removeFilter(filter) {

  apiRequest('deleteFilter', {
    boardUri : boardIdentifier,
    filterIdentifier : filter
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function addFilter() {
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

  apiRequest('createFilter', {
    boardUri : boardIdentifier,
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