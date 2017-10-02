if (!DISABLE_JS) {
  document.getElementById('restartFormButton').style.display = 'none';
  document.getElementById('restartJsButton').style.display = 'inline';
}

function restartSocket() {

  apiRequest('restartSocket', {}, function restarted(status, data) {

    if (status === 'ok') {
      window.location = '/socketControl.js';
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

}
