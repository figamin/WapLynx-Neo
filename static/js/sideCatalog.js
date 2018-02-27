if (!DISABLE_JS) {

  htmlReplaceTable = {
    '<' : '&lt;',
    '>' : '&gt;'
  };

  var refreshingSideCatalog = false;
  var loadingThread = false;
  var sideCatalogBody = document.getElementById('sideCatalogBody');

  var sideCatalog = document.getElementById('sideCatalog');

  if (!localStorage.hideSideCatalog) {
    sideCatalog.style.display = 'block';
  }

  refreshSideCatalog();

  document.getElementById('closeSideCatalogButton').onclick = function() {
    sideCatalog.style.display = 'none';
    localStorage.setItem('hideSideCatalog', true);
  }

  var catalogButton = document.getElementById('navCatalog');

  var sideCatalogButton = document.createElement('a');
  sideCatalogButton.className = 'coloredIcon';
  sideCatalogButton.id = 'navSideCatalog';
  sideCatalogButton.innerHTML = 'side catalog';
  sideCatalogButton.onclick = function() {
    sideCatalog.style.display = 'block';
    localStorage.removeItem('hideSideCatalog');
  };

  catalogButton.parentNode.insertBefore(sideCatalogButton,
      catalogButton.nextSibling);

  catalogButton.parentNode.insertBefore(document.createTextNode(' '),
      catalogButton.nextSibling);

  var divider = document.createElement('span');
  divider.innerHTML = '/';
  catalogButton.parentNode.insertBefore(divider, catalogButton.nextSibling);

  catalogButton.parentNode.insertBefore(document.createTextNode(' '),
      catalogButton.nextSibling);

}

function removeAllFromClass(className) {

  var elements = document.getElementsByClassName(className);

  while (elements.length) {
    elements[0].remove();
  }

}

