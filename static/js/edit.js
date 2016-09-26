var boardIdentifier;
var threadIdentififer;
var postIdentifier;

if (!DISABLE_JS) {
  document.getElementById('saveJsButton').style.display = 'inline';

  document.getElementById('saveFormButton').style.display = 'none';

  boardIdentifier = document.getElementById('boardIdentifier').value;

  var threadElement = document.getElementById('threadIdentifier');

  if (threadElement) {
    threadIdentififer = threadElement.value;
  } else {
    postIdentifier = document.getElementById('postIdentifier').value;
  }
}

function save() {

  var typedMessage = document.getElementById('fieldMessage').value.trim();

  if (!typedMessage.length) {
    alert('A message is mandatory.');
  } else if (typedMessage.length > 4096) {
    alert('Message too long, keep it under 4096 characters.');
  } else {

    var parameters = {
      boardUri : boardIdentifier,
      message : typedMessage
    };

    if (postIdentifier) {
      parameters.postId = postIdentifier;
    } else {
      parameters.threadId = threadIdentififer;
    }

    apiRequest('saveEdit', parameters, function requestComplete(status, data) {

      if (status === 'ok') {
        alert('Posting edited.');
      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

}