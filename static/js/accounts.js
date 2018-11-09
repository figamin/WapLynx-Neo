var accounts = {};

accounts.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  document.getElementById('addAccountJsButton').style.display = 'inline';
  document.getElementById('addAccountFormButton').style.display = 'none';

};

accounts.addAccount = function() {

  var typedLogin = document.getElementById('fieldLogin').value;
  var typedPassword = document.getElementById('fieldPassword').value;
  var typedEmail = document.getElementById('fieldEmail').value;

  if (!typedLogin.length || !typedPassword.length) {
    alert('Both login and password are mandatory.');
  } else if (typedLogin.length > 16) {
    alert('Login too long, keep it under 16 characters.');
  } else if (/\W/.test(typedLogin)) {
    alert('Invalid login.');
  } else {

    api.apiRequest('addAccount', {
      login : typedLogin,
      password : typedPassword,
      email : typedEmail
    }, function requestComplete(status, data) {

      if (status === 'ok') {
        location.reload(true);
      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

};

accounts.init();