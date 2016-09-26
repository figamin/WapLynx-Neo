if (!DISABLE_JS) {

  document.getElementById('boardJsButton').style.display = 'inline';
  document.getElementById('threadJsButton').style.display = 'inline';
  document.getElementById('fileJsButton').style.display = 'inline';

  document.getElementById('boardFormButton').style.display = 'none';
  document.getElementById('threadFormButton').style.display = 'none';
  document.getElementById('fileFormButton').style.display = 'none';

}

function deleteBoard() {

  var typedBoard = document.getElementById('boardBoardField').value.trim();

  apiRequest('deleteArchivedBoard', {
    boardUri : typedBoard
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      document.getElementById('boardBoardField').value = '';
      alert('Archived board deleted');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function deleteThread() {

  var typedBoard = document.getElementById('threadboardField').value.trim();
  var typedThread = document.getElementById('threadThreadField').value.trim();

  apiRequest('deleteArchivedThread', {
    boardUri : typedBoard,
    threadId : typedThread
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      document.getElementById('threadboardField').value = '';
      document.getElementById('threadThreadField').value = '';
      alert('Archived thread deleted');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function deleteFile() {

  var typedBoard = document.getElementById('fileBoardField').value.trim();
  var typedFiles = document.getElementById('fileFileField').value.trim();

  apiRequest('deleteArchivedUpload', {
    boardUri : typedBoard,
    filename : typedFiles
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      document.getElementById('fileBoardField').value = '';
      document.getElementById('fileFileField').value = '';
      alert('Archived file deleted');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}