var currentSettingsPanel;
var currentSettingsTab;
var menuContentPanel;
var tabsDiv;

function selectSettingsPanel(tab, panel) {

  if (tab === currentSettingsTab) {
    return;
  }

  if (currentSettingsTab) {
    currentSettingsTab.id = '';
    currentSettingsPanel.remove();
  }

  menuContentPanel.appendChild(panel);
  tab.id = 'selectedTab';

  currentSettingsPanel = panel;
  currentSettingsTab = tab;

}

function registerTab(text, content, select) {

  var newTab = document.createElement('span');
  newTab.innerHTML = text;
  newTab.className = 'settingsTab';
  newTab.onclick = function() {
    selectSettingsPanel(newTab, content);
  };
  tabsDiv.appendChild(newTab);

  if (select) {
    newTab.onclick();
  }

}

function placeNavBarButton(settingsMenu) {

  var postingLink = document.getElementById('navPosting');
  var referenceNode = postingLink.nextSibling;

  postingLink.parentNode.insertBefore(document.createTextNode(' '),
      referenceNode);

  var divider = document.createElement('span');
  divider.innerHTML = '/';
  postingLink.parentNode.insertBefore(divider, referenceNode);

  postingLink.parentNode.insertBefore(document.createTextNode(' '),
      referenceNode);

  var settingsButton = document.createElement('a');
  settingsButton.innerHTML = 'settings';
  settingsButton.id = 'settingsButton';
  settingsButton.className = 'coloredIcon';
  postingLink.parentNode.insertBefore(settingsButton, referenceNode);

  settingsButton.onclick = function() {

    if (showingSettings) {
      return;
    }

    showingSettings = true;
    settingsMenu.style.display = 'block';

  }

}

function getFiltersContent() {

  var filtersPanel = document.createElement('div');

  var newFilterPanel = document.createElement('span');
  newFilterPanel.id = 'newFilterPanel';

  filtersPanel.appendChild(newFilterPanel);

  var newFilterTypeCombo = document.createElement('select');

  var filterTypes = [ 'Name', 'Tripcode', 'Subject', 'Message' ];

  for (var i = 0; i < filterTypes.length; i++) {
    var option = document.createElement('option');
    option.innerHTML = filterTypes[i];
    newFilterTypeCombo.appendChild(option);
  }
  newFilterPanel.appendChild(newFilterTypeCombo);

  var newFilterField = document.createElement('input');
  newFilterField.type = 'text';
  newFilterField.placeholder = 'filter';
  newFilterPanel.appendChild(newFilterField);

  var regexLabel = document.createElement('label');
  regexLabel.innerHTML = 'Regex';
  regexLabel.className = 'settingsLabel';
  newFilterPanel.appendChild(regexLabel);

  var newFilterRegex = document.createElement('input');
  newFilterRegex.type = 'checkbox';
  newFilterPanel.appendChild(newFilterRegex);

  var newFilterButton = document.createElement('button');
  newFilterButton.innerHTML = 'Add filter';
  newFilterButton.onclick = function() {

    var filterContent = newFilterField.value.trim();

    if (!filterContent) {
      return;
    }

    var newFilterData = {
      filter : filterContent,
      regex : newFilterRegex.checked,
      type : newFilterTypeCombo.selectedIndex
    };

    var savedFilters = JSON.parse(localStorage.filterData || '[]');

    savedFilters.push(newFilterData);

    localStorage.setItem('filterData', JSON.stringify(savedFilters));

  };
  newFilterPanel.appendChild(newFilterButton);

  return filtersPanel;

}

if (!DISABLE_JS) {

  var settingsMenu = document.createElement('div');

  placeNavBarButton(settingsMenu);

  var settingsMenuHeader = document.createElement('div');
  settingsMenuHeader.className = 'header';
  settingsMenu.appendChild(settingsMenuHeader);

  var settingsMenuLabel = document.createElement('label');
  settingsMenuLabel.innerHTML = 'Settings';
  settingsMenuLabel.className = 'headerLabel';

  settingsMenuHeader.appendChild(settingsMenuLabel);

  var showingSettings = false;

  var closeSettingsMenuButton = document.createElement('span');
  closeSettingsMenuButton.id = 'closeSettingsMenuButton';
  closeSettingsMenuButton.className = 'coloredIcon';
  closeSettingsMenuButton.onclick = function() {

    if (!showingSettings) {
      return;
    }

    showingSettings = false;
    settingsMenu.style.display = 'none';

  };

  settingsMenuHeader.appendChild(closeSettingsMenuButton);

  settingsMenu.appendChild(document.createElement('hr'));

  settingsMenu.id = 'settingsMenu';
  settingsMenu.className = 'floatingMenu';
  settingsMenu.style.display = 'none';

  document.body.appendChild(settingsMenu);

  setDraggable(settingsMenu, settingsMenuHeader);

  tabsDiv = document.createElement('div');
  settingsMenu.appendChild(tabsDiv);

  menuContentPanel = document.createElement('div');
  settingsMenu.appendChild(menuContentPanel);

  registerTab('Filters', getFiltersContent(), true);

}