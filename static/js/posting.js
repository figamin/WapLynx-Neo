var posting = {};

posting.init = function() {

  posting.idsRelation = {};
  posting.highLightedIds = [];

  posting.postCellTemplate = '<div class="innerPost"><div class="postInfo title">'
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

  posting.uploadCell = '<div class="uploadDetails"><a class="nameLink" target="blank">'
      + 'Open file</a> (<span class="sizeLabel"></span> <span class="dimensionLabel">'
      + '</span> <a class="originalNameLink"></a>)</div>'
      + '<div class="divHash"><span>MD5: <span class="labelHash"></span></span></div>'
      + '<a class="imgLink" ' + 'target="blank"></a>';

  posting.sizeOrders = [ 'B', 'KB', 'MB', 'GB', 'TB' ];

  posting.guiEditInfo = 'Edited last time by {$login} on {$date}.';

  posting.reverseHTMLReplaceTable = {
    '&lt;' : '<',
    '&gt;' : '>'
  };

  if (document.getElementById('deleteFormButton')) {

    api.convertButton('reportFormButton', posting.reportPosts, 'reportField');
    api.convertButton('deleteFormButton', posting.deletePosts, 'deletionField');

  }

  if (localStorage.relativeTime && JSON.parse(localStorage.relativeTime)) {

    posting.updateAllRelativeTimes();
    setInterval(posting.updateAllRelativeTimes, 1000 * 60 * 5);

  }

  var ids = document.getElementsByClassName('labelId');

  for (i = 0; i < ids.length; i++) {
    posting.processIdLabel(ids[i]);
  }

};

posting.processIdLabel = function(label) {

  var id = label.innerHTML;

  var array = posting.idsRelation[id] || [];
  posting.idsRelation[id] = array;

  var cell = label.parentNode.parentNode.parentNode;

  array.push(cell);

  label.onmouseover = function() {
    label.innerHTML = id + ' (' + array.length + ')';
  }

  label.onmouseout = function() {
    label.innerHTML = id;
  }

  label.onclick = function() {

    var index = posting.highLightedIds.indexOf(id);

    if (index > -1) {
      posting.highLightedIds.splice(index, 1);
    } else {
      posting.highLightedIds.push(id);
    }

    for (var i = 0; i < array.length; i++) {
      var cellToChange = array[i];

      if (cellToChange.className === 'innerOP') {
        continue;
      }

      cellToChange.className = index > -1 ? 'innerPost' : 'markedPost';
    }

  };

};

posting.updateAllRelativeTimes = function() {

  var times = document.getElementsByClassName('labelCreated');

  for (var i = 0; i < times.length; i++) {
    posting.addRelativeTime(times[i]);
  }

};

