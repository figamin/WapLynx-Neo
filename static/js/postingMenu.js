var shownPostingMenu;

function setExtraMenu(checkbox) {

  var name = checkbox.name;

  var parts = name.split('-');

  var board = parts[0];

  var thread = parts[1];

  var post = parts[2];

  var extraMenuButton = document.createElement('span');
  extraMenuButton.setAttribute('class', 'extraMenuButton');
  extraMenuButton.title = 'Post Menu';
  checkbox.parentNode.insertBefore(extraMenuButton, checkbox.nextSibling);

  var extraMenu = document.createElement('div');
  extraMenu.className = 'floatingMenu';
  extraMenu.style.display = 'none';
  extraMenu.style.position = 'absolute';

  document.body.appendChild(extraMenu);

  extraMenuButton.onclick = function() {

    var rect = extraMenuButton.getBoundingClientRect();

    var previewOrigin = {
      x : rect.right + 10 + window.scrollX,
      y : rect.top + window.scrollY
    };

    extraMenu.style.left = previewOrigin.x + 'px';
    extraMenu.style.top = previewOrigin.y + 'px';
    extraMenu.style.display = 'inline';

    shownPostingMenu = extraMenu;
  };

  var reportButton = document.createElement('label');
  reportButton.innerHTML = 'Report';
  extraMenu.appendChild(reportButton);

  extraMenu.appendChild(document.createElement('hr'));

  var globalReportButton = document.createElement('label');
  globalReportButton.innerHTML = 'Global Report';
  extraMenu.appendChild(globalReportButton);

  extraMenu.appendChild(document.createElement('hr'));

  var deleteButton = document.createElement('label');
  deleteButton.innerHTML = 'Delete';
  extraMenu.appendChild(deleteButton);

}

if (!DISABLE_JS) {

  document.body.addEventListener('click', function clicked() {

    if (shownPostingMenu) {
      shownPostingMenu.style.display = 'none';
      shownPostingMenu = null;
    }

  }, true);

  var checkboxes = document.getElementsByClassName('deletionCheckBox');

  for (var i = 0; i < checkboxes.length; i++) {
    setExtraMenu(checkboxes[i]);
  }

}