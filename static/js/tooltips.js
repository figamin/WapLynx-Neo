var loadedPreviews = [];
var loadingPreviews = [];
var loadedContent = {};
var quoteReference = {};

var knownPosts = {};

if (!DISABLE_JS) {

  var posts = document.getElementsByClassName('postCell');

  for (var i = 0; i < posts.length; i++) {
    addToKnownPostsForBackLinks(posts[i])
  }

  var threads = document.getElementsByClassName('opCell');

  for (i = 0; i < threads.length; i++) {
    addToKnownPostsForBackLinks(threads[i])
  }

  var quotes = document.getElementsByClassName('quoteLink');

  for (i = 0; i < quotes.length; i++) {
    processQuote(quotes[i]);
  }
}

function addToKnownPostsForBackLinks(posting) {

  var postBoard = posting.dataset.boarduri;

  var list = knownPosts[postBoard] || {};
  knownPosts[postBoard] = list;

  list[posting.id] = {
    added : [],
    container : posting.getElementsByClassName('panelBacklinks')[0]
  };

}

function addBackLink(quoteUrl, quote) {

  var matches = quoteUrl.match(/\/(\w+)\/res\/\d+\.html\#(\d+)/);

  var board = matches[1];
  var post = matches[2];

  var knownBoard = knownPosts[board];

  if (knownBoard) {

    var knownBackLink = knownBoard[post];

    if (knownBackLink) {

      var containerPost = quote.parentNode.parentNode;

      if (containerPost.className !== 'opCell') {
        containerPost = containerPost.parentNode;
      }

      var sourceBoard = containerPost.dataset.boarduri;
      var sourcePost = containerPost.id;

      var sourceId = sourceBoard + '_' + sourcePost;

      if (knownBackLink.added.indexOf(sourceId) > -1) {
        return;
      } else {
        knownBackLink.added.push(sourceId);
      }

      var innerHTML = '>>';

      if (sourceBoard != board) {
        innerHTML += '/' + containerPost.dataset.boarduri + '/';
      }

      innerHTML += sourcePost;

      var backLink = document.createElement('a');
      backLink.innerHTML = innerHTML;

      var superContainer = containerPost.parentNode;

      var backLinkUrl = '/' + sourceBoard + '/res/';

      if (superContainer.className === 'divPosts') {

        backLinkUrl += containerPost.parentNode.parentNode.id;
        backLinkUrl += '.html#' + sourcePost;

      } else {
        backLinkUrl += sourcePost + '.html#' + sourcePost;
      }

      backLink.href = backLinkUrl;

      knownBackLink.container.appendChild(backLink);

      processQuote(backLink, true);

    }

  }

}

function setFullBorder(tooltip) {

  var innerPost = tooltip.getElementsByClassName('innerPost')[0];

  var parent = innerPost.parentNode;

  var temp = document.createElement('div');
  temp.appendChild(innerPost);

  tooltip.innerHTML = '';
  tooltip.appendChild(innerPost);

  innerPost.style['border-style'] = 'solid';
  innerPost.style['border-width'] = '1px';
  innerPost.style['border-color'] = '#117743';
}

function processQuote(quote, backLink) {

  var tooltip = document.createElement('div');
  tooltip.style.display = 'none';
  tooltip.style.position = 'absolute';

  document.body.appendChild(tooltip);

  var quoteUrl = quote.href;

  if (!backLink) {
    addBackLink(quoteUrl, quote);
  }

  if (loadedPreviews.indexOf(quoteUrl) > -1) {
    tooltip.innerHTML = loadedContent[quoteUrl];

    setFullBorder(tooltip);

  } else {
    var referenceList = quoteReference[quoteUrl] || [];

    referenceList.push(tooltip);

    quoteReference[quoteUrl] = referenceList;
    tooltip.innerHTML = 'Loading';
  }

  quote.onmouseenter = function() {
    var rect = quote.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    tooltip.style.left = previewOrigin.x + 'px';
    tooltip.style.top = previewOrigin.y + 'px';
    tooltip.style.display = 'inline';

    if (loadedPreviews.indexOf(quoteUrl) < 0
        && loadingPreviews.indexOf(quoteUrl) < 0) {
      loadQuote(tooltip, quoteUrl);
    }

  };

  quote.onmouseout = function() {
    tooltip.style.display = 'none';
  };

  if (!board) {
    var matches = quote.href.match(/\#(\d+)/);

    quote.onclick = function() {
      markPost(matches[1]);
    };
  }

}

function loadQuote(tooltip, quoteUrl) {

  var matches = quoteUrl.match(/\/(\w+)\/res\/\d+\.html\#(\d+)/);

  var board = matches[1];
  var post = matches[2];

  var previewUrl = '/' + board + '/preview/' + post + '.html';

  localRequest(previewUrl, function receivedData(error, data) {
    if (error) {
      loadingPreviews.splice(loadingPreviews.indexOf(quoteUrl), 1);
    } else {

      var referenceList = quoteReference[quoteUrl];

      for (var i = 0; i < referenceList.length; i++) {
        referenceList[i].innerHTML = data;

        setFullBorder(referenceList[i]);
      }

      loadedContent[quoteUrl] = data;
      loadedPreviews.push(quoteUrl);
      loadingPreviews.splice(loadingPreviews.indexOf(quoteUrl), 1);
    }
  });

  loadingPreviews.push(quoteUrl);

}