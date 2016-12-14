if (!DISABLE_JS) {

  var autoRefresh;
  var searchDelay = 1000;
  var refreshTimer;
  var limitRefreshWait = 10 * 60;
  var loadingData = false;
  var catalogThreads;
  var lastRefresh;
  var currentRefresh;
  var refreshingButton = document.getElementById('catalogRefreshButton');
  var catalogDiv = document.getElementById('divThreads');

  var indicatorsRelation = {
    pinned : 'pinIndicator',
    locked : 'lockIndicator',
    cyclic : 'cyclicIndicator',
    autoSage : 'bumpLockIndicator'
  };

  var refreshCheckBox = document.getElementById('autoCatalogRefreshCheckBox');
  var refreshLabel = document.getElementById('catalogRefreshLabel');
  var originalAutoRefreshText = refreshLabel.innerHTML;
  var searchField = document.getElementById('catalogSearchField');

  var catalogCellTemplate = '<a class="linkThumb"></a>';
  catalogCellTemplate += '<p class="threadStats">R: ';
  catalogCellTemplate += '<span class="labelReplies"></span> / I: ';
  catalogCellTemplate += '<span class="labelImages"></span> / P: ';
  catalogCellTemplate += '<span class="labelPage"></span>';
  catalogCellTemplate += '<span class="lockIndicator" title="Locked"></span>';
  catalogCellTemplate += '<span class="pinIndicator" title="Sticky"></span>';
  catalogCellTemplate += '<span class="cyclicIndicator" title="Cyclical Thread"></span>';
  catalogCellTemplate += '<span class="bumpLockIndicator" title="Bumplocked"></span>';
  catalogCellTemplate += '</p><p><span class="labelSubject"></span></p>';
  catalogCellTemplate += '<div class="divMessage"></div>';

  var searchTimer;

  var storedHidingData = localStorage.hidingData;

  if (storedHidingData) {
    storedHidingData = JSON.parse(storedHidingData);
  } else {
    storedHidingData = {};
  }

  initCatalog();
}

function startTimer(time) {

  if (time > limitRefreshWait) {
    time = limitRefreshWait;
  }

  currentRefresh = time;
  lastRefresh = time;
  refreshLabel.innerHTML = originalAutoRefreshText + ' ' + currentRefresh;
  refreshTimer = setInterval(function checkTimer() {
    currentRefresh--;

    if (!currentRefresh) {
      clearInterval(refreshTimer);
      refreshCatalog();
      refreshLabel.innerHTML = originalAutoRefreshText;
    } else {
      refreshLabel.innerHTML = originalAutoRefreshText + ' ' + currentRefresh;
    }

  }, 1000);
}

function changeCatalogRefresh() {

  autoRefresh = refreshCheckBox.checked;

  if (!autoRefresh) {
    refreshLabel.innerHTML = originalAutoRefreshText;
    clearInterval(refreshTimer);
  } else {
    startTimer(5);
  }

}

function getHiddenMedia() {

  var hiddenMedia = localStorage.hiddenMedia;

  if (hiddenMedia) {
    hiddenMedia = JSON.parse(hiddenMedia);
  } else {
    hiddenMedia = [];
  }

  return hiddenMedia;

}

function refreshCatalog(manual) {

  if (autoRefresh) {
    clearInterval(refreshTimer);
  }

  var currentData = JSON.stringify(catalogThreads);

  getCatalogData(function refreshed(error) {

    if (error) {
      return;
    }

    var changed = currentData != JSON.stringify(catalogThreads);

    if (autoRefresh) {
      startTimer(manual || changed ? 5 : lastRefresh * 2);
    }

    search();

  });

}

function initCatalog() {

  changeCatalogRefresh();

  var boardUri = window.location.toString().match(/\/(\w+)\/catalog.html/)[1];

  document.getElementById('divTools').style.display = 'inline-block';

  searchField.addEventListener('input', function() {

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(function() {
      searchTime = null;
      search();
    }, searchDelay);

  });

  var postingForm = document.getElementById('newPostFieldset');

  if (postingForm) {

    var toggleLink = document.getElementById('togglePosting');
    toggleLink.style.display = 'inline-block';
    postingForm.style.display = 'none';

    toggleLink.onclick = function() {
      toggleLink.style.display = 'none';
      postingForm.style.display = 'inline-block';
    };
  }

  var links = document.getElementsByClassName('linkThumb');

  for (var i = 0; i < links.length; i++) {

    var link = links[i];

    var child = link.childNodes[0];

    var matches = link.href.match(/(\w+)\/res\/(\d+)/);

    var board = matches[1];
    var thread = matches[2];

    var boardData = storedHidingData[board];

    if (boardData && boardData.threads.indexOf(thread) > -1) {
      var cell = link.parentNode;

      cell.parentNode.removeChild(cell);
    } else if (child.tagName === 'IMG') {
      checkForFileHiding(child);
    }

  }

  getCatalogData();

}

function checkForFileHiding(child) {

  var srcParts = child.src.split('/');

  var hiddenMedia = getHiddenMedia();

  var finalPart = srcParts[srcParts.length - 1].substr(2);

  for (var j = 0; j < hiddenMedia.length; j++) {

    if (hiddenMedia[j].indexOf(finalPart) > -1) {
      child.parentNode.innerHTML = 'Open';
      break;
    }

  }
}

function removeElement(element) {
  element.parentNode.removeChild(element);
}

function setCellThumb(thumbLink, thread) {
  thumbLink.href = '/' + boardUri + '/res/' + thread.threadId + '.html';

  if (thread.thumb) {
    var thumbImage = document.createElement('img');

    thumbImage.src = thread.thumb;
    thumbLink.appendChild(thumbImage);
    checkForFileHiding(thumbImage);
  } else {
    thumbLink.innerHTML = 'Open';
  }
}

function setCatalogCellIndicators(thread, cell) {

  for ( var key in indicatorsRelation) {
    if (!thread[key]) {
      removeElement(cell.getElementsByClassName(indicatorsRelation[key])[0]);
    }
  }

}

function setCell(thread) {

  var cell = document.createElement('div');

  cell.innerHTML = catalogCellTemplate;
  cell.setAttribute('class', 'catalogCell');

  setCellThumb(cell.getElementsByClassName('linkThumb')[0], thread);

  var labelReplies = cell.getElementsByClassName('labelReplies')[0];
  labelReplies.innerHTML = thread.postCount || 0;

  var labelImages = cell.getElementsByClassName('labelImages')[0];
  labelImages.innerHTML = thread.fileCount || 0;
  cell.getElementsByClassName('labelPage')[0].innerHTML = thread.page;

  if (thread.subject) {
    cell.getElementsByClassName('labelSubject')[0].innerHTML = thread.subject;
  }

  setCatalogCellIndicators(thread, cell);

  cell.getElementsByClassName('divMessage')[0].innerHTML = thread.message;

  return cell;

}

function search() {

  if (!catalogThreads) {
    return;
  }

  var term = searchField.value.toLowerCase();

  while (catalogDiv.firstChild) {
    catalogDiv.removeChild(catalogDiv.firstChild);
  }

  var boardData = storedHidingData[boardUri];

  for (var i = 0; i < catalogThreads.length; i++) {

    var thread = catalogThreads[i];

    if ((boardData && boardData.threads.indexOf(thread.threadId.toString()) > -1)
        || (term.length && thread.message.toLowerCase().indexOf(term) < 0 && (thread.subject || '')
            .toLowerCase().indexOf(term) < 0)) {
      continue;
    }

    catalogDiv.appendChild(setCell(thread));

  }

}

function getCatalogData(callback) {

  if (loadingData) {
    return;
  }

  loadingData = true;

  localRequest('/' + boardUri + '/catalog.json', function gotBoardData(error,
      data) {

    loadingData = false;

    if (error) {
      if (callback) {
        callback(error);
      } else {
        console.log(error);
      }
      return;
    }

    catalogThreads = JSON.parse(data);
    if (callback) {
      callback();
    }

  });

}