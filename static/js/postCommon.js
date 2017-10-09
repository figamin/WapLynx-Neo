var selectedCell = '<div class="removeButton">✖</div>'
    + '<span class="nameLabel"></span><div class="spoilerPanel">'
    + '<input type="checkbox" class="spoilerCheckBox">Spoiler</div>';

var selectedFiles = [];
var selectedDiv;
var selectedDivQr;

if (!DISABLE_JS && typeof (Storage) !== "undefined") {

  var savedPassword = localStorage.deletionPassword;

  if (savedPassword) {

    document.getElementById('fieldPostingPassword').value = savedPassword;

    if (document.getElementById('deletionFieldPassword')) {
      document.getElementById('deletionFieldPassword').value = savedPassword;
    }

  }

  var forcedAnon = !document.getElementById('fieldName');

  if (!forcedAnon) {
    document.getElementById('fieldName').value = localStorage.name || '';
  }

  document.getElementById('alwaysUseBypassDiv').display = 'inline';

  var bypassCheckBox = document.getElementById('alwaysUseBypassCheckBox');

  if (JSON.parse(localStorage.ensureBypass)) {
    bypassCheckBox.checked = true;
  }

  bypassCheckBox.addEventListener('change', function() {
    localStorage.setItem("ensureBypass", bypassCheckBox.checked);
  });

}

function addDndCell(cell, removeButton) {

  if (selectedDivQr) {
    var clonedCell = cell.cloneNode(true);
    clonedCell.getElementsByClassName('removeButton')[0].onclick = removeButton.onclick;
    selectedDivQr.appendChild(clonedCell);
  }

  selectedDiv.appendChild(cell);

}

function addSelectedFile(file) {

  var cell = document.createElement('div');
  cell.setAttribute('class', 'selectedCell');

  cell.innerHTML = selectedCell;

  var nameLabel = cell.getElementsByClassName('nameLabel')[0];
  nameLabel.innerHTML = file.name;

  var removeButton = cell.getElementsByClassName('removeButton')[0];

  removeButton.onclick = function() {
    var index = selectedFiles.indexOf(file);

    if (selectedDivQr) {

      for (var i = 0; i < selectedDiv.childNodes.length; i++) {
        if (selectedDiv.childNodes[i] === cell) {
          selectedDivQr.removeChild(selectedDivQr.childNodes[i]);
        }
      }

    }

    selectedDiv.removeChild(cell);

    selectedFiles.splice(selectedFiles.indexOf(file), 1);
  };

  selectedFiles.push(file);

  if (!file.type.indexOf('image/')) {

    var fileReader = new FileReader();

    fileReader.onloadend = function() {

      var dndThumb = document.createElement('img');
      dndThumb.src = fileReader.result;
      dndThumb.setAttribute('class', 'dragAndDropThumb');
      cell.appendChild(dndThumb);

      addDndCell(cell, removeButton);

    };

    fileReader.readAsDataURL(file);

  } else {
    addDndCell(cell, removeButton);
  }

}

function clearSelectedFiles() {

  if (!document.getElementById('divUpload')) {
    return;
  }

  selectedFiles = [];

  while (selectedDiv.firstChild) {
    selectedDiv.removeChild(selectedDiv.firstChild);
  }

  if (selectedDivQr) {
    while (selectedDivQr.firstChild) {
      selectedDivQr.removeChild(selectedDivQr.firstChild);
    }
  }
}

function setDragAndDrop(qr) {

  var fileInput = document.getElementById('files')

  if (!qr) {
    fileInput.style.display = 'none';
    document.getElementById('dragAndDropDiv').style.display = 'block';

    fileInput.onchange = function() {

      for (var i = 0; i < fileInput.files.length; i++) {
        addSelectedFile(fileInput.files[i]);
      }

      fileInput.type = "text";
      fileInput.type = "file";
    };
  }

  var drop = document.getElementById(qr ? 'dropzoneQr' : 'dropzone');
  drop.onclick = function() {
    fileInput.click();
  };

  if (!qr) {
    selectedDiv = document.getElementById('selectedDiv');
  } else {
    selectedDivQr = document.getElementById('selectedDivQr');
  }

  drop.addEventListener('dragover', function handleDragOver(event) {

    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

  }, false);

  drop.addEventListener('drop', function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    for (var i = 0; i < evt.dataTransfer.files.length; i++) {
      addSelectedFile(evt.dataTransfer.files[i])
    }

  }, false);

}

function checkExistance(file, callback) {

  var reader = new FileReader();

  reader.onloadend = function() {

    var mime = file.type;
    var md5 = SparkMD5.ArrayBuffer.hash(reader.result);

    var identifier = md5 + '-' + mime.replace('/', '');

    localRequest('/checkFileIdentifier.js?identifier=' + identifier,
        function requested(error, response) {

          if (error) {
            console.log(error);
            callback();
          } else {

            var exists = JSON.parse(response);

            if (exists) {
              callback(md5, mime);
            } else {
              callback();
            }

          }

        });

  };

  reader.readAsArrayBuffer(file);

}

function getFilestToUpload(callback, currentIndex, files) {

  currentIndex = currentIndex || 0;
  files = files || [];

  if (!document.getElementById('divUpload')) {
    callback(files);
    return;
  }

  if (currentIndex < selectedFiles.length) {

    var spoiled = selectedDiv.getElementsByClassName('spoilerCheckBox')[currentIndex].checked;

    var file = selectedFiles[currentIndex];

    checkExistance(file, function checked(md5, mime) {

      if (md5) {

        files.push({
          name : selectedFiles[currentIndex].name,
          spoiler : spoiled,
          md5 : md5,
          mime : mime
        });

        getFilestToUpload(callback, ++currentIndex, files)

      } else {

        var reader = new FileReader();

        reader.onloadend = function() {

          files.push({
            name : selectedFiles[currentIndex].name,
            content : reader.result,
            spoiler : spoiled
          });

          getFilestToUpload(callback, ++currentIndex, files)

        };

        reader.readAsDataURL(selectedFiles[currentIndex]);

      }

    });

  } else {
    callback(files);
  }

}
