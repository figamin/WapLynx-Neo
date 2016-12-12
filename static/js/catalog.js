if (!DISABLE_JS) {

  var indicatorsRelation = {
    pinned : 'pinIndicator',
    locked : 'lockIndicator',
    cyclic : 'cyclicIndicator',
    autoSage : 'bumpLockIndicator'
  };

  var catalogCellTemplate = '<a class="linkThumb"></a>';
  catalogCellTemplate += '<p class="threadStats">R:';
  catalogCellTemplate += '<span class="labelReplies"></span>';
  catalogCellTemplate += '/ I:';
  catalogCellTemplate += '<span class="labelImages"></span>';
  catalogCellTemplate += '/ P:';
  catalogCellTemplate += '<span class="labelPage"></span>';
  catalogCellTemplate += '<span class="lockIndicator" title="Locked"></span>';
  catalogCellTemplate += '<span class="pinIndicator" title="Sticky"></span>';
  catalogCellTemplate += '<span class="cyclicIndicator" title="Cyclical Thread"></span>';
  catalogCellTemplate += '<span class="bumpLockIndicator" title="Bumplocked"></span>';
  catalogCellTemplate += '</p>';
  catalogCellTemplate += '<p><span class="labelSubject"></span></p>';
  catalogCellTemplate += '<div class="divMessage"></div>';

  var catalogDiv = document.getElementById('divThreads');
  var loadingData = false;
  var searchTimer;
  var catalogThreads;

  var boardUri = window.location.toString().match(/\/(\w+)\/catalog.html/)[1];

  document.getElementById('divTools').style.display = 'inline-block';

  var searchField = document.getElementById('catalogSearchField');

  searchField.addEventListener('input', function() {

    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    searchTimer = setTimeout(function() {
      search(searchField.value);
    }, 1000);

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

  var storedHidingData = localStorage.hidingData;

  if (storedHidingData) {
    storedHidingData = JSON.parse(storedHidingData);
  } else {
    storedHidingData = {};
  }

  for (var i = 0; i < links.length; i++) {

    var link = links[i];

    var matches = link.href.match(/(\w+)\/res\/(\d+)/);

    var board = matches[1];
    var thread = matches[2];

    var boardData = storedHidingData[board];

    if (boardData && boardData.threads.indexOf(thread) > -1) {
      var cell = link.parentNode;

      cell.parentNode.removeChild(cell);
    }

  }

  getCatalogData();

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

function search(term) {

  if (!catalogThreads) {
    return;
  }

  term = term.toLowerCase();

  while (catalogDiv.firstChild) {
    catalogDiv.removeChild(catalogDiv.firstChild);
  }

  for (var i = 0; i < catalogThreads.length; i++) {

    var thread = catalogThreads[i];

    if (term.length && thread.message.toLowerCase().indexOf(term) < 0
        && (thread.subject || '').toLowerCase().indexOf(term) < 0) {
      continue;
    }

    catalogDiv.appendChild(setCell(thread));

  }

}

function getCatalogData() {

  if (loadingData) {
    return;
  }

  loadingData = true;

  localRequest('/' + boardUri + '/catalog.json', function gotBoardData(error,
      data) {

    loadingData = false;

    if (error) {
      console.log(error);
      return;
    }

    catalogThreads = JSON.parse(data);

  });

}