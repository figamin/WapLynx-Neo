var selectedCell = '<div class="removeButton">✖</div>'
    + '<span class="nameLabel"></span><div class="spoilerPanel">'
    + '<input type="checkbox" class="spoilerCheckBox">Spoiler</div>';

var selectedFiles = [];
var selectedDiv;

function addSelectedFile(file) {

  var cell = document.createElement('div');
  cell.setAttribute('class', 'selectedCell');

  cell.innerHTML = selectedCell;

  var nameLabel = cell.getElementsByClassName('nameLabel')[0];
  nameLabel.innerHTML = file.name;

  var removeButton = cell.getElementsByClassName('removeButton')[0];
  removeButton.onclick = function() {
    selectedDiv.removeChild(cell);
    selectedFiles.splice(selectedFiles.indexOf(file), 1);
  };

  selectedFiles.push(file);
  selectedDiv.appendChild(cell);

}

function clearSelectedFiles() {
  selectedFiles = [];

  while (selectedDiv.firstChild) {
    selectedDiv.removeChild(selectedDiv.firstChild);
  }
}

function setDragAndDrop() {

  var fileInput = document.getElementById('files')
  fileInput.style.display = 'none';

  document.getElementById('dragAndDropDiv').style.display = 'block';

  var drop = document.getElementById('dropzone');
  drop.onclick = function() {
    fileInput.click();
  };

  fileInput.onchange = function() {

    for (var i = 0; i < fileInput.files.length; i++) {
      addSelectedFile(fileInput.files[i]);
    }

    fileInput.type = "text";
    fileInput.type = "file";
  };

  selectedDiv = document.getElementById('selectedDiv');

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

  reader.onloadend = function(e) {

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

        reader.onloadend = function(e) {

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