var latestPostings = {};

latestPostings.init = function() {

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

    api.formApiRequest('latestPostings', {}, function gotData(status, data) {

      latestPostings.startTimer();

      if (status !== 'ok') {
        return;
      }

      latestPostings.latestCheck = currentCheck;

      if (document.hidden) {
        latestPostings.unread += data.length;

        if (!latestPostings.unread) {
          return;
        }

        document.title = latestPostings.originalTitle + '('
            + latestPostings.unread + ')';
      }

      for (var i = data.length - 1; i >= 0; i--) {

        var post = data[i];

        var cell = posting.addPost(post, post.boardUri, post.threadId);

        cell.getElementsByClassName('deletionCheckBox')[0].remove();

        latestPostings.postsDiv.insertBefore(cell,
            latestPostings.postsDiv.childNodes[0]);

      }

    }, true, {
      date : latestPostings.latestCheck,
      boards : document.getElementById('fieldBoards').value
    });

  }, 1000 * 60);

};

latestPostings.init();