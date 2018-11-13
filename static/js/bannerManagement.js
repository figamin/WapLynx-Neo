var bannerManagement = {};

bannerManagement.init = function() {

  if (document.getElementById('boardIdentifier')) {
    api.boardUri = document.getElementById('boardIdentifier').value;
  }

  api.convertButton('addFormButton', bannerManagement.addBanner);

  var bannersDiv = document.getElementById('bannersDiv');

  for (var j = 0; j < bannersDiv.childNodes.length; j++) {
    bannerManagement.processBannerCell(bannersDiv.childNodes[j]);
  }

  bannerManagement.bannersDiv = bannersDiv;

};

bannerManagement.processBannerCell = function(cell) {

  var button = cell.getElementsByClassName('deleteFormButton')[0];

  api.convertButton(button, function() {
    bannerManagement.removeBanner(cell);
  });

};

bannerManagement.refreshBanners = function() {

  var address = '/bannerManagement.js?json=1';
  if (api.boardUri) {
    address += '&boardUri=' + api.boardUri;
  }

  api.localRequest(address, function gotBannerData(error, data) {

    if (error) {
      alert(error);
      return;
    }

    data = JSON.parse(data);

    data = data[data.length - 1];

    var form = document.createElement('form');
    form.className = 'bannerCell';
    form.action = '/deleteBanner.js';
    form.method = 'post';
    form.enctype = 'multipart/form-data';

    var img = document.createElement('img');
    img.className = 'bannerImage';
    img.src = data.filename;
    form.appendChild(img);

    form.appendChild(document.createElement('br'));

    var identifier = document.createElement('input');
    identifier.name = 'bannerId';
    identifier.className = 'bannerIdentifier';
    identifier.value = data._id;
    identifier.type = 'hidden';
    form.appendChild(identifier);

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'deleteFormButton';
    button.innerHTML = 'Delete banner';
    form.appendChild(button);

    form.appendChild(document.createElement('hr'));

    bannerManagement.bannersDiv.appendChild(form);

    bannerManagement.processBannerCell(form);

  });

};

bannerManagement.addBanner = function() {

  var filePicker = document.getElementById('files');

  var file = filePicker.files[0];

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

        filePicker.type = 'text';
        filePicker.type = 'file';

        bannerManagement.refreshBanners();
        // TODO refactor on 2.2 when the data of the new banner is returned

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });
    // style exception, too simple

  };

  reader.readAsDataURL(file);

};

bannerManagement.removeBanner = function(cell) {

  api.apiRequest('deleteBanner', {
    bannerId : cell.getElementsByClassName('bannerIdentifier')[0].value,
  }, function requestComplete(status, data) {

    if (status === 'ok') {
      cell.remove();
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

bannerManagement.init();