function loadThread(thread) {

  loadingThread = true;

  localRequest(
      document.getElementById('divMod') ? '/mod.js?boardUri=' + boardUri
          + '&threadId=' + thread.threadId + '&json=1' : '/' + boardUri
          + '/res/' + thread.threadId + '.json',
      function(error, data) {

        loadingThread = false;

        if (error) {
          console.log(error);
          return;
        }

        knownPosts = {};
        window.history.pushState('', '', '/' + boardUri + '/res/'
            + thread.threadId + '.html');

        document.getElementById('threadIdentifier').value = thread.threadId;

        if (document.getElementById('divMod')) {
          document.getElementById('controlThreadIdentifier').value = thread.threadId;
          document.getElementById('transferThreadIdentifier').value = thread.threadId;
        }

        document.title = '/' + boardUri + '/ - '
            + (thread.subject || thread.message);

        var opCell = document.getElementsByClassName('opCell')[0];

        document.getElementsByClassName('divPosts')[0].innerHTML = '';

        data = JSON.parse(data);

        opCell.id = thread.threadId;
        opCell.className = 'opCell';
        if (data.files && data.files.length > 1) {
          opCell.className += ' multipleUploads';
        }

        if (!opCell.getElementsByClassName('labelSubject').length) {

          var newSubjectLabel = document.createElement('span');
          newSubjectLabel.className = 'labelSubject';

          var watchButton = document.getElementsByClassName('watchButton')[0];
          watchButton.parentNode.insertBefore(newSubjectLabel,
              watchButton.nextSibling);
          watchButton.parentNode.insertBefore(document.createTextNode(' '),
              watchButton.nextSibling);

        }

        var divMessage = document.getElementsByClassName('divMessage')[0];

        if (!opCell.getElementsByClassName('labelLastEdit').length) {

          var newBanMessageLabel = document.createElement('div');
          newBanMessageLabel.className = 'labelLastEdit';

          divMessage.parentNode.insertBefore(newBanMessageLabel,
              divMessage.nextSibling);

        }

        if (!opCell.getElementsByClassName('panelIp').length) {

          var emptyPanel = document.getElementsByClassName('opHead')[0].nextSibling.nextSibling;

          var newIpPanel = document.createElement('span');
          newIpPanel.className = 'panelIp';
          newIpPanel.appendChild(document.createTextNode(' '));

          var newIpLabel = document.createElement('span');
          newIpLabel.className = 'labelIp';
          newIpPanel.appendChild(newIpLabel);

          emptyPanel.appendChild(newIpPanel);

        }

        if (!opCell.getElementsByClassName('imgFlag').length) {

          var newFlagImage = document.createElement('img');
          newFlagImage.className = 'imgFlag';

          var linkName = document.getElementsByClassName('linkName')[0];
          linkName.parentNode.insertBefore(newFlagImage, linkName.nextSibling);
          linkName.parentNode.insertBefore(document.createTextNode(' '),
              linkName.nextSibling);

        }

        if (!opCell.getElementsByClassName('labelRole').length) {

          var newLabelRole = document.createElement('span');
          newLabelRole.className = 'labelRole';

          var flagImage = document.getElementsByClassName('imgFlag')[0];
          flagImage.parentNode
              .insertBefore(newLabelRole, flagImage.nextSibling);
          flagImage.parentNode.insertBefore(document.createTextNode(' '),
              flagImage.nextSibling);

        }

        if (!opCell.getElementsByClassName('divBanMessage').length) {

          var newBanMessageLabel = document.createElement('div');
          newBanMessageLabel.className = 'divBanMessage';

          divMessage.parentNode.insertBefore(newBanMessageLabel,
              divMessage.nextSibling);

        }

        if (!opCell.getElementsByClassName('spanId').length) {

          var newSpanId = document.createElement('span');
          newSpanId.className = 'spanId';

          var labelCreated = document.getElementsByClassName('labelCreated')[0];
          labelCreated.parentNode.insertBefore(newSpanId,
              labelCreated.nextSibling);
          labelCreated.parentNode.insertBefore(document.createTextNode(' '),
              labelCreated.nextSibling);

        }

        document.getElementsByClassName('opUploadPanel')[0].innerHTML = '';

        document.getElementsByClassName('opHead')[0]
            .getElementsByClassName('deletionCheckBox')[0].value = boardUri
            + '-' + thread.threadId;

        removeAllFromClass('extraMenuButton');
        removeAllFromClass('hideMenu');
        removeAllFromClass('quoteTooltip');
        removeAllFromClass('extraMenu');
        removeAllFromClass('hideButton');
        removeAllFromClass('watchButton');

        document.getElementsByClassName('panelBacklinks')[0].innerHTML = '';

        fullRefresh = true;

        initThread();

        setPostInnerElements(boardUri, threadId, data, opCell);

        processOP(document.getElementsByClassName('innerOP')[0]);

        if (data.posts && data.posts.length) {

          lastReplyId = data.posts[data.posts.length - 1].postId;

          for (var i = 0; i < data.posts.length; i++) {
            addPost(data.posts[i]);
          }

        }

      });

}

function addSideCatalogThread(thread) {

  var cell = document.createElement('a');

  cell.onclick = function() {

    if (loadingThread || thread.threadId === threadId) {
      return;
    }

    loadThread(thread);

  };

  if (thread.thumb) {

    var img = document.createElement('img');

    img.src = thread.thumb;

    cell.appendChild(img);
  }

  var linkContent = document.createElement('span');
  linkContent.className = 'sideCatalogCellText';
  cell.appendChild(linkContent);

  var upperText = document.createElement('span');
  var lowerText = document.createElement('span');

  linkContent.appendChild(upperText);
  linkContent.appendChild(lowerText);

  upperText.innerHTML = (thread.subject || (thread.message.replace(/[<>]/g,
      function(match) {
        return htmlReplaceTable[match];
      }).substring(0, 128) || thread.threadId));

  lowerText.innerHTML = 'R: ' + (thread.postCount || 0) + ' / F: '
      + (thread.fileCount || 0);

  sideCatalogBody.appendChild(cell);

}

function refreshSideCatalog() {

  if (refreshingSideCatalog) {
    return;
  }

  refreshingSideCatalog = true;

  localRequest('/' + boardUri + '/catalog.json', function(error, data) {

    refreshingSideCatalog = false;

    if (error) {
      return;
    }

    data = JSON.parse(data);

    sideCatalogBody.innerHTML = '';

    for (var i = 0; i < data.length; i++) {

      if (i) {
        sideCatalogBody.appendChild(document.createElement('hr'));
      }

      addSideCatalogThread(data[i]);
    }

  });

}
