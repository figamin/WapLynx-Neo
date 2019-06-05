var latestPostings = {};

latestPostings.init = function() {

  latestPostings.unread = 0;
  latestPostings.originalTitle = document.title;

  latestPostings.postsDiv = document.getElementById('divPostings');

  var parts = document.getElementById('linkNext').href.split('?')[1].split('&');

  var args = {};

  for (var i = 0; i < parts.length; i++) {
    var subParts = parts[i].split('=');

    args[subParts[0]] = subParts[1];
  }

  latestPostings.latestCheck = new Date(+args.date);
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

      if (document.hidden) {
        latestPostings.unread += data.length;

        if (!latestPostings.unread) {
          return;
        }

        document.title = latestPostings.originalTitle + '('
            + latestPostings.unread + ')';
      }

      if (data.length) {
        latestPostings.latestCheck = new Date(data[0].creation);
      }

      for (var i = data.length - 1; i >= 0; i--) {

        var post = data[i];

        var cell = posting.addPost(post, post.boardUri, post.threadId);

        cell.getElementsByClassName('deletionCheckBox')[0].remove();

        latestPostings.postsDiv.insertBefore(cell,
            latestPostings.postsDiv.childNodes[0]);

      }

    }, true, {
      date : latestPostings.latestCheck.getTime(),
      boards : document.getElementById('fieldBoards').value
    });

  }, 1000 * 60);

};

latestPostings.init();