posting.addRelativeTime = function(time) {

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

posting.spoilFiles = function() {

  var posts = {
    action : 'spoil'
  };

  posting.newGetSelectedContent(posts);

  api.formApiRequest('contentActions', posts, function requestComplete(status,
      data) {

    if (status === 'ok') {

      alert('Files spoiled');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

posting.newGetSelectedContent = function(object) {

  var checkBoxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkBoxes.length; i++) {
    var checkBox = checkBoxes[i];

    if (checkBox.checked) {
      object[checkBox.name] = true;
    }
  }

};

posting.reportPosts = function() {

  var typedReason = document.getElementById('reportFieldReason').value.trim();
  var typedCaptcha = document.getElementById('fieldCaptchaReport').value.trim();

  if (typedCaptcha.length !== 6 && typedCaptcha.length !== 24) {
    alert('Captchas are exactly 6 (24 if no cookies) characters long.');
    return;
  } else if (/\W/.test(typedCaptcha)) {
    alert('Invalid captcha.');
    return;
  }

  var params = {
    action : 'report',
    reason : typedReason,
    captcha : typedCaptcha,
    global : document.getElementById('checkboxGlobal').checked,
  };

  posting.newGetSelectedContent(params);

  api.formApiRequest('contentActions', params, function reported(status, data) {

    if (status === 'ok') {

      alert('Content reported');

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }

  });

};

posting.deletePosts = function() {

  var typedPassword = document.getElementById('deletionFieldPassword').value
      .trim();

  var params = {
    password : typedPassword,
    deleteMedia : document.getElementById('checkboxMediaDeletion').checked,
    deleteUploads : document.getElementById('checkboxOnlyFiles').checked,
    action : 'delete'
  };

  posting.newGetSelectedContent(params);

  api.formApiRequest('contentActions', params, function requestComplete(status,
      data) {

    if (status === 'ok') {

      alert(data.removedThreads + ' threads and ' + data.removedPosts
          + ' posts were successfully deleted.');

      if (!api.isBoard && !data.removedThreads && data.removedPosts) {
        thread.refreshPosts(true, true);
      } else if (data.removedThreads || data.removedPosts) {
        window.location.pathname = '/';
      }

    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

};

posting.padDateField = function(value) {

  if (value < 10) {
    value = '0' + value;
  }

  return value;

};

posting.formatDateToDisplay = function(d) {

  var day = posting.padDateField(d.getUTCDate());

  var weekDays = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];

  var month = posting.padDateField(d.getUTCMonth() + 1);

  var year = d.getUTCFullYear();

  var weekDay = weekDays[d.getUTCDay()];

  var hour = posting.padDateField(d.getUTCHours());

  var minute = posting.padDateField(d.getUTCMinutes());

  var second = posting.padDateField(d.getUTCSeconds());

  var toReturn = month + '/' + day + '/' + year;

  return toReturn + ' (' + weekDay + ') ' + hour + ':' + minute + ':' + second;

};

posting.formatFileSize = function(size) {

  var orderIndex = 0;

  while (orderIndex < posting.sizeOrders.length - 1 && size > 1024) {

    orderIndex++;
    size /= 1024;

  }

  return size.toFixed(2) + ' ' + posting.sizeOrders[orderIndex];

};

posting.setLastEditedLabel = function(post, cell) {

  var editedLabel = cell.getElementsByClassName('labelLastEdit')[0];

  if (post.lastEditTime) {

    var formatedDate = posting.formatDateToDisplay(new Date(post.lastEditTime));

    editedLabel.innerHTML = posting.guiEditInfo
        .replace('{$date}', formatedDate).replace('{$login}',
            post.lastEditLogin);

  } else {
    editedLabel.remove();
  }

};

posting.setUploadLinks = function(cell, file, noExtras) {

  var thumbLink = cell.getElementsByClassName('imgLink')[0];
  thumbLink.href = file.path;

  thumbLink.setAttribute('data-filemime', file.mime);

  if (file.mime.indexOf('image/') > -1 && !noExtras) {
    gallery.addGalleryFile(file.path);
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

};

posting.getUploadCellBase = function() {

  var cell = document.createElement('figure');
  cell.innerHTML = posting.uploadCell;
  cell.className = 'uploadCell';

  return cell;

}

posting.setUploadCell = function(node, files, noExtras) {

  if (!files) {
    return;
  }

  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var cell = posting.getUploadCellBase();

    posting.setUploadLinks(cell, file, noExtras);

    var sizeString = posting.formatFileSize(file.size);
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

};

posting.setPostHideableElements = function(postCell, post, noExtras) {

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
      posting.processIdLabel(labelId);
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

  posting.setLastEditedLabel(post, postCell);

  var imgFlag = postCell.getElementsByClassName('imgFlag')[0];

  if (post.flag) {
    imgFlag.src = post.flag;
    imgFlag.title = post.flagName.replace(/&(l|g)t;/g, function replace(match) {
      return posting.reverseHTMLReplaceTable[match];
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

};

posting.setPostLinks = function(postCell, post, boardUri, link, threadId,
    linkQuote, deletionCheckbox) {

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

};

posting.setRoleSignature = function(postingCell, posting) {

  var labelRole = postingCell.getElementsByClassName('labelRole')[0];

  if (posting.signedRole) {
    labelRole.innerHTML = posting.signedRole;
  } else {
    labelRole.parentNode.removeChild(labelRole);
  }

};

posting.setPostComplexElements = function(postCell, post, boardUri, threadId,
    noExtras) {

  posting.setRoleSignature(postCell, post);

  var link = postCell.getElementsByClassName('linkSelf')[0];

  var linkQuote = postCell.getElementsByClassName('linkQuote')[0];
  linkQuote.innerHTML = post.postId || threadId;

  var deletionCheckbox = postCell.getElementsByClassName('deletionCheckBox')[0];

  posting.setPostLinks(postCell, post, boardUri, link, threadId, linkQuote,
      deletionCheckbox);

  var panelUploads = postCell.getElementsByClassName('panelUploads')[0];

  if (!post.files || !post.files.length) {
    panelUploads.remove();
  } else {
    posting.setUploadCell(panelUploads, post.files, noExtras);
  }

};

posting.setPostInnerElements = function(boardUri, threadId, post, postCell,
    noExtras) {

  var linkName = postCell.getElementsByClassName('linkName')[0];

  linkName.innerHTML = post.name;

  if (post.email) {
    linkName.href = 'mailto:' + post.email;
  } else {
    linkName.className += ' noEmailName';
  }

  var labelCreated = postCell.getElementsByClassName('labelCreated')[0];

  labelCreated.innerHTML = posting.formatDateToDisplay(new Date(post.creation));

  if (localStorage.relativeTime && JSON.parse(localStorage.relativeTime)) {
    posting.addRelativeTime(labelCreated);
  }

  postCell.getElementsByClassName('divMessage')[0].innerHTML = post.markdown;

  posting.setPostHideableElements(postCell, post, noExtras);

  posting.setPostComplexElements(postCell, post, boardUri, threadId, noExtras);

  var messageLinks = postCell.getElementsByClassName('divMessage')[0]
      .getElementsByTagName('a');

  for (var i = 0; i < messageLinks.length; i++) {
    embed.processLinkForEmbed(messageLinks[i]);
  }

  var links = postCell.getElementsByClassName('imgLink');

  var temporaryImageLinks = [];

  for (i = 0; i < links.length; i++) {
    temporaryImageLinks.push(links[i]);
  }

  for (i = 0; i < temporaryImageLinks.length; i++) {
    thumbs.processImageLink(temporaryImageLinks[i]);
  }

  var shownFiles = postCell.getElementsByClassName('uploadCell');

  for (var i = 0; i < shownFiles.length; i++) {
    mediaHiding.processFileForHiding(shownFiles[i]);
  }

  var hiddenMedia = mediaHiding.getHiddenMedia();

  for (i = 0; i < hiddenMedia.length; i++) {
    mediaHiding.updateHiddenFiles(hiddenMedia[i], true);
  }

  postCell.setAttribute('data-boarduri', boardUri);

  if (noExtras) {
    return;
  }

  tooltips.addToKnownPostsForBackLinks(postCell);

  var quotes = postCell.getElementsByClassName('quoteLink');

  for (i = 0; i < quotes.length; i++) {
    tooltips.processQuote(quotes[i]);
  }

  var linkSelf = postCell.getElementsByClassName('linkSelf')[0];
  hiding.setHideMenu(linkSelf);
  postingMenu.setExtraMenu(linkSelf)

  if (api.threadId) {
    thread.processPostingQuote(postCell.getElementsByClassName('linkQuote')[0]);
  }

};

posting.addPost = function(post, boardUri, threadId, noExtra) {

  var postCell = document.createElement('div');
  postCell.innerHTML = posting.postCellTemplate;

  postCell.id = post.postId;
  postCell.setAttribute('class', 'postCell');

  if (post.files && post.files.length > 1) {
    postCell.className += ' multipleUploads';
  }

  postCell.setAttribute('data-boarduri', boardUri);

  posting.setPostInnerElements(boardUri, threadId, post, postCell, noExtra);

  return postCell;

};

posting.init();
