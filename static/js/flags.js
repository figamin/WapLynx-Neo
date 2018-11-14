var flags = {};

flags.init = function() {

  flags.maxLength = +document.getElementById('maxNameLengthLabel').innerHTML;
  flags.selectedFiles = [];

  api.boardUri = document.getElementById('boardIdentifier').value;

  api.convertButton('addFormButton', flags.uploadFlags);

  flags.flagsDiv = document.getElementById('flagsDiv');

  var flagCells = document.getElementsByClassName('flagCell');

  for (var i = 0; i < flagCells.length; i++) {
    flags.processFlagCell(flagCells[i]);
  }

  var dragAndDrop = document.getElementById('dragAndDropDiv');
  dragAndDrop.className = '';

  var dropZone = document.getElementById('dropzone');

  var defaultFileChooser = document.getElementById('files');

  defaultFileChooser.setAttribute('multiple', true);
  defaultFileChooser.style.display = 'none';

  defaultFileChooser.onchange = function() {

    for (var i = 0; i < defaultFileChooser.files.length; i++) {
      flags.addSelectedFlag(defaultFileChooser.files[i]);
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
      flags.addSelectedFlag(evt.dataTransfer.files[i])
    }

  }, false);

  document.getElementById('nameLabel').style.display = 'none';

};

flags.addSelectedFlag = function(file) {

  if (file.type.indexOf('image/')) {
    alert('You can only upload images for flags');
    return;
  }

  var selectedDiv = document.getElementById('selectedDiv');

  var cell = document.createElement('div');
  cell.className = 'selectedCell';

  var removeButton = document.createElement('div');
  removeButton.className = 'removeButton';
  removeButton.innerHTML = '✖';
  cell.appendChild(removeButton);

  var nameField = document.createElement('input');
  nameField.className = 'nameField';
  nameField.type = 'text';
  nameField.addEventListener('keydown', function(event) {

    if (event.key === 'Enter') {
      flags.uploadFlags();
    }

  });
  nameField.value = file.name.substring(0, file.name.lastIndexOf('.'));
  cell.appendChild(nameField);

  cell.appendChild(document.createElement('br'));

  var dndThumb = document.createElement('img');
  dndThumb.className = 'dragAndDropThumb';
  cell.appendChild(dndThumb);

  removeButton.onclick = function() {
    var index = flags.selectedFiles.indexOf(file);

    selectedDiv.removeChild(cell);

    flags.selectedFiles.splice(flags.selectedFiles.indexOf(file), 1);
  };

  flags.selectedFiles.push(file);

  var fileReader = new FileReader();

  fileReader.onloadend = function() {

    dndThumb.src = fileReader.result;

    selectedDiv.appendChild(cell);

  };

  fileReader.readAsDataURL(file);

};

flags.processFlagCell = function(cell) {

  var button = cell.getElementsByClassName('deleteFormButton')[0];

  api.convertButton(button, function() {
    flags.removeFlag(cell);
  });

};

flags.removeFlag = function(cell) {

  api.apiRequest('deleteFlag', {
    flagId : cell.getElementsByClassName('idIdentifier')[0].value,
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      cell.remove();
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

flags.showNewFlag = function(typedName) {

  typedName = typedName.replace(/[<>]/g, function(match) {
    return api.htmlReplaceTable[match];
  });

  api.localRequest('/flags.js?json=1&boardUri=' + api.boardUri,
      function gotData(error, data) {

        if (error) {
          alert(error);
          return;
        }

        data = JSON.parse(data);

        for (var i = 0; i < data.length; i++) {

          var flag = data[i];

          if (flag.name === typedName) {
            data = flag;
            break;
          }

        }

        var form = document.createElement('form');
        form.method = 'post';
        form.enctype = 'multipart/form-data';
        form.action = '/deleteFlag.js';
        form.className = 'flagCell';

        var flagName = document.createElement('div');
        flagName.innerHTML = data.name;
        flagName.className = 'nameLabel';
        form.appendChild(flagName);

        var flagImage = document.createElement('img');
        flagImage.className = 'flagImg';
        flagImage.src = '/' + api.boardUri + '/flags/' + data._id;
        form.appendChild(flagImage);

        form.appendChild(document.createElement('br'));

        var flagIdentifier = document.createElement('input');
        flagIdentifier.className = 'idIdentifier';
        flagIdentifier.value = data._id;
        flagIdentifier.type = 'hidden';
        form.appendChild(flagIdentifier);

        var deleteButton = document.createElement('button');
        deleteButton.type = 'submit';
        deleteButton.className = 'deleteFormButton';
        deleteButton.innerHTML = 'Delete';
        form.appendChild(deleteButton);

        form.appendChild(document.createElement('hr'));

        flags.flagsDiv.appendChild(form);

        flags.processFlagCell(form);

      });

};

flags.uploadFlags = function() {

  if (!flags.selectedFiles.length) {
    return;
  }

  var typedName = document.getElementsByClassName('nameField')[0].value.trim();

  if (typedName.length > flags.maxLength) {
    alert('Flag name too long, keep it under ' + flags.maxLength
        + ' characters.');
    return;
  } else if (!typedName.length) {
    alert('A name is mandatory for the flag.');
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function() {

    var files = [ {
      name : flags.selectedFiles[0].name,
      content : reader.result
    } ];

    // style exception, too simple
    api.apiRequest('createFlag', {
      files : files,
      flagName : typedName,
      boardUri : api.boardUri,
    }, function requestComplete(status, data) {

      if (status === 'ok') {

        document.getElementsByClassName('removeButton')[0].onclick();

        flags.showNewFlag(typedName);
        // TODO refactor on 2.2 when this data is returned

        flags.uploadFlags();

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });
    // style exception, too simple

  };

  reader.readAsDataURL(flags.selectedFiles[0]);

};

flags.init();