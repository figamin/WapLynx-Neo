var latestCheck;
var postsDiv;
var unread = 0;
var originalTitle = document.title;

if (!DISABLE_JS) {

  postsDiv = document.getElementById('divPostings');
  latestCheck = new Date();
  startTimer();

  document.addEventListener('visibilitychange', function changed() {

    if (unread && !document.hidden) {
      unread = 0;
      document.title = originalTitle;
    }

  }, false);

}

function startTimer() {

  setTimeout(function refresh() {

    var currentCheck = new Date();

    localRequest('/latestPostings.js?json=1&date=' + latestCheck.toUTCString()
        + '&boards=' + document.getElementById('fieldBoards').value,
        function gotData(error, data) {

          latestCheck = currentCheck;

          startTimer();

          if (!data) {
            return;
          }

          data = JSON.parse(data);

          if (document.hidden) {
            unread += data.length;

            if (!unread) {
              return;
            }

            document.title = originalTitle + '(' + unread + ')';
          }

          for (var i = 0; i < data.length; i++) {

            var post = data[i];

            var cell = addPost(post, post.boardUri, post.threadId, true);

            cell.getElementsByClassName('deletionCheckBox')[0].remove();

            postsDiv.insertBefore(cell, postsDiv.childNodes[0]);

          }

        });

  }, 1000 * 60);

}