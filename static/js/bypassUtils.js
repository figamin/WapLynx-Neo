var bypassUtils = {};

bypassUtils.running = false;

bypassUtils.checkPass = function(callback) {

  api.formApiRequest('blockBypass', {},
      function checked(status, data) {

        if (status !== 'ok') {
          return alert(status + ': ' + JSON.stringify(data));
        }

        var alwaysUseBypass = document
            .getElementById('alwaysUseBypassCheckBox').checked;

        var required = data.mode == 2 || (data.mode == 1 && alwaysUseBypass);

        if (!data.valid && required) {
          postCommon.displayBlockBypassPrompt(function() {
            callback();
          });

        } else if (!data.validated && required) {
          bypassUtils.runValidation(callback);
        } else {
          callback();
        }

      });

};

bypassUtils.runValidation = async function(callback) {

  if (bypassUtils.running) {

    if (callback.stop) {
      callback.stop();
    }

    return;

  }

  bypassUtils.running = true;

  var bypassData = api.getCookies().bypass;

  var session = bypassData.substr(24, 344);
  var hash = bypassData.substr(24 + 344);

  for (var i = 0; i < bypassUtils.workers.length; i++) {

    bypassUtils.workers[i].postMessage({
      type : 'start',
      session : session,
      code : i,
      hash : hash
    });

  }

  bypassUtils.callback = callback;

};

bypassUtils.workers = [];

bypassUtils.workerResponse = function(code) {

  code = code.data;

  bypassUtils.running = false;

  for (var i = 0; i < bypassUtils.workers.length; i++) {

    bypassUtils.workers[i].postMessage({
      type : 'stop'
    });

  }

  api.formApiRequest('validateBypass', {
    code : code
  }, bypassUtils.callback);

};

for (var i = 0; i < navigator.hardwareConcurrency; i++) {
  bypassUtils.workers.push(new Worker('/.static/js/validationWorker.js'));
  bypassUtils.workers[i].onmessage = bypassUtils.workerResponse;
}