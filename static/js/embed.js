var embedHTML = '<iframe width="400" height="305" src="https://www.youtube.com/embed/{$id}" frameborder="0" allowfullscreen></iframe>';

if (!DISABLE_JS) {

  var messages = document.getElementsByClassName('divMessage');

  for (var i = 0; i < messages.length; i++) {

    var links = messages[i].getElementsByTagName('a');

    for (var j = 0; j < links.length; j++) {
      processLinkForEmbed(links[j]);
    }

  }
}

function processLinkForEmbed(link) {

  if (link.href.indexOf('youtube.com/watch') < 0
      && link.href.indexOf('youtu.be/') < 0) {
    return;
  }

  var videoId = link.href.split('v=')[1] || link.href.split('/')[3];

  if (!videoId) {
    return;
  }

  var ampersandPosition = videoId.indexOf('&');
  videoId = videoId.substring(0, ampersandPosition < 0 ? videoId.length
      : ampersandPosition);

  link.style.display = 'inline';

  var finalHTML = embedHTML.replace('{$id}', videoId);

  var embedWrapper = document.createElement('div');
  embedWrapper.style.display = 'inline';

  var div = document.createElement('div');
  div.style.display = 'none';

  var embedButton = document.createElement('span');

  embedButton.innerHTML = '[Embed]';
  embedButton.setAttribute('class', 'embedButton');

  embedButton.onclick = function() {

    var hidden = div.style.display === 'none';

    div.style.display = hidden ? 'block' : 'none';

    embedButton.innerHTML = hidden ? '[Remove]' : '[Embed]';

    div.innerHTML = hidden ? finalHTML : null;

  };

  embedWrapper.appendChild(embedButton);
  embedWrapper.appendChild(div);
  link.parentNode.insertBefore(embedWrapper, link.nextSibling);

}
