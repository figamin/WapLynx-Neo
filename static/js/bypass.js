var bypass = {};

bypass.init = function() {
  api.convertButton('bypassFormButton', bypass.blockBypass, 'bypassField');

  bypass.creationButton = document.getElementById('bypassFormButton');
  bypass.originalCreationText = bypass.creationButton.innerHTML;

  bypass.validationButton = document.getElementById("validationButton");
  if (!bypass.validationButton) {
    return;
  }

  bypass.originalText = bypass.validationButton.innerHTML;

  bypass.validationButton.className = "";

  var callback = function(status, data) {

    if (status === 'ok') {
      document.getElementById("indicatorNotValidated").remove();
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  };

  callback.stop = function() {
    bypass.validationButton.innerHTML = bypass.originalText;
  };

  bypass.validationButton.onclick = function() {

    bypass.validationButton.innerHTML = "Please wait for validation";

    bypassUtils.runValidation(callback);

  };

};

bypass.addIndicator = function() {

  if (document.getElementById('indicatorValidBypass')) {
    return;
  }

  var paragraph = document.getElementsByTagName('p')[0];

  var span = document.createElement('span');
  span.innerHTML = 'You have a valid block bypass.';
  span.id = 'indicatorValidBypass';
  paragraph.appendChild(span);

};

bypass.blockBypass = function() {

  var captchaField = document.getElementById('fieldCaptcha');

  var typedCaptcha = captchaField.value.trim();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  api.formApiRequest('renewBypass', {
    captcha : typedCaptcha
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      captchaUtils.reloadCaptcha();

      captchaField.value = '';

      if (api.getCookies().bypass.length <= 372) {

        bypass.addIndicator();
        return;

      }

      var callback = function(status, data) {

        if (status === 'ok') {
          bypass.addIndicator();
        } else {
          alert(status + ': ' + JSON.stringify(data));
        }

      };

      callback.stop = function(){
        bypass.creationButton.innerHTML = bypass.originalCreationText;
      };

      bypass.creationButton.innerHTML = "Please wait for validation";

      bypassUtils.runValidation(callback);

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

bypass.init();