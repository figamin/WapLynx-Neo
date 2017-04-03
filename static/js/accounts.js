if (!DISABLE_JS) {
  document.getElementById('addAccountJsButton').style.display = 'inline';

  document.getElementById('addAccountFormButton').style.display = 'none';
}

function addAccount() {

  var typedLogin = document.getElementById('fieldLogin').value;
  var typedPassword = document.getElementById('fieldPassword').value;

  if (!typedLogin.length || !typedPassword.length) {
    alert('Both login and password are mandatory.');
  } else if (typedLogin.length > 16) {
    alert('Login too long, keep it under 16 characters.');
  } else if (/\W/.test(typedLogin)) {
    alert('Invalid login.');
  } else {

    apiRequest('addAccount', {
      login : typedLogin,
      password : typedPassword
    }, function requestComplete(status, data) {

      if (status === 'ok') {
        location.reload(true);
      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

}