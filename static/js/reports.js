var reports = {};

reports.closeReports = function() {

  var reportDiv = document.getElementById('reportDiv');

  var cells = [];

  var params = {
    duration : document.getElementById('fieldBanDuration').value,
    banReporter : document.getElementById('banReporterCheckbox').checked,
    deleteContent : document.getElementById('deleteContentCheckbox').checked
  };

  for (var i = 0; i < reportDiv.childNodes.length; i++) {

    var checkbox = reportDiv.childNodes[i]
        .getElementsByClassName('closureCheckbox')[0];

    if (checkbox.checked) {
      cells.push(reportDiv.childNodes[i]);
      params[checkbox.name] = true;
    }

  }

  api.formApiRequest('closeReports', params, function requestComplete(status,
      data) {

    if (status === 'ok') {

      for (i = 0; i < cells.length; i++) {
        reportDiv.removeChild(cells[i]);
      }

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};