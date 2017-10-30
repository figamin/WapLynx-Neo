var galleryFiles = [];
var currentIndex = 0;
var viewingGallery = false;
var galleryImage;
var previousImage;
var nextImage;

if (!DISABLE_JS) {

  var imageLinks = document.getElementsByClassName('imgLink');

  for (var i = 0; i < imageLinks.length; i++) {

    var link = imageLinks[i];

    if (link.dataset.filemime && link.dataset.filemime.indexOf('image/') > -1) {
      addGalleryFile(link.href);
    }
  }

  var backLink = document.getElementById('linkBack');

  var galleryLink = document.createElement('a');
  galleryLink.title = 'Gallery mode.\nLeft/right arrow: previous/next\nUp/down arrow: skip 10 previous/next\nEsc: exit\nDelete: remove from gallery';
  galleryLink.id = 'galleryLink';
  galleryLink.setAttribute('class', 'coloredIcon');
  backLink.parentNode.insertBefore(galleryLink, backLink);

  backLink.parentNode.insertBefore(document.createTextNode(' '), backLink);

  var separator = document.createElement('span');
  separator.innerHTML = '/';
  backLink.parentNode.insertBefore(separator, backLink);

  backLink.parentNode.insertBefore(document.createTextNode(' '), backLink);

  var outerPanel;

  galleryLink.onclick = function() {

    if (!galleryFiles.length) {
      alert('No images to see');
      return;
    }

    outerPanel = document.createElement('div');
    outerPanel.setAttribute('class', 'modalPanel');
    document.body.appendChild(outerPanel);

    var innerPanel = document.createElement('div');
    innerPanel.setAttribute('class', 'modalInnerPanel');
    outerPanel.appendChild(innerPanel);

    galleryImage = document.createElement('img');
    galleryImage.setAttribute('class', 'galleryImage');
    innerPanel.appendChild(galleryImage);

    previousImage = document.createElement('img');
    previousImage.style.display = 'none';
    nextImage = document.createElement('img');
    nextImage.style.display = 'none';

    innerPanel.appendChild(nextImage);
    innerPanel.appendChild(previousImage);

    displayImage(currentIndex);

    viewingGallery = true;

  }

  document.body.addEventListener('keydown', function clicked(event) {

    if (!viewingGallery) {
      return;
    }

    switch (event.key) {

    case 'Escape': {
      outerPanel.remove();
      viewingGallery = false;
      event.preventDefault();

      break;
    }

    case 'ArrowDown': {
      displayImage(currentIndex + 10);
      event.preventDefault();
      break;
    }

    case 'ArrowUp': {
      displayImage(currentIndex - 10);
      event.preventDefault();
      break;
    }

    case 'ArrowLeft': {
      displayImage(currentIndex - 1);
      event.preventDefault();
      break;
    }

    case 'ArrowRight': {
      displayImage(currentIndex + 1);
      event.preventDefault();
      break;
    }

    case 'Delete': {
      galleryFiles.splice(currentIndex, 1);

      if (!galleryFiles.length) {
        outerPanel.remove();
        return;
      } else {
        displayImage(currentIndex);
      }
      event.preventDefault();

      break;
    }

    }

  });

}

function displayImage(index) {

  if (index < 0) {
    index = 0;
  } else if (index >= galleryFiles.length) {
    index = galleryFiles.length - 1;
  }

  currentIndex = index;

  galleryImage.src = galleryFiles[index];

  if (index > 0) {
    previousImage.src = galleryFiles[index - 1];
  }

  if (index < galleryFiles.length - 1) {
    nextImage.src = galleryFiles[index + 1];
  }

}

function addGalleryFile(url) {

  if (galleryFiles.indexOf(url) === -1) {
    galleryFiles.push(url);
  }

}