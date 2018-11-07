if (!DISABLE_JS) {

  var storedHidingData = localStorage.hidingData;

  if (storedHidingData) {
    storedHidingData = JSON.parse(storedHidingData);
  } else {
    storedHidingData = {};
  }

  htmlReplaceTable = {
    '<' : '&lt;',
    '>' : '&gt;'
  };

  var waitingForRefreshData;
  var selectedThreadCell;
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

function removeIndicator(className) {

  var elements = document.getElementsByClassName(className);

  if (!elements.length) {
    return;
  }

  elements[0].nextSibling.remove();
  elements[0].remove();

}

function addIndicator(className, title) {

  var spanId = document.getElementsByClassName('spanId')[0];

  var indicator = document.createElement('span');
  indicator.className = className;
  indicator.title = title;

  spanId.parentNode.insertBefore(indicator, spanId.nextSibling);
  spanId.parentNode.insertBefore(document.createTextNode(' '),
      spanId.nextSibling);

}

function loadThread(cell, thread) {

  loadingThread = true;

  localRequest(
      document.getElementById('divMod') ? '/mod.js?boardUri=' + boardUri
          + '&threadId=' + thread.threadId + '&json=1' : '/' + boardUri
          + '/res/' + thread.threadId + '.json',
      function(error, data) {

        loadingThread = false;

        if (autoRefresh) {
          currentRefresh = 5;
        }

        if (error) {
          return;
        }

        if (selectedThreadCell) {
          selectedThreadCell.className = 'sideCatalogCell';
        }

        selectedThreadCell = cell;

        selectedThreadCell.className = 'sideCatalogMarkedCell';

        knownPosts = {};
        window.history.pushState('', '',
            document.getElementById('divMod') ? '/mod.js?boardUri=' + boardUri
                + '&threadId=' + thread.threadId : '/' + boardUri + '/res/'
                + thread.threadId + '.html');

        document.getElementById('threadIdentifier').value = thread.threadId;

        if (document.getElementById('divMod')) {
          document.getElementById('controlThreadIdentifier').value = thread.threadId;
          document.getElementById('transferThreadIdentifier').value = thread.threadId;

          document.getElementById('checkboxLock').checked = thread.locked;
          document.getElementById('checkboxPin').checked = thread.pinned;
          document.getElementById('checkboxCyclic').checked = thread.cyclic;

        }

        document.title = '/' + boardUri + '/ - '
            + (thread.subject || thread.message);

        var opCell = document.getElementsByClassName('opCell')[0];

        opCell.scrollIntoView();

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

          var rangePanel = document.createElement('span');
          rangePanel.className = 'panelRange';
          rangePanel.innerHTML = 'Broad range(1/2 octets): '

          var broadRangeLabel = document.createElement('span');
          broadRangeLabel.className = 'labelBroadRange';

          rangePanel.appendChild(broadRangeLabel);

          rangePanel.appendChild(document.createElement('br'));

          rangePanel.appendChild(document
              .createTextNode('Narrow range(3/4 octets):'));

          var narrowRangeLabel = document.createElement('span');
          narrowRangeLabel.className = 'labelNarrowRange';

          rangePanel.appendChild(narrowRangeLabel);

          rangePanel.appendChild(document.createElement('br'));

          newIpPanel.appendChild(rangePanel);

          newIpPanel.appendChild(document.createTextNode('Ip:'));

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

          newSpanId.innerHTML = 'Id:';

          var newLabelId = document.createElement('span');
          newLabelId.className = 'labelId';
          newSpanId.appendChild(newLabelId);

          var labelCreated = document.getElementsByClassName('labelCreated')[0];
          labelCreated.parentNode.insertBefore(newSpanId,
              labelCreated.nextSibling);
          labelCreated.parentNode.insertBefore(document.createTextNode(' '),
              labelCreated.nextSibling);

        }

        if (!opCell.getElementsByClassName('opUploadPanel').length) {

          var newOpUploadPanel = document.createElement('div');
          newOpUploadPanel.className = 'panelUploads opUploadPanel';

          var innerOP = opCell.getElementsByClassName('innerOP')[0];

          innerOP.insertBefore(newOpUploadPanel, innerOP.children[0]);

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
        removeAllFromClass('relativeTime');

        removeIndicator('lockIndicator');
        removeIndicator('pinIndicator');
        removeIndicator('cyclicIndicator');

        addIndicator('cyclicIndicator', 'Cyclical Thread');
        addIndicator('pinIndicator', 'Sticky');
        addIndicator('lockIndicator', 'Locked');

        if (!thread.locked) {
          removeIndicator('lockIndicator');
        }

        if (!thread.pinned) {
          removeIndicator('pinIndicator');
        }

        if (!thread.cyclic) {
          removeIndicator('cyclicIndicator');
        }

        document.getElementsByClassName('panelBacklinks')[0].innerHTML = '';

        fullRefresh = true;

        initThread();

        galleryFiles = [];
        currentIndex = 0;

        setPostInnerElements(boardUri, threadId, data, opCell);

        processOP(document.getElementsByClassName('innerOP')[0]);

        if (data.posts && data.posts.length) {

          lastReplyId = data.posts[data.posts.length - 1].postId;

          for (var i = 0; i < data.posts.length; i++) {
            divPosts.appendChild(addPost(data.posts[i], boardUri, threadId));
          }

        }

      });

}

function addSideCatalogThread(thread) {

  var cell = document.createElement('a');

  cell.onclick = function() {

    if (loadingThread || thread.threadId === threadId || waitingForRefreshData) {
      return;
    } else if (refreshingThread) {
      waitingForRefreshData = {
        cell : cell,
        thread : thread
      };

      return;
    }

    loadThread(cell, thread);

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

  if (threadId === thread.threadId) {
    cell.className = 'sideCatalogMarkedCell';
    cell.scrollIntoView();
    selectedThreadCell = cell;
  } else {
    cell.className = 'sideCatalogCell';
  }

}

function processCatalogData(data) {

  sideCatalogBody.innerHTML = '';

  var boardData = storedHidingData[boardUri];

  for (var i = 0; i < data.length; i++) {

    var thread = data[i];

    if ((boardData && boardData.threads.indexOf(thread.threadId.toString()) > -1)) {
      continue;
    }

    addSideCatalogThread(thread);
  }

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

    processCatalogData(JSON.parse(data));

  });

}
