var api = {};

api.htmlReplaceTable = {
  '<' : '&lt;',
  '>' : '&gt;'
};

api.removeIndicator = function(className, thread) {

  var elements = (thread || document).getElementsByClassName(className);

  if (!elements.length) {
    return;
  }

  elements[0].nextSibling.remove();
  elements[0].remove();

};

api.addIndicator = function(className, title, thread) {

  var spanId = (thread || document).getElementsByClassName('spanId')[0];

  if (!spanId) {
    spanId = (thread || document).getElementsByClassName('labelCreated')[0];
  }

  var indicator = document.createElement('span');
  indicator.className = className;
  indicator.title = title;

  spanId.parentNode.insertBefore(indicator, spanId.nextSibling);
  spanId.parentNode.insertBefore(document.createTextNode(' '),
      spanId.nextSibling);

};

api.resetIndicators = function(data, thread) {

  api.removeIndicator('lockIndicator', thread);
  api.removeIndicator('pinIndicator', thread);
  api.removeIndicator('cyclicIndicator', thread);
  api.removeIndicator('archiveIndicator', thread);

  api.addIndicator('cyclicIndicator', 'Cyclical Thread', thread);
  api.addIndicator('pinIndicator', 'Sticky', thread);
  api.addIndicator('lockIndicator', 'Locked', thread);
  api.addIndicator('archiveIndicator', 'Archived', thread);

  if (!data.locked) {
    api.removeIndicator('lockIndicator', thread);
  }

  if (!data.pinned) {
    api.removeIndicator('pinIndicator', thread);
  }

  if (!data.cyclic) {
    api.removeIndicator('cyclicIndicator', thread);
  }

  if (!data.archived) {
    api.removeIndicator('archiveIndicator', thread);
  }

};

api.addEnterEvent = function(element, onclick) {

  element.addEventListener('keydown', function(event) {

    if (event.key === 'Enter') {
      onclick();
      event.preventDefault();
    }

  });

};

api.convertButton = function(button, onclick, inputs) {

  if (typeof (button) === 'string') {
    button = document.getElementById(button);
  }

  button.type = 'button';
  button.onclick = onclick;

  if (!inputs) {
    return;
  }

  inputs = document.getElementsByClassName(inputs);

  for (var i = 0; i < inputs.length; i++) {
    api.addEnterEvent(inputs[i], onclick);
  }

};

api.getCookies = function() {

  var parsedCookies = {};

  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {

    var cookie = cookies[i];

    var parts = cookie.split('=');
    parsedCookies[parts.shift().trim()] = decodeURI(parts.join('='));

  }

  return parsedCookies;

};

api.handleConnectionResponse = function(xhr, callback, silent) {

  var response;

  try {
    response = JSON.parse(xhr.responseText);
  } catch (error) {
    if (!silent) {
      alert('Error in parsing response.');
    }
    return;
  }

  if (response.auth && response.auth.authStatus === 'expired') {
    document.cookie = 'hash=' + response.auth.newHash + '; path=/; expires='
        + new Date(response.auth.expiration).toUTCString();
  }

  if (response.status === 'error') {

    if (!silent) {
      alert(response.data);
    }

  } else if (response.status === 'fileTooLarge') {
    alert('Maximum file size exceeded for a file.');
  } else if (response.status === 'hashBan') {

    var desc = '';

    var bans = response.data;

    for (var i = 0; i < bans.length; i++) {
      var ban = bans[i];

      if (i) {
        desc += '\n';
      }

      desc += 'File ' + ban.file + ' is banned from '
          + (ban.boardUri ? '/' + ban.boardUri + '/' : 'all boards.');

    }

    alert(desc);
  } else if (response.status === 'formatNotAllowed') {
    alert('A file had a format that is not allowed by the server.');
  } else if (response.status === 'blank') {
    alert('Parameter ' + response.data + ' was sent in blank.');
  } else if (response.status === 'bypassable') {

    postCommon.displayBlockBypassPrompt(function() {
      alert('You may now post');
    });

  } else if (response.status === 'tooLarge') {
    alert('Request refused because it was too large');
  } else if (response.status === 'maintenance') {

    if (!silent) {
      alert('The site is going under maintenance and all of it\'s functionalities are disabled temporarily.');
    }

  } else if (response.status === 'fileParseError') {
    alert('An uploaded file could not be parsed.');
  } else if (response.status === 'parseError') {
    alert('Your request could not be parsed.');
  } else if (response.status === 'banned') {
    if (response.data.range) {
      alert('Your ip range ' + response.data.range + ' has been banned from '
          + response.data.board + '.');
    } else {

      var message = 'You are banned from ' + response.data.board + ' until '
          + new Date(response.data.expiration).toString() + '.\nReason: '
          + response.data.reason + '.\nYour ban id: ' + response.data.banId
          + '.';

      if (!response.data.appealled) {
        message += '\nYou may appeal this ban.';

        var appeal = prompt(message, 'Write your appeal');

        if (appeal) {

          api.formApiRequest('appealBan', {
            appeal : appeal,
            banId : response.data.banId
          }, function appealed(status, data) {

            if (status !== 'ok') {
              alert(data);
            } else {
              alert('Ban appealed');
            }

          });

        }

      } else {
        alert(message);
      }

    }
  } else {
    callback(response.status, response.data);
  }

};

api.formApiRequest = function(page, parameters, callback, silent, getParameters) {

  var silent;

  page += '.js?json=1';

  getParameters = getParameters || {};

  for ( var parameter in getParameters) {
    page += '&' + parameter + '='
        + encodeURIComponent(getParameters[parameter]);
  }

  var xhr = new XMLHttpRequest();

  if ('withCredentials' in xhr) {
    xhr.open('POST', '/' + page, true);
  } else if (typeof XDomainRequest != 'undefined') {

    xhr = new XDomainRequest();
    xhr.open('POST', '/' + page);
  } else {
    alert('Update your browser or turn off javascript.');

    return;
  }

  if (callback.hasOwnProperty('progress')) {
    xhr.upload.onprogress = callback.progress;
  }

  xhr.onreadystatechange = function connectionStateChanged() {

    if (xhr.readyState !== 4) {
      return;
    }

    if (parameters.captcha) {
      captchaUtils.reloadCaptcha();
    }

    if (callback.hasOwnProperty('stop')) {
      callback.stop();
    }

    if (xhr.status != 200) {
      if (!silent) {
        alert('Connection failed.');
      }

      return;
    }

    api.handleConnectionResponse(xhr, callback, silent);

  };

  var form = new FormData();

  for ( var entry in parameters) {

    if (!parameters[entry] && typeof (parameters[entry] !== 'number')) {
      continue;
    }

    if (entry !== 'files') {
      form.append(entry, parameters[entry]);
    } else {

      var files = parameters.files;

      for (var i = 0; i < files.length; i++) {

        var file = files[i];

        if (file.md5 && file.mime) {
          form.append('fileMd5', file.md5);
          form.append('fileMime', file.mime);
          form.append('fileSpoiler', file.spoiler || '');
          form.append('fileName', file.name);
        }

        if (file.content) {
          form.append('files', file.content, file.name);
        }

      }

    }

  }

  xhr.send(form);

};

api.localRequest = function(address, callback) {

  var xhr = new XMLHttpRequest();

  if ('withCredentials' in xhr) {
    xhr.open('GET', address, true);
  } else if (typeof XDomainRequest != 'undefined') {

    xhr = new XDomainRequest();
    xhr.open('GET', address);
  } else {
    alert('Update your browser or turn off javascript.');
    return;
  }

  xhr.onreadystatechange = function connectionStateChanged() {

    if (xhr.readyState == 4) {

      if (callback.hasOwnProperty('stop')) {
        callback.stop();
      }

      if (xhr.status != 200) {
        callback('Connection failed');
      } else {
        callback(null, xhr.responseText);
      }

    }
  };

  xhr.send();

};
