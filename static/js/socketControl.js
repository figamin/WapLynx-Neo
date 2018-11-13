var socketControl = {};

socketControl.init = function() {
  api.convertButton('restartFormButton', socketControl.restartSocket);
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