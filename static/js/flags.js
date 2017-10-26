var boardIdentifier = document.getElementById('boardIdentifier').value;

var selectedFiles = [];

var maxLength = +document.getElementById('maxNameLengthLabel').innerHTML;

if (!DISABLE_JS) {

  document.getElementById('addJsButton').style.display = 'inline';

  document.getElementById('addFormButton').style.display = 'none';

  var flagCells = document.getElementsByClassName('flagCell');

  for (var i = 0; i < flagCells.length; i++) {

    processFlagCell(flagCells[i]);

  }

  var dragAndDrop = document.getElementById('dragAndDropDiv');
  dragAndDrop.className = '';

  var dropZone = document.getElementById('dropzone');

  var defaultFileChooser = document.getElementById('files');

  defaultFileChooser.setAttribute('multiple', true);
  defaultFileChooser.style.display = 'none';

  defaultFileChooser.onchange = function() {

    for (var i = 0; i < defaultFileChooser.files.length; i++) {
      addSelectedFlag(defaultFileChooser.files[i]);
    }

    defaultFileChooser.type = "text";
    defaultFileChooser.type = "file";
  };

  dropZone.onclick = function() {
    defaultFileChooser.click();
  };

  dropZone.addEventListener('dragover', function handleDragOver(event) {

    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

  }, false);

  dropZone.addEventListener('drop', function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    for (var i = 0; i < evt.dataTransfer.files.length; i++) {
      addSelectedFlag(evt.dataTransfer.files[i])
    }

  }, false);

  document.getElementById('nameLabel').style.display = 'none';

}

function addSelectedFlag(file) {

  if (file.type.indexOf('image/')) {
    alert('You can only upload images for flags');
    return;
  }

  var selectedDiv = document.getElementById('selectedDiv');

  var cell = document.createElement('div');
  cell.setAttribute('class', 'selectedCell');

  var removeButton = document.createElement('div');
  removeButton.setAttribute('class', 'removeButton');
  removeButton.innerHTML = '✖';
  cell.appendChild(removeButton);

  var nameField = document.createElement('input');
  nameField.setAttribute('class', 'nameField');
  nameField.type = 'text';
  nameField.value = file.name.substring(0, file.name.lastIndexOf('.'));
  cell.appendChild(nameField);

  cell.appendChild(document.createElement('br'));

  var dndThumb = document.createElement('img');
  dndThumb.setAttribute('class', 'dragAndDropThumb');
  cell.appendChild(dndThumb);

  removeButton.onclick = function() {
    var index = selectedFiles.indexOf(file);

    selectedDiv.removeChild(cell);

    selectedFiles.splice(selectedFiles.indexOf(file), 1);
  };

  selectedFiles.push(file);

  var fileReader = new FileReader();

  fileReader.onloadend = function() {

    dndThumb.src = fileReader.result;

    selectedDiv.appendChild(cell);

  };

  fileReader.readAsDataURL(file);

};

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

function uploadFlags() {

  if (!selectedFiles.length) {
    location.reload(true);
    return;
  }

  var typedName = document.getElementsByClassName('nameField')[0].value.trim();

  if (typedName.length > maxLength) {
    alert('Flag name too long, keep it under ' + maxLength + ' characters.');
    return;
  } else if (!typedName.length) {
    alert('A name is mandatory for the flag.');
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function() {

    var files = [ {
      name : selectedFiles[0].name,
      content : reader.result
    } ];

    // style exception, too simple

    apiRequest('createFlag', {
      files : files,
      flagName : typedName,
      boardUri : boardIdentifier,
    }, function requestComplete(status, data) {

      if (status === 'ok') {

        document.getElementsByClassName('removeButton')[0].onclick();

        uploadFlags();

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

    // style exception, too simple

  };

  reader.readAsDataURL(selectedFiles[0]);

}