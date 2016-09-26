function setupReportButtons() {

  var reportDiv = document.getElementById('reportDiv');

  for (var j = 0; j < reportDiv.childNodes.length; j++) {
    processReportCell(reportDiv.childNodes[j]);
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