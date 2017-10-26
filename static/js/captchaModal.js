function getCaptchaModal(header, noCaptcha) {

  var outerPanel = document.createElement('div');
  outerPanel.setAttribute('class', 'modalPanel');
  document.body.appendChild(outerPanel);

  var innerPanel = document.createElement('div');
  innerPanel.setAttribute('class', 'modalInnerPanel');
  outerPanel.appendChild(innerPanel);

  var decorationPanel = document.createElement('div');
  decorationPanel.setAttribute('class', 'modalDecorationPanel');
  innerPanel.appendChild(decorationPanel);

  var topLabel = document.createElement('span');
  topLabel.setAttribute('class', 'modalHeader');
  topLabel.innerHTML = header;
  decorationPanel.appendChild(topLabel);

  if (!noCaptcha) {
    var captchaImage = document.createElement('img');
    captchaImage.src = '/captcha.js?d=' + new Date().toString();
    captchaImage.setAttribute('class', 'captchaImage');
    decorationPanel.appendChild(captchaImage);

    var captchaControls = document.createElement('span');
    captchaControls.setAttribute('class', 'modalCaptchaControls');
    decorationPanel.appendChild(captchaControls);

    var reloadButton = document.createElement('input');
    reloadButton.value = 'Reload';
    reloadButton.addEventListener('click', function() {
      reloadCaptcha()
    });
    reloadButton.type = 'button';
    captchaControls.appendChild(reloadButton);

    var reloadTimer = document.createElement('span');
    reloadTimer.setAttribute('class', 'captchaTimer');
    captchaControls.appendChild(reloadTimer);

    var captchaField = document.createElement('input');
    captchaField.type = 'text';
    captchaField.setAttribute('placeHolder', 'answer');
    captchaField.setAttribute('class', 'modalAnswer');
    decorationPanel.appendChild(captchaField);
  }

  var responseButtonsPanel = document.createElement('span');
  decorationPanel.appendChild(responseButtonsPanel);

  var okButton = document.createElement('input');
  okButton.type = 'button';
  okButton.setAttribute('class', 'modalOkButton');
  okButton.value = 'Ok';
  responseButtonsPanel.appendChild(okButton);

  var cancelButton = document.createElement('input');
  cancelButton.type = 'button';
  cancelButton.value = 'Cancel';
  cancelButton.onclick = function() {
    outerPanel.remove();
  };
  responseButtonsPanel.appendChild(cancelButton);

  return outerPanel;

}