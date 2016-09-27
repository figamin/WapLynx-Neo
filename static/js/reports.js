function setupReportButtons() {

  var reports = document.getElementsByClassName('reportCell');

  for (var j = 0; j < reports.length; j++) {
    processReportCell(reports[j]);
  }
}

function processReportCell(cell) {

  var button = cell.getElementsByClassName('closeJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    closeReport(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('closeFormButton')[0].style.display = 'none';

}

function closeReport(report) {
  apiRequest('closeReport', {
    reportId : report
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}