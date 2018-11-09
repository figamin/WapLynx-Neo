var bannerManagement = {};

bannerManagement.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  if (document.getElementById('boardIdentifier')) {
    api.boardUri = document
        .getElementById('boardIdentifier').value;
  }

  document.getElementById('addJsButton').style.display = 'inline';

  document.getElementById('addFormButton').style.display = 'none';

  var bannersDiv = document.getElementById('bannersDiv');

  for (var j = 0; j < bannersDiv.childNodes.length; j++) {
    bannerManagement.processBannerCell(bannersDiv.childNodes[j]);
  }

};

bannerManagement.processBannerCell = function(cell) {

  var button = cell.getElementsByClassName('deleteJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    bannerManagement.removeBanner(cell
        .getElementsByClassName('bannerIdentifier')[0].value);
  };

  cell.getElementsByClassName('deleteFormButton')[0].style.display = 'none';

};

bannerManagement.addBanner = function() {

  var file = document.getElementById('files').files[0];

  if (!file) {
    alert('You must select a file');
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function() {

    var files = [ {
      name : file.name,
      content : reader.result
    } ];

    // style exception, too simple
    api.apiRequest('createBanner', {
      files : files,
      boardUri : api.boardUri,
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

};

bannerManagement.removeBanner = function(bannerId) {
  api.apiRequest('deleteBanner', {
    bannerId : bannerId,
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
};

bannerManagement.init();