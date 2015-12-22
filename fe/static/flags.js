var boardIdentifier = document.getElementById('boardIdentifier').value;

if (!DISABLE_JS) {

  document.getElementById('addJsButton').style.display = 'inline';

  document.getElementById('addFormButton').style.display = 'none';

  var flagCells = document.getElementsByClassName('flagCell');

  for (var i = 0; i < flagCells.length; i++) {

    processFlagCell(flagCells[i]);

  }

}

function processFlagCell(cell) {

  var button = cell.getElementsByClassName('deleteJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    removeBanner(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('deleteFormButton')[0].style.display = 'none';

}

function removeBanner(flagId) {

  apiRequest('deleteFlag', {
    flagId : flagId,
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function addFlag() {

  var typedName = document.getElementById('fieldFlagName').value.trim();

  if (typedName.length > 16) {
    alert('Flag name too long, keep it under 16 character.');
    return;
  } else if (!typedName.length) {
    alert('A name is mandatory for the flag.');
    return;
  }

  var file = document.getElementById('files').files[0];

  if (!file) {
    alert('You must select a file');
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function(e) {

    var files = [ {
      name : file.name,
      content : reader.result
    } ];

    // style exception, too simple

    apiRequest('createFlag', {
      files : files,
      flagName : typedName,
      boardUri : boardIdentifier,
    }, function requestComplete(status, data) {

      if (status === 'ok') {

        location.reload(true);

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

    // style exception, too simple

  };

  reader.readAsDataURL(file);

}