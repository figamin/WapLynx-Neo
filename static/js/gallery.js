var gallery = {};

gallery.init = function() {

  gallery.galleryFiles = [];
  gallery.currentIndex = 0;

  var imageLinks = document.getElementsByClassName('imgLink');

  for (var i = 0; i < imageLinks.length; i++) {

    var link = imageLinks[i];

    if (link.dataset.filemime && link.dataset.filemime.indexOf('image/') > -1) {
      gallery.addGalleryFile(link.href);
    }
  }

  var backLink = document.getElementById('quickReplyIcon');
  
  var galleryLink = document.createElement('a');
  galleryLink.title = 'Gallery';
  galleryLink.id = 'galleryLink';
  galleryLink.className = 'fa-regular fa-image';
  backLink.parentNode.insertBefore(galleryLink, backLink);

  backLink.parentNode.insertBefore(document.createTextNode(' '), backLink);

  var outerPanel;
  
  galleryLink.onclick = function() {

    if (!gallery.galleryFiles.length) {
      alert('No images to see');
      return;
    }

    outerPanel = document.createElement('div');
    outerPanel.className = 'modalPanel';
    document.body.appendChild(outerPanel);

    var innerPanel = document.createElement('div');
    innerPanel.className = 'modalInnerPanel';
    outerPanel.appendChild(innerPanel);
    
    gallery.galleryImage = document.createElement('img');
    gallery.galleryImage.className = 'galleryImage';
    innerPanel.appendChild(gallery.galleryImage);
    gallery.descBox = document.createElement('div');
    var desc = document.createElement('p')
    desc.innerHTML = 'Gallery mode<br>Left/right arrow: previous/next<br>Up/down arrow: skip 10 previous/next<br>Home/End: first/last<br>Esc: exit<br>Delete: remove from gallery';
    desc.className = 'galleryText';
    gallery.descBox.appendChild(desc);
    innerPanel.appendChild(gallery.descBox);
    gallery.leave = document.createElement('button');
    gallery.leave.innerText = "Exit";
    gallery.leave.className = 'galleryText';
    gallery.leave.onclick = function() {
      console.log("QUIT!");
      outerPanel.remove();
      gallery.viewingGallery = false;
      event.preventDefault();
    };
    innerPanel.appendChild(gallery.leave);
    gallery.previousImage = document.createElement('img');
    gallery.previousImage.style.display = 'none';
    gallery.nextImage = document.createElement('img');
    gallery.nextImage.style.display = 'none';

    innerPanel.appendChild(gallery.nextImage);
    innerPanel.appendChild(gallery.previousImage);

    gallery.displayImage(gallery.currentIndex);

    gallery.viewingGallery = true;

  }
  
  document.body.addEventListener('keydown', function clicked(event) {

    if (!gallery.viewingGallery) {
      return;
    }

    switch (event.key) {

    case 'Escape': {
      console.log("QUIT!");
      outerPanel.remove();
      gallery.viewingGallery = false;
      event.preventDefault();
      break;
    }

    case 'Home': {
      gallery.displayImage(0);
      event.preventDefault();
      break;
    }

    case 'End': {
      gallery.displayImage(gallery.galleryFiles.length - 1);
      event.preventDefault();
      break;
    }

    case 'ArrowDown': {
      gallery.displayImage(gallery.currentIndex + 10);
      event.preventDefault();
      break;
    }

    case 'ArrowUp': {
      gallery.displayImage(gallery.currentIndex - 10);
      event.preventDefault();
      break;
    }

    case 'ArrowLeft': {
      gallery.displayImage(gallery.currentIndex - 1);
      event.preventDefault();
      break;
    }

    case 'ArrowRight': {
      gallery.displayImage(gallery.currentIndex + 1);
      event.preventDefault();
      break;
    }

    case 'Delete': {
      gallery.galleryFiles.splice(gallery.currentIndex, 1);

      if (!gallery.galleryFiles.length) {
        outerPanel.remove();
        return;
      } else {
        gallery.displayImage(gallery.currentIndex);
      }
      event.preventDefault();

      break;
    }

    }

  });

};
gallery.displayImage = function(index) {

  if (index < 0) {
    index = 0;
  } else if (index >= gallery.galleryFiles.length) {
    index = gallery.galleryFiles.length - 1;
  }

  gallery.currentIndex = index;

  gallery.galleryImage.src = gallery.galleryFiles[index];

  if (index > 0) {
    gallery.previousImage.src = gallery.galleryFiles[index - 1];
  }

  if (index < gallery.galleryFiles.length - 1) {
    gallery.nextImage.src = gallery.galleryFiles[index + 1];
  }

};

gallery.addGalleryFile = function(url) {

  if (gallery.galleryFiles.indexOf(url) === -1) {
    gallery.galleryFiles.push(url);
  }

};

if (!api.mobile) {
  gallery.init();
}