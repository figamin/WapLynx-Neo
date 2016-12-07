function closeReports() {

  var reports = document.getElementById('reportDiv').childNodes;

  var ids = [];

  for (var i = 0; i < reports.length; i++) {

    var checkbox = reports[i].getElementsByClassName('closureCheckbox')[0];

    if (checkbox.checked) {
      ids.push(checkbox.name.substring(7));
    }

  }

  if (!ids.length) {
    return;
  }

  apiRequest('closeReports', {
    reports : ids,
    deleteContent : document.getElementById('deleteContentCheckbox').checked
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      location.reload(true);
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}