if (!DISABLE_JS) {

  var sideCatalog = document.getElementById('sideCatalog');

  if (!localStorage.hideSideCatalog) {
    sideCatalog.style.display = 'block';
  }

  refreshSideCatalog();

  document.getElementById('closeSideCatalogButton').onclick = function() {
    sideCatalog.style.display = 'none';
    localStorage.setItem('hideSideCatalog', true);
  }

  var catalogButton = document.getElementById('navCatalog');

  var sideCatalogButton = document.createElement('a');
  sideCatalogButton.className = 'coloredIcon';
  sideCatalogButton.id = 'navSideCatalog';
  sideCatalogButton.innerHTML = 'side catalog';
  sideCatalogButton.onclick = function() {
    sideCatalog.style.display = 'block';
    localStorage.removeItem('hideSideCatalog');
  };

  catalogButton.parentNode.insertBefore(sideCatalogButton,
      catalogButton.nextSibling);

  catalogButton.parentNode.insertBefore(document.createTextNode(' '),
      catalogButton.nextSibling);

  var divider = document.createElement('span');
  divider.innerHTML = '/';
  catalogButton.parentNode.insertBefore(divider, catalogButton.nextSibling);

  catalogButton.parentNode.insertBefore(document.createTextNode(' '),
      catalogButton.nextSibling);

}

function refreshSideCatalog() {

}
