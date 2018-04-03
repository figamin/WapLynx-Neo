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

  var matches = quoteUrl.match(/\/(\w+)\/res\/(\d+)\.html\#(\d+)/);

  var board = matches[1];
  var thread = matches[2];
  var post = matches[3];

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

      var backLinkUrl = '/' + sourceBoard + '/res/' + thread + '.html#'
          + sourcePost;

      backLink.href = backLinkUrl;

      knownBackLink.container.appendChild(backLink);

      processQuote(backLink, true);

    }

  }

}

function processQuote(quote, backLink) {

  var tooltip = document.createElement('div');
  tooltip.className = 'quoteTooltip';

  document.body.appendChild(tooltip);

  var quoteUrl = quote.href;

  if (!backLink) {
    addBackLink(quoteUrl, quote);
  }

  if (loadedPreviews.indexOf(quoteUrl) > -1) {
    tooltip.innerHTML = loadedContent[quoteUrl];
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

  var matches = quoteUrl.match(/\/(\w+)\/res\/(\d+)\.html\#(\d+)/);

  var board = matches[1];
  var thread = +matches[2];
  var post = +matches[3];

  var threadUrl = '/' + board + '/res/' + thread + '.json';

  loadingPreviews.push(quoteUrl);

  localRequest(threadUrl, function receivedData(error, data) {

    loadingPreviews.splice(loadingPreviews.indexOf(quoteUrl), 1);

    if (error) {
      return;
    }

    var threadData = JSON.parse(data);

    var postingData;

    if (thread === post) {
      threadData.postId = post;
      postingData = threadData;
    } else {
      for (var i = 0; i < threadData.posts.length; i++) {

        var postData = threadData.posts[i];
        if (postData.postId === post) {
          postingData = postData;
          break;
        }

      }
    }

    if (!postingData) {
      return;
    }

    var tempDiv = addPost(postingData, board, thread, true)
        .getElementsByClassName('innerPost')[0];

    tempDiv.getElementsByClassName('deletionCheckBox')[0].remove();

    var finalHTML = tempDiv.outerHTML;

    var referenceList = quoteReference[quoteUrl];

    for (i = 0; i < referenceList.length; i++) {
      referenceList[i].innerHTML = finalHTML;
    }

    loadedContent[quoteUrl] = finalHTML;
    loadedPreviews.push(quoteUrl);

  });

}