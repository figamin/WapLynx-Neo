var boardUri;

if (!DISABLE_JS) {

  document.getElementById('reloadCaptchaButton').style.display = 'inline';

  var boardIdentifier = document.getElementById('boardIdentifier');

  if (boardIdentifier) {
    boardUri = boardIdentifier.value;
  }

  document.getElementById('createFormButton').style.display = 'none';
  document.getElementById('createJsButton').style.display = 'inline';

  var proxyBanDiv = document.getElementById('proxyBansDiv');

  for (var j = 0; j < proxyBanDiv.childNodes.length; j++) {
    processProxyBanCell(proxyBanDiv.childNodes[j]);
  }
}

function processProxyBanCell(cell) {

  var button = cell.getElementsByClassName('liftJsButton')[0];
  button.style.display = 'inline';

  button.onclick = function() {
    liftProxyBan(cell.getElementsByClassName('idIdentifier')[0].value);
  };

  cell.getElementsByClassName('liftFormButton')[0].style.display = 'none';

}

function liftProxyBan(proxyBan) {

  apiRequest('liftProxyBan', {
    proxyBanId : proxyBan
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      location.reload(true);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function reloadCaptcha() {
  document.cookie = 'captchaid=; path=/;';

  document.getElementById('captchaImage').src = '/captcha.js#'
      + new Date().toString();

}

function placeProxyBan() {

  var typedCaptcha = document.getElementById('fieldCaptcha').value.trim();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  var typedIp = document.getElementById('ipField').value.trim();

  var parameters = {
    captcha : typedCaptcha,
    proxyIp : typedIp
  };

  if (boardUri) {
    parameters.boardUri = boardUri;
  }

  apiRequest('placeProxyBan', parameters,
      function requestComplete(status, data) {

        if (status === 'ok') {

          location.reload(true);

        } else {
          alert(status + ': ' + JSON.stringify(data));
        }
      });

}