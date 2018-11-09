var socketControl = {};

socketControl.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  document.getElementById('restartFormButton').style.display = 'none';
  document.getElementById('restartJsButton').style.display = 'inline';

};

socketControl.restartSocket = function() {

  api.apiRequest('restartSocket', {}, function restarted(status, data) {

    if (status === 'ok') {
      window.location = '/socketControl.js';
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

socketControl.init();