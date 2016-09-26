if (!DISABLE_JS) {

  document.getElementById('reloadCaptchaButton').style.display = 'inline';
  document.getElementById('bypassJsButton').style.display = 'inline';

  document.getElementById('bypassFormButton').style.display = 'none';

}

function blockBypass() {

  var typedCaptcha = document.getElementById('fieldCaptcha').value.trim();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  apiRequest('renewBypass', {
    captcha : typedCaptcha
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      document.cookie = 'bypass=' + data + '; path=/';

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}