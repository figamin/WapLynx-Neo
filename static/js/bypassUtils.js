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

  var textEncoder = new TextEncoder("utf-8");
  var passwordBuffer = textEncoder.encode(session);

  var importedKey = await
  crypto.subtle.importKey("raw", passwordBuffer, "PBKDF2", false,
      [ "deriveBits" ]);

  var params = {
    name : "PBKDF2",
    hash : "SHA-512",
    iterations : 16384
  };

  var code = 0;

  while (1) {

    params.salt = textEncoder.encode(code);

    if (hash === btoa(String.fromCharCode(...new Uint8Array(
      await crypto.subtle.deriveBits(params, importedKey, 256 * 8))))) {
      break;
    } else {
      code++;
    }

  }

  bypassUtils.running = false;

  api.formApiRequest('validateBypass', {
    code : code
  }, callback);

};