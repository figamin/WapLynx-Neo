var postCellTemplate = '<div class="innerPost"><div class="postInfo title">'
    + '<input type="checkbox" class="deletionCheckBox"> <span class="labelSubject">'
    + '</span> <a class="linkName"></a> <img class="imgFlag"> <span class="labelRole">'
    + '</span> <span class="labelCreated"></span> <span class="spanId"> Id:<span '
    + 'class="labelId"></span></span> <a '
    + 'class="linkSelf">No.</a> <a class="linkQuote"></a> <span class="panelBacklinks">'
    + '</span></div>'
    + '<div>'
    + '<span class="panelIp"> <span class="panelRange">Broad'
    + 'range(1/2 octets): <span class="labelBroadRange"> </span> <br>'
    + 'Narrow range(3/4 octets): <span class="labelNarrowRange"> </span> <br>'
    + '</span> Ip: <span class="labelIp"></span></span>'
    + '</div>'
    + '<div class="panelUploads"></div><div class="divMessage"></div>'
    + '<div class="divBanMessage"></div><div class="labelLastEdit"></div></div>';

var uploadCell = '<div class="uploadDetails"><a class="nameLink" target="blank">'
    + 'Open file</a> (<span class="sizeLabel"></span> <span class="dimensionLabel">'
    + '</span> <a class="originalNameLink"></a>)</div>'
    + '<div class="divHash"><span>MD5: <span class="labelHash"></span></span></div>'
    + '<a class="imgLink" ' + 'target="blank"></a>';

var sizeOrders = [ 'B', 'KB', 'MB', 'GB', 'TB' ];

var guiEditInfo = 'Edited last time by {$login} on {$date}.';

var reverseHTMLReplaceTable = {
  '&lt;' : '<',
  '&gt;' : '>'
};

if (!DISABLE_JS) {

  if (document.getElementById('deleteJsButton')) {
    document.getElementById('deleteJsButton').style.display = 'inline';
    document.getElementById('reportJsButton').style.display = 'inline';
    document.getElementById('reportFormButton').style.display = 'none';
    document.getElementById('deleteFormButton').style.display = 'none';

    if (document.getElementById('divMod')) {

      document.getElementById('banJsButton').style.display = 'inline';
      document.getElementById('spoilJsButton').style.display = 'inline';
      document.getElementById('ipDeletionJsButton').style.display = 'inline';

      document.getElementById('inputIpDelete').style.display = 'none';
      document.getElementById('inputBan').style.display = 'none';
      document.getElementById('inputSpoil').style.display = 'none';
    }

  }

  if (localStorage.relativeTime && JSON.parse(localStorage.relativeTime)) {

    updateAllRelativeTimes();
    setInterval(updateAllRelativeTimes, 1000 * 60 * 5);

  }

}

function updateAllRelativeTimes() {

  var times = document.getElementsByClassName('labelCreated');

  for (var i = 0; i < times.length; i++) {
    addRelativeTime(times[i]);
  }

}

function addRelativeTime(time) {

  var timeObject = new Date(time.innerHTML + ' UTC');

  if (time.nextSibling.nextSibling.className !== 'relativeTime') {

    var newRelativeLabel = document.createElement('span');

    newRelativeLabel.className = 'relativeTime';

    time.parentNode.insertBefore(newRelativeLabel, time.nextSibling);
    time.parentNode
        .insertBefore(document.createTextNode(' '), time.nextSibling);

  }

  var now = new Date();

  var content;

  var delta = now - timeObject;

  var second = 1000;
  var minute = second * 60;
  var hour = minute * 60;
  var day = hour * 24;
  var month = day * 30.5;
  var year = day * 365.25;

  if (delta > 2 * year) {
    content = Math.ceil(delta / year) + ' years ago';
  } else if (delta > 2 * month) {
    content = Math.ceil(delta / month) + ' months ago';
  } else if (delta > 2 * day) {
    content = Math.ceil(delta / day) + ' days ago';
  } else if (delta > 2 * hour) {
    content = Math.ceil(delta / hour) + ' hours ago';
  } else if (delta > 2 * minute) {
    content = Math.ceil(delta / minute) + ' minutes ago';
  } else {
    content = 'Just now'
  }

  time.nextSibling.nextSibling.innerHTML = '(' + content + ')';

};

function spoilFiles() {

  apiRequest('spoilFiles', {
    postings : getSelectedContent()
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Files spoiled');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function applyBans(captcha) {
  var typedReason = document.getElementById('reportFieldReason').value.trim();
  var typedDuration = document.getElementById('fieldDuration').value.trim();
  var typedMessage = document.getElementById('fieldbanMessage').value.trim();
  var banType = document.getElementById('comboBoxBanTypes').selectedIndex;

  var toBan = getSelectedContent();

  apiRequest('banUsers', {
    reason : typedReason,
    captcha : captcha,
    banType : banType,
    duration : typedDuration,
    banMessage : typedMessage,
    global : document.getElementById('checkboxGlobal').checked,
    postings : toBan
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Bans applied');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });
}

function banPosts() {

  if (!document.getElementsByClassName('panelRange').length) {
    applyBans();
    return;
  }

  var typedCaptcha = document.getElementById('fieldCaptchaReport').value.trim();

  if (typedCaptcha && /\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  if (typedCaptcha.length == 24 || !typedCaptcha) {
    applyBans(typedCaptcha);
  } else {
    var parsedCookies = getCookies();

    apiRequest('solveCaptcha', {
      captchaId : parsedCookies.captchaid,
      answer : typedCaptcha
    }, function solvedCaptcha(status, data) {
      applyBans(parsedCookies.captchaid);
    });
  }

}

function getSelectedContent() {
  var selectedContent = [];

  var checkBoxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkBoxes.length; i++) {
    var checkBox = checkBoxes[i];

    if (checkBox.checked) {

      var splitName = checkBox.name.split('-');

      var toAdd = {
        board : splitName[0],
        thread : splitName[1]
      };

      if (splitName.length > 2) {
        toAdd.post = splitName[2];
      }

      selectedContent.push(toAdd);

    }
  }

  return selectedContent;

}

var reportCallback = function(status, data) {

  if (status === 'ok') {

    alert('Content reported');

  } else {
    alert(status + ': ' + JSON.stringify(data));
  }
}

function reportPosts() {

  var typedReason = document.getElementById('reportFieldReason').value.trim();
  var typedCaptcha = document.getElementById('fieldCaptchaReport').value.trim();

  var toReport = getSelectedContent();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  apiRequest('reportContent', {
    reason : typedReason,
    captcha : typedCaptcha,
    global : document.getElementById('checkboxGlobal').checked,
    postings : toReport
  }, reportCallback);
}

function deletePosts() {

  var typedPassword = document.getElementById('deletionFieldPassword').value
      .trim();

  var toDelete = getSelectedContent();

  if (!toDelete.length) {
    alert('Nothing selected');
    return;
  }

  apiRequest('deleteContent', {
    password : typedPassword,
    deleteMedia : document.getElementById('checkboxMediaDeletion').checked,
    deleteUploads : document.getElementById('checkboxOnlyFiles').checked,
    postings : toDelete
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert(data.removedThreads + ' threads and ' + data.removedPosts
          + ' posts were successfully deleted.');

      if (!board && !data.removedThreads && data.removedPosts) {
        refreshPosts(true, true);
      } else if (data.removedThreads || data.removedPosts) {
        window.location.pathname = '/' + toDelete[0].board + '/';
      }

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function deleteFromIpOnBoard() {

  var selected = getSelectedContent();

  var redirect = '/' + selected[0].board + '/';

  apiRequest('deleteFromIpOnBoard', {
    postings : selected
  }, function requestComplete(status, data) {

    if (status === 'ok') {

      alert('Content deleted');

      window.location.pathname = redirect;

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}

function padDateField(value) {
  if (value < 10) {
    value = '0' + value;
  }

  return value;
}

function formatDateToDisplay(d) {
  var day = padDateField(d.getUTCDate());

  var weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

  var month = padDateField(d.getUTCMonth() + 1);

  var year = d.getUTCFullYear();

  var weekDay = weekDays[d.getUTCDay()];

  var hour = padDateField(d.getUTCHours());

  var minute = padDateField(d.getUTCMinutes());

  var second = padDateField(d.getUTCSeconds());

  var toReturn = month + '/' + day + '/' + year;

  return toReturn + ' (' + weekDay + ') ' + hour + ':' + minute + ':' + second;
}

function formatFileSize(size) {

  var orderIndex = 0;

  while (orderIndex < sizeOrders.length - 1 && size > 1024) {

    orderIndex++;
    size /= 1024;

  }

  return size.toFixed(2) + ' ' + sizeOrders[orderIndex];

}

function setLastEditedLabel(post, cell) {

  var editedLabel = cell.getElementsByClassName('labelLastEdit')[0];

  if (post.lastEditTime) {

    var formatedDate = formatDateToDisplay(new Date(post.lastEditTime));

    editedLabel.innerHTML = guiEditInfo.replace('{$date}', formatedDate)
        .replace('{$login}', post.lastEditLogin);

  } else {
    editedLabel.remove();
  }

}

function setUploadLinks(cell, file, noExtras) {
  var thumbLink = cell.getElementsByClassName('imgLink')[0];
  thumbLink.href = file.path;

  thumbLink.setAttribute('data-filemime', file.mime);

  if (file.mime.indexOf('image/') > -1 && !noExtras) {
    addGalleryFile(file.path);
  }

  var img = document.createElement('img');
  img.src = file.thumb;

  thumbLink.appendChild(img);

  var nameLink = cell.getElementsByClassName('nameLink')[0];
  nameLink.href = file.path;

  var originalLink = cell.getElementsByClassName('originalNameLink')[0];
  originalLink.innerHTML = file.originalName;
  originalLink.href = file.path;
  originalLink.setAttribute('download', file.originalName);
}

function getUploadCellBase() {
  var cell = document.createElement('figure');
  cell.innerHTML = uploadCell;
  cell.className = 'uploadCell';

  return cell;
}

function setUploadCell(node, files, noExtras) {

  if (!files) {
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var cell = getUploadCellBase();

    setUploadLinks(cell, file, noExtras);

    var sizeString = formatFileSize(file.size);
    cell.getElementsByClassName('sizeLabel')[0].innerHTML = sizeString;

    var dimensionLabel = cell.getElementsByClassName('dimensionLabel')[0];

    if (file.width) {
      dimensionLabel.innerHTML = file.width + 'x' + file.height;
    } else {
      dimensionLabel.remove();
    }

    if (file.md5) {
      cell.getElementsByClassName('labelHash')[0].innerHTML = file.md5;
    } else {
      cell.getElementsByClassName('divHash')[0].remove();
    }

    node.appendChild(cell);
  }

}

function setPostHideableElements(postCell, post, noExtras) {
  var subjectLabel = postCell.getElementsByClassName('labelSubject')[0];
  if (post.subject) {
    subjectLabel.innerHTML = post.subject;
  } else {
    subjectLabel.remove();
  }

  if (post.id) {
    var labelId = postCell.getElementsByClassName('labelId')[0];
    labelId.setAttribute('style', 'background-color: #' + post.id);
    labelId.innerHTML = post.id;

    if (!noExtras) {
      processIdLabel(labelId);
    }

  } else {
    var spanId = postCell.getElementsByClassName('spanId')[0];
    spanId.remove();
  }

  var banMessageLabel = postCell.getElementsByClassName('divBanMessage')[0];

  if (!post.banMessage) {
    banMessageLabel.parentNode.removeChild(banMessageLabel);
  } else {
    banMessageLabel.innerHTML = post.banMessage;
  }

  setLastEditedLabel(post, postCell);

  var imgFlag = postCell.getElementsByClassName('imgFlag')[0];

  if (post.flag) {
    imgFlag.src = post.flag;
    imgFlag.title = post.flagName.replace(/&(l|g)t;/g, function replace(match) {
      return reverseHTMLReplaceTable[match];
    });

    if (post.flagCode) {
      imgFlag.className += ' flag' + post.flagCode;
    }
  } else {
    imgFlag.remove();
  }

  if (!post.ip) {
    postCell.getElementsByClassName('panelIp')[0].remove();
  } else {

    postCell.getElementsByClassName('labelIp')[0].innerHTML = post.ip;

    if (!post.broadRange) {
      postCell.getElementsByClassName('panelRange')[0].remove();
    } else {

      postCell.getElementsByClassName('labelBroadRange')[0].innerHTML = post.broadRange;
      postCell.getElementsByClassName('labelNarrowRange')[0].innerHTML = post.narrowRange;

    }

  }

}

function setPostLinks(postCell, post, boardUri, link, threadId, linkQuote,
    deletionCheckbox) {

  var postingId = post.postId || threadId;

  var linkStart = '/' + boardUri + '/res/' + threadId + '.html#';

  linkQuote.href = linkStart;
  link.href = linkStart;

  link.href += postingId;
  linkQuote.href += 'q' + postingId;

  var checkboxName = boardUri + '-' + threadId;

  if (post.postId) {
    checkboxName += '-' + post.postId;
  }

  deletionCheckbox.setAttribute('name', checkboxName);

}

function setRoleSignature(postingCell, posting) {
  var labelRole = postingCell.getElementsByClassName('labelRole')[0];

  if (posting.signedRole) {
    labelRole.innerHTML = posting.signedRole;
  } else {
    labelRole.parentNode.removeChild(labelRole);
  }
}

function setPostComplexElements(postCell, post, boardUri, threadId, noExtras) {

  setRoleSignature(postCell, post);

  var link = postCell.getElementsByClassName('linkSelf')[0];

  var linkQuote = postCell.getElementsByClassName('linkQuote')[0];
  linkQuote.innerHTML = post.postId || threadId;

  var deletionCheckbox = postCell.getElementsByClassName('deletionCheckBox')[0];

  setPostLinks(postCell, post, boardUri, link, threadId, linkQuote,
      deletionCheckbox);

  var panelUploads = postCell.getElementsByClassName('panelUploads')[0];

  if (!post.files || !post.files.length) {
    panelUploads.remove();
  } else {
    setUploadCell(panelUploads, post.files, noExtras);
  }

}

function setPostInnerElements(boardUri, threadId, post, postCell, noExtras) {

  var linkName = postCell.getElementsByClassName('linkName')[0];

  linkName.innerHTML = post.name;

  if (post.email) {
    linkName.href = 'mailto:' + post.email;
  } else {
    linkName.className += ' noEmailName';
  }

  var labelCreated = postCell.getElementsByClassName('labelCreated')[0];

  labelCreated.innerHTML = formatDateToDisplay(new Date(post.creation));

  if (localStorage.relativeTime && JSON.parse(localStorage.relativeTime)) {
    addRelativeTime(labelCreated);
  }

  postCell.getElementsByClassName('divMessage')[0].innerHTML = post.markdown;

  setPostHideableElements(postCell, post, noExtras);

  setPostComplexElements(postCell, post, boardUri, threadId, noExtras);

  var messageLinks = postCell.getElementsByClassName('divMessage')[0]
      .getElementsByTagName('a');

  for (var i = 0; i < messageLinks.length; i++) {
    processLinkForEmbed(messageLinks[i]);
  }

  var links = postCell.getElementsByClassName('imgLink');

  var temporaryImageLinks = [];

  for (i = 0; i < links.length; i++) {
    temporaryImageLinks.push(links[i]);
  }

  for (i = 0; i < temporaryImageLinks.length; i++) {
    processImageLink(temporaryImageLinks[i]);
  }

  var shownFiles = postCell.getElementsByClassName('uploadCell');

  for (var i = 0; i < shownFiles.length; i++) {
    processFileForHiding(shownFiles[i]);
  }

  var hiddenMedia = getHiddenMedia();

  for (i = 0; i < hiddenMedia.length; i++) {
    updateHiddenFiles(hiddenMedia[i], true);
  }

  postCell.setAttribute('data-boarduri', boardUri);

  if (noExtras) {
    return;
  }

  addToKnownPostsForBackLinks(postCell);

  var quotes = postCell.getElementsByClassName('quoteLink');

  for (i = 0; i < quotes.length; i++) {
    processQuote(quotes[i]);
  }

  var checkbox = postCell.getElementsByClassName('deletionCheckBox')[0];

  setHideMenu(checkbox);
  setExtraMenu(checkbox)

  processPostingQuote(postCell.getElementsByClassName('linkQuote')[0]);
}

function addPost(post, boardUri, threadId, noExtra) {

  var postCell = document.createElement('div');
  postCell.innerHTML = postCellTemplate;

  postCell.id = post.postId;
  postCell.setAttribute('class', 'postCell');

  if (post.files && post.files.length > 1) {
    postCell.className += ' multipleUploads';
  }

  postCell.setAttribute('data-boarduri', boardUri);

  setPostInnerElements(boardUri, threadId, post, postCell, noExtra);

  return postCell;

}
