var boardManagement = {};

boardManagement.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  var volunteerCellTemplate = '<span class="userLabel"></span> ';
  volunteerCellTemplate += '<input ';
  volunteerCellTemplate += 'type="hidden" ';
  volunteerCellTemplate += 'class="userIdentifier" ';
  volunteerCellTemplate += 'name="login">';
  volunteerCellTemplate += '<input ';
  volunteerCellTemplate += 'type="hidden" ';
  volunteerCellTemplate += 'class="boardIdentifier" ';
  volunteerCellTemplate += 'name="boardUri">';
  volunteerCellTemplate += '<input ';
  volunteerCellTemplate += 'type="hidden" ';
  volunteerCellTemplate += 'name="add" ';
  volunteerCellTemplate += 'value=false>';
  volunteerCellTemplate += '<input ';
  volunteerCellTemplate += 'type="button" ';
  volunteerCellTemplate += 'class="removeJsButton" ';
  volunteerCellTemplate += 'value="Remove Volunteer" ';
  volunteerCellTemplate += 'class="hidden"> ';
  volunteerCellTemplate += '<input ';
  volunteerCellTemplate += 'type="submit" ';
  volunteerCellTemplate += 'class="removeFormButton" ';
  volunteerCellTemplate += 'value="Remove Volunteer">';

  boardManagement.volunteerCellTemplate = volunteerCellTemplate;

  if (document.getElementById('ownerControlDiv')) {

    document.getElementById('addVolunteerJsButton').style.display = 'inline';
    document.getElementById('transferBoardJsButton').style.display = 'inline';
    document.getElementById('deleteBoardJsButton').style.display = 'inline';
    document.getElementById('cssJsButton').style.display = 'inline';
    document.getElementById('spoilerJsButton').style.display = 'inline';
    document.getElementById('spoilerFormButton').style.display = 'none';
    document.getElementById('cssFormButton').style.display = 'none';
    document.getElementById('deleteBoardFormButton').style.display = 'none';
    document.getElementById('addVolunteerFormButton').style.display = 'none';
    document.getElementById('transferBoardFormButton').style.display = 'none';

    if (document.getElementById('customJsForm')) {
      document.getElementById('jsJsButton').style.display = 'inline';

      document.getElementById('jsFormButton').style.display = 'none';
    }

    var volunteerDiv = document.getElementById('volunteersDiv');

    for (var i = 0; i < volunteerDiv.childNodes.length; i++) {
      boardManagement.processVolunteerCell(volunteerDiv.childNodes[i]);

    }
  }

  boardManagement.boardIdentifier = document
      .getElementById('boardSettingsIdentifier').value;
  document.getElementById('closeReportsJsButton').style.display = 'inline';
  document.getElementById('closeReportsFormButton').style.display = 'none';
  document.getElementById('saveSettingsJsButton').style.display = 'inline';
  document.getElementById('saveSettingsFormButton').style.display = 'none';

};

boardManagement.makeJsRequest = function(files) {

  api.apiRequest('setCustomJs', {
    files : files || [],
    boardUri : boardManagement.boardIdentifier,
  }, function requestComplete(status, data) {

    document.getElementById('JsFiles').type = 'text';
    document.getElementById('JsFiles').type = 'file';

    if (status === 'ok') {

      if (files) {
        alert('New javascript set.');
      } else {
        alert('Javascript deleted.');
      }

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
};

boardManagement.setJs = function() {

  var file = document.getElementById('JsFiles').files[0];

  if (!file) {
    boardManagement.makeJsRequest();
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function() {

    boardManagement.makeJsRequest([ {
      name : file.name,
      content : reader.result
    } ]);

  };

  reader.readAsDataURL(file);

};

boardManagement.makeSpoilerRequest = function(files) {

  api.apiRequest('setCustomSpoiler', {
    files : files || [],
    boardUri : boardManagement.boardIdentifier,
  }, function requestComplete(status, data) {

    document.getElementById('files').type = 'text';
    document.getElementById('files').type = 'file';

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
};

boardManagement.setSpoiler = function() {

  var file = document.getElementById('filesSpoiler').files[0];

  if (!file) {
    boardManagement.makeSpoilerRequest();
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function() {

    // style exception, too simple
    boardManagement.makeSpoilerRequest([ {
      name : file.name,
      content : reader.result
    } ]);
    // style exception, too simple

  };

  reader.readAsDataURL(file);

};

boardManagement.makeCssRequest = function(files) {

  api.apiRequest('setCustomCss', {
    files : files || [],
    boardUri : boardManagement.boardIdentifier,
  }, function requestComplete(status, data) {

    document.getElementById('files').type = 'text';
    document.getElementById('files').type = 'file';

    if (status === 'ok') {

      if (files) {
        alert('New CSS set.');
      } else {
        alert('CSS deleted.');
      }

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
};

boardManagement.setCss = function() {

  var file = document.getElementById('files').files[0];

  if (!file) {
    boardManagement.makeCssRequest();
    return;
  }

  var reader = new FileReader();

  reader.onloadend = function() {

    // style exception, too simple
    boardManagement.makeCssRequest([ {
      name : file.name,
      content : reader.result
    } ]);
    // style exception, too simple

  };

  reader.readAsDataURL(file);

};

boardManagement.saveSettings = function() {

  var typedName = document.getElementById('boardNameField').value.trim();
  var typedDescription = document.getElementById('boardDescriptionField').value
      .trim();
  var typedMessage = document.getElementById('boardMessageField').value.trim();
  var typedAnonymousName = document.getElementById('anonymousNameField').value
      .trim();
  var typedHourlyLimit = document.getElementById('hourlyThreadLimitField').value
      .trim();
  var typedAutoCaptcha = document.getElementById('autoCaptchaThresholdField').value
      .trim();
  var typedMaxBumpAge = document.getElementById('maxBumpAgeField').value.trim();
  var typedAutoSage = document.getElementById('autoSageLimitField').value
      .trim();
  var typedFileLimit = document.getElementById('maxFilesField').value.trim();
  var typedFileSize = document.getElementById('maxFileSizeField').value.trim();
  var typedTypedMimes = document.getElementById('validMimesField').value
      .split(',');
  var typedThreadLimit = document.getElementById('maxThreadsField').value
      .trim();

  if (typedHourlyLimit.length && isNaN(typedHourlyLimit)) {
    alert('Invalid hourly limit.');
    return;
  } else if (typedMaxBumpAge.length && isNaN(typedMaxBumpAge)) {
    alert('Invalid maximum age for bumping.');
    return;
  } else if (typedAutoCaptcha.length && isNaN(typedAutoCaptcha)) {
    alert('Invalid auto captcha treshold.');
    return;
  } else if (!typedName.length || !typedName.length) {
    alert('Both name and description are mandatory.');
    return;
  } else if (typedMessage.length > 256) {
    alert('Message too long, keep it under 256 characters.');
    return;
  }

  var settings = [];

  if (document.getElementById('blockDeletionCheckbox').checked) {
    settings.push('blockDeletion');
  }

  if (document.getElementById('requireFileCheckbox').checked) {
    settings.push('requireThreadFile');
  }

  if (document.getElementById('disableIdsCheckbox').checked) {
    settings.push('disableIds');
  }

  if (document.getElementById('allowCodeCheckbox').checked) {
    settings.push('allowCode');
  }

  if (document.getElementById('early404Checkbox').checked) {
    settings.push('early404');
  }

  if (document.getElementById('uniquePostsCheckbox').checked) {
    settings.push('uniquePosts');
  }

  if (document.getElementById('uniqueFilesCheckbox').checked) {
    settings.push('uniqueFiles');
  }

  if (document.getElementById('unindexCheckbox').checked) {
    settings.push('unindex');
  }

  if (document.getElementById('forceAnonymityCheckbox').checked) {
    settings.push('forceAnonymity');
  }

  if (document.getElementById('textBoardCheckbox').checked) {
    settings.push('textBoard');
  }

  var typedTags = document.getElementById('tagsField').value.split(',');

  var combo = document.getElementById('captchaModeComboBox');

  var locationCombo = document.getElementById('locationComboBox');

  api
      .apiRequest(
          'setBoardSettings',
          {
            boardName : typedName,
            captchaMode : combo.options[combo.selectedIndex].value,
            boardMessage : typedMessage,
            autoCaptchaLimit : typedAutoCaptcha,
            locationFlagMode : locationCombo.options[locationCombo.selectedIndex].value,
            hourlyThreadLimit : typedHourlyLimit,
            tags : typedTags,
            anonymousName : typedAnonymousName,
            boardDescription : typedDescription,
            boardUri : boardManagement.boardIdentifier,
            settings : settings,
            autoSageLimit : typedAutoSage,
            maxThreadCount : typedThreadLimit,
            maxFileSizeMB : typedFileSize,
            acceptedMimes : typedTypedMimes,
            maxFiles : typedFileLimit,
            maxBumpAge : typedMaxBumpAge
          }, function requestComplete(status, data) {

            if (status === 'ok') {

              location.reload(true);

            } else {
              alert(status + ': ' + JSON.stringify(data));
            }
          });

};

boardManagement.processVolunteerCell = function(cell) {

  var button = cell.getElementsByClassName('removeJsButton')[0];
  button.style.display = 'inline';
  cell.getElementsByClassName('removeFormButton')[0].style.display = 'none';

  button.onclick = function() {
    boardManagement.setVolunteer(
        cell.getElementsByClassName('userIdentifier')[0].value, false);
  };

};

boardManagement.addVolunteer = function() {

  boardManagement.setVolunteer(document
      .getElementById('addVolunteerFieldLogin').value.trim(), true, function(
      error) {

    if (error) {
      alert(error);
    } else {
      document.getElementById('addVolunteerFieldLogin').value = '';
    }

  });

};

boardManagement.setVolunteersDiv = function(volunteers) {

  var volunteersDiv = document.getElementById('volunteersDiv');

  while (volunteersDiv.firstChild) {
    volunteersDiv.removeChild(volunteersDiv.firstChild);
  }

  for (var i = 0; i < volunteers.length; i++) {

    var cell = document.createElement('form');
    cell.innerHTML = boardManagement.volunteerCellTemplate;

    cell.getElementsByClassName('userIdentifier')[0].setAttribute('value',
        volunteers[i]);

    cell.getElementsByClassName('userLabel')[0].innerHTML = volunteers[i];

    cell.getElementsByClassName('boardIdentifier')[0].setAttribute('value',
        boardManagement.boardIdentifier);

    boardManagement.processVolunteerCell(cell);

    volunteersDiv.appendChild(cell);
  }

};

boardManagement.refreshVolunteers = function() {

  api.localRequest('/boardManagement.js?json=1&boardUri='
      + boardManagement.boardIdentifier, function gotData(error, data) {

    if (error) {
      alert(error);
    } else {

      var parsedData = JSON.parse(data);

      boardManagement.setVolunteersDiv(parsedData.volunteers || []);

    }

  });

};

boardManagement.setVolunteer = function(user, add, callback) {

  api.apiRequest('setVolunteer', {
    login : user,
    add : add,
    boardUri : boardManagement.boardIdentifier
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      if (callback) {
        callback();
      }

      boardManagement.refreshVolunteers();

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

boardManagement.transferBoard = function() {

  api.apiRequest('transferBoardOwnership', {
    login : document.getElementById('transferBoardFieldLogin').value.trim(),
    boardUri : boardManagement.boardIdentifier
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      window.location.pathname = '/' + boardManagement.boardIdentifier + '/';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

boardManagement.deleteBoard = function() {

  api.apiRequest('deleteBoard', {
    boardUri : boardManagement.boardIdentifier,
    confirmDeletion : document.getElementById('confirmDelCheckbox').checked
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      window.location.pathname = '/';

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

boardManagement.init();