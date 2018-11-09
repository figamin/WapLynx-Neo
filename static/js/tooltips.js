var tooltips = {};

tooltips.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  tooltips.loadedPreviews = [];
  tooltips.loadingPreviews = [];
  tooltips.loadedContent = {};
  tooltips.quoteReference = {};
  tooltips.knownPosts = {};

  var posts = document.getElementsByClassName('postCell');

  for (var i = 0; i < posts.length; i++) {
    tooltips.addToKnownPostsForBackLinks(posts[i])
  }

  var threads = document.getElementsByClassName('opCell');

  for (i = 0; i < threads.length; i++) {
    tooltips.addToKnownPostsForBackLinks(threads[i])
  }

  var quotes = document.getElementsByClassName('quoteLink');

  for (i = 0; i < quotes.length; i++) {
    tooltips.processQuote(quotes[i]);
  }

};

tooltips.addToKnownPostsForBackLinks = function(posting) {

  var postBoard = posting.dataset.boarduri;

  var list = tooltips.knownPosts[postBoard] || {};
  tooltips.knownPosts[postBoard] = list;

  list[posting.id] = {
    added : [],
    container : posting.getElementsByClassName('panelBacklinks')[0]
  };

};

tooltips.addBackLink = function(quoteUrl, quote) {

  var matches = quoteUrl.match(/\/(\w+)\/res\/(\d+)\.html\#(\d+)/);

  var board = matches[1];
  var thread = matches[2];
  var post = matches[3];

  var knownBoard = tooltips.knownPosts[board];

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

      tooltips.processQuote(backLink, true);

    }

  }

};

tooltips.processQuote = function(quote, backLink) {

  var tooltip = document.createElement('div');
  tooltip.className = 'quoteTooltip';

  document.body.appendChild(tooltip);

  var quoteUrl = quote.href;

  if (!backLink) {
    tooltips.addBackLink(quoteUrl, quote);
  }

  if (tooltips.loadedPreviews.indexOf(quoteUrl) > -1) {
    tooltip.innerHTML = tooltips.loadedContent[quoteUrl];
  } else {
    var referenceList = tooltips.quoteReference[quoteUrl] || [];

    referenceList.push(tooltip);

    tooltips.quoteReference[quoteUrl] = referenceList;
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

    if (tooltips.loadedPreviews.indexOf(quoteUrl) < 0
        && tooltips.loadingPreviews.indexOf(quoteUrl) < 0) {
      tooltips.loadQuote(tooltip, quoteUrl);
    }

  };

  quote.onmouseout = function() {
    tooltip.style.display = 'none';
  };

  if (!api.isBoard) {
    var matches = quote.href.match(/\#(\d+)/);

    quote.onclick = function() {
      markPost(matches[1]);
    };
  }

};

tooltips.loadQuote = function(tooltip, quoteUrl) {

  var matches = quoteUrl.match(/\/(\w+)\/res\/(\d+)\.html\#(\d+)/);

  var board = matches[1];
  var thread = +matches[2];
  var post = +matches[3];

  var threadUrl = '/' + board + '/res/' + thread + '.json';

  tooltips.loadingPreviews.push(quoteUrl);

  api.localRequest(threadUrl, function receivedData(error, data) {

    tooltips.loadingPreviews.splice(tooltips.loadingPreviews.indexOf(quoteUrl),
        1);

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

    var tempDiv = posting.addPost(postingData, board, thread, true)
        .getElementsByClassName('innerPost')[0];

    tempDiv.getElementsByClassName('deletionCheckBox')[0].remove();

    var finalHTML = tempDiv.outerHTML;

    var referenceList = tooltips.quoteReference[quoteUrl];

    for (i = 0; i < referenceList.length; i++) {
      referenceList[i].innerHTML = finalHTML;
    }

    tooltips.loadedContent[quoteUrl] = finalHTML;
    tooltips.loadedPreviews.push(quoteUrl);

  });

};

tooltips.init();