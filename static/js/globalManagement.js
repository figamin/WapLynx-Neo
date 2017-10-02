if (!DISABLE_JS) {

  if (document.getElementById('addStaffForm')) {
    document.getElementById('addJsButton').style.display = 'inline';
    document.getElementById('massBanJsButton').style.display = 'inline';

    document.getElementById('massBanFormButton').style.display = 'none';
    document.getElementById('addFormButton').style.display = 'none';

  }

  document.getElementById('closeReportsFormButton').style.display = 'none';
  document.getElementById('closeReportsJsButton').style.display = 'inline';

  var staffCells = document.getElementsByClassName('staffCell');

  for (var i = 0; i < staffCells.length; i++) {
    processCell(staffCells[i]);
  }

}

function processCell(cell) {

  var button = cell.getElementsByClassName('saveJsButton')[0];
  button.style.display = 'inline';

  cell.getElementsByClassName('saveFormButton')[0].style.display = 'none';

  var comboBox = cell.getElementsByClassName('roleCombo')[0];
  var user = cell.getElementsByClassName('userIdentifier')[0].value;

  button.onclick = function() {
    saveUser(user, comboBox);
  };
}

function saveUser(user, comboBox) {

  setUser(user, comboBox.options[comboBox.selectedIndex].value);

}

function addUser() {

  var combo = document.getElementById('newStaffCombo');

  setUser(document.getElementById('fieldLogin').value.trim(),
      combo.options[combo.selectedIndex].value);

}

function setUser(login, role) {

  apiRequest('setGlobalRole', {
    login : login,
    role : +role
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function massBan() {

  var ipField = document.getElementById('fieldIps');
  var reasonField = document.getElementById('fieldReason');
  var durationField = document.getElementById('fieldDuration');

  var typedIps = ipField.value.trim();

  var ipArray = typedIps.split(',');

  var finalIpArray = [];

  for (var i = 0; i < ipArray.length; i++) {

    var ip = ipArray[i].trim();

    if (ip.length) {
      finalIpArray.push(ip);
    }

  }

  if (!finalIpArray.length) {
    alert('No ips informed');
    return;
  }

  var typedReason = reasonField.value;
  var typedDuration = durationField.value;

  apiRequest('massBan.js', {
    ips : finalIpArray,
    reason : typedReason,
    duration : typedDuration
  }, function requestCompleted(status, data) {

    if (status === 'ok') {
      ipField.value = '';
      reasonField.value = '';
      durationField.value = '';

      alert('Mass ban applied.');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}