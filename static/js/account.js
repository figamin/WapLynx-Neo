var account = {};

account.settingsRelation = {
  checkboxAlwaysSign : 'alwaysSignRole',
  checkboxReportNotify : 'reportNotify'
};

account.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  document.getElementById('logoutJsButton').style.display = 'inline';
  document.getElementById('saveJsButton').style.display = 'inline';
  document.getElementById('passwordJsButton').style.display = 'inline';

  if (document.getElementById('requestConfirmationJsButton')) {
    document.getElementById('requestConfirmationJsButton').style.display = 'inline';
    document.getElementById('requestConfirmationFormButton').style.display = 'none';
  }

  document.getElementById('passwordFormButton').style.display = 'none';
  document.getElementById('saveFormButton').style.display = 'none';
  document.getElementById('logoutFormButton').style.display = 'none';

  if (document.getElementById('boardCreationDiv')) {
    document.getElementById('newBoardFormButton').style.display = 'none';
    document.getElementById('newBoardJsButton').style.display = 'inline';
  }

};

account.requestConfirmation = function() {

  api.apiRequest('requestEmailConfirmation', {}, function requestComplete(
      status, data) {

    if (status === 'ok') {
      alert('Confirmation requested.');
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

account.logout = function() {

  document.cookie = 'login=invalid+login';
  document.cookie = 'hash=invalid+hash; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

  window.location.pathname = '/login.html';

};

account.changePassword = function() {

  var typedPassword = document.getElementById('fieldPassword').value;
  var typedNewPassword = document.getElementById('fieldNewPassword').value;
  var typedConfirmation = document.getElementById('fieldConfirmation').value;

  if (!typedPassword.length) {
    alert('You must provide your current password.');
  } else if (typedConfirmation !== typedNewPassword) {
    alert('Password confirmation does no match')
  } else if (!typedNewPassword.length) {
    alert('You cannot provide a blank password.');
  } else {
    api.apiRequest('changeAccountPassword', {
      password : typedPassword,
      newPassword : typedNewPassword,
      confirmation : typedConfirmation
    }, function requestComplete(status, data) {

      if (status === 'ok') {

        alert('Password changed.');

        location.reload(true);

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });
  }

};

account.save = function() {

  var selectedSettings = [];

  for ( var key in account.settingsRelation) {

    if (document.getElementById(key).checked) {
      selectedSettings.push(account.settingsRelation[key]);
    }

  }

  var typedEmail = document.getElementById('emailField').value.trim();

  if (typedEmail.length > 64) {
    alert('Email too long, keep it under 64 characters');
  } else {

    api.apiRequest('changeAccountSettings', {
      email : typedEmail,
      settings : selectedSettings
    }, function requestComplete(status, data) {

      if (status === 'ok') {

        alert('Settings changed.');

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

};

account.createBoard = function() {

  var typedUri = document.getElementById('newBoardFieldUri').value.trim();
  var typedName = document.getElementById('newBoardFieldName').value.trim();
  var typedDescription = document.getElementById('newBoardFieldDescription').value
      .trim();
  var typedCaptcha = document.getElementById('fieldCaptcha').value.trim();

  if (!typedUri.length || !typedName.length || !typedDescription.length) {
    alert('All fields are mandatory.');
  } else if (/\W/.test(typedUri)) {
    alert('Invalid uri.');
    return;
  } else if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  } else {
    api.apiRequest('createBoard', {
      boardUri : typedUri,
      boardName : typedName,
      boardDescription : typedDescription,
      captcha : typedCaptcha
    }, function requestComplete(status, data) {

      if (status === 'ok') {
        window.location.pathname = '/' + typedUri + '/';
      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });
  }

};

account.init();