var boardIdentifier;

if (!DISABLE_JS) {

  if (document.getElementById('boardIdentifier')) {
    boardIdentifier = document.getElementById('boardIdentifier').value;
  }

  document.getElementById('addJsButton').style.display = 'inline';

  document.getElementById('addFormButton').style.display = 'none';

  var bannersDiv = document.getElementById('bannersDiv');

  for (var j = 0; j < bannersDiv.childNodes.length; j++) {
    processBannerCell(bannersDiv.childNodes[j]);
  }

}

function processBannerCell(cell) {

  var button = cell.getElementsByClassName('deleteJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    removeBanner(cell.getElementsByClassName('bannerIdentifier')[0].value);
  };

  cell.getElementsByClassName('deleteFormButton')[0].style.display = 'none';

}

function addBanner() {

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

    apiRequest('createBanner', {
      files : files,
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

function removeBanner(bannerId) {
  apiRequest('deleteBanner', {
    bannerId : bannerId,
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}