var boardIdentifier;
var threadIdentififer;
var postIdentifier;
var messageLimit;

if (!DISABLE_JS) {
  document.getElementById('saveJsButton').style.display = 'inline';
  document.getElementById('saveFormButton').style.display = 'none';

  messageLimit = +document.getElementById('labelMessageLength').innerHTML;
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

  var typedSubject = document.getElementById('fieldSubject').value.trim();

  if (typedSubject.length > 128) {
    alert('Subject too long, keep it under 128 characters.');
  } else if (!typedMessage.length) {
    alert('A message is mandatory.');
  } else if (typedMessage.length > messageLimit) {
    alert('Message too long, keep it under ' + messageLimit + ' characters.');
  } else {

    var parameters = {
      boardUri : boardIdentifier,
      message : typedMessage,
      subject : typedSubject
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