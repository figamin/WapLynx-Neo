if (!DISABLE_JS) {

  if (document.getElementById('addStaffForm')) {
    document.getElementById('addJsButton').style.display = 'inline';

    document.getElementById('addFormButton').style.display = 'none';

  }

  setupReportButtons();

  var staffDiv = document.getElementById('divStaff');

  if (staffDiv) {

    for (var i = 0; i < staffDiv.childNodes.length; i++) {
      var cell = staffDiv.childNodes[i];

      if (cell.className === 'staffCell') {

        processCell(cell);
      } else {
        console.log(cell.className);
      }

    }

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
