var latestPostings = {};

latestPostings.init = function() {

  if (typeof (DISABLE_JS) !== 'undefined' && DISABLE_JS) {
    return;
  }

  latestPostings.unread = 0;
  latestPostings.originalTitle = document.title;

  latestPostings.postsDiv = document.getElementById('divPostings');
  latestPostings.latestCheck = new Date();
  latestPostings.startTimer();

  document.addEventListener('visibilitychange', function changed() {

    if (latestPostings.unread && !document.hidden) {
      latestPostings.unread = 0;
      document.title = latestPostings.originalTitle;
    }

  }, false);

};

latestPostings.startTimer = function() {

  setTimeout(function refresh() {

    var currentCheck = new Date();

    api.localRequest('/latestPostings.js?json=1&date='
        + latestPostings.latestCheck.toUTCString() + '&boards='
        + document.getElementById('fieldBoards').value, function gotData(error,
        data) {

      latestPostings.latestCheck = currentCheck;
      latestPostings.startTimer();

      if (!data) {
        return;
      }

      data = JSON.parse(data);

      if (document.hidden) {
        latestPostings.unread += data.length;

        if (!latestPostings.unread) {
          return;
        }

        document.title = latestPostings.originalTitle + '('
            + latestPostings.unread + ')';
      }

      for (var i = 0; i < data.length; i++) {

        var post = data[i];

        var cell = posting.addPost(post, post.boardUri, post.threadId, true);

        cell.getElementsByClassName('deletionCheckBox')[0].remove();

        latestPostings.postsDiv.insertBefore(cell,
            latestPostings.postsDiv.childNodes[0]);

      }

    });

  }, 1000 * 60);

};

latestPostings.init();