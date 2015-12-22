if (!DISABLE_JS) {
  document.getElementById('saveJSButton').style.display = 'inline';

  document.getElementById('saveFormButton').style.display = 'none';

  var siteSettingsRelation = {

    fieldConcurrentRebuildMessages : {
      setting : 'concurrentRebuildMessages',
      type : 'string'
    },
    fieldAddress : {
      setting : 'address',
      type : 'string'
    },
    fieldPort : {
      setting : 'port',
      type : 'string'
    },
    fieldMultiBoardThreadCount : {
      setting : 'multiboardThreadCount',
      type : 'string'
    },
    fieldTcpPort : {
      setting : 'tcpPort',
      type : 'string'
    },
    fieldGlobalLatestPosts : {
      setting : 'globalLatestPosts',
      type : 'string'
    },
    fieldOverBoardThreads : {
      setting : 'overBoardThreadCount',
      type : 'string'
    },
    fieldFePath : {
      setting : 'fePath',
      type : 'string'
    },
    fieldBypassPosts : {
      setting : 'bypassMaxPosts',
      type : 'string'
    },
    fieldBypassPosts : {
      setting : 'bypassMaxPosts',
      type : 'string'
    },
    fieldOverboard : {
      setting : 'overboard',
      type : 'string'
    },
    fieldPageSize : {
      setting : 'boardPageSize',
      type : 'string'
    },
    fieldMaxTags : {
      setting : 'maxTags',
      type : 'string'
    },
    fieldLatestPostsCount : {
      setting : 'latestPostsCount',
      type : 'string'
    },
    fieldAutoSageLimit : {
      setting : 'autoSageLimit',
      type : 'string'
    },
    fieldThreadLimit : {
      setting : 'threadLimit',
      type : 'string'
    },
    fieldSiteTitle : {
      setting : 'siteTitle',
      type : 'string'
    },
    fieldTempDir : {
      setting : 'tempDir',
      type : 'string'
    },
    fieldSenderEmail : {
      setting : 'senderEmail',
      type : 'string'
    },
    fieldCaptchaExpiration : {
      setting : 'captchaExpiration',
      type : 'string'
    },
    fieldMaxRequestSize : {
      setting : 'maxRequestSize',
      type : 'string'
    },
    fieldMaxFileSize : {
      setting : 'maxFileSize',
      type : 'string'
    },
    fieldMaxFiles : {
      setting : 'maxFiles',
      type : 'string'
    },
    fieldBanMessage : {
      setting : 'banMessage',
      type : 'string'
    },
    fieldAnonymousName : {
      setting : 'anonymousName',
      type : 'string'
    },
    fieldTopBoardsCount : {
      setting : 'topBoardsCount',
      type : 'string'
    },
    fieldBoardsPerPage : {
      setting : 'boardsPerPage',
      type : 'string'
    },
    fieldTorSource : {
      setting : 'torSource',
      type : 'string'
    },
    fieldLanguagePack : {
      setting : 'languagePack',
      type : 'string'
    },
    fieldMaxRules : {
      setting : 'maxRules',
      type : 'string'
    },
    fieldThumbSize : {
      setting : 'thumbSize',
      type : 'string'
    },
    fieldMaxFilters : {
      setting : 'maxFilters',
      type : 'string'
    },
    fieldMaxVolunteers : {
      setting : 'maxVolunteers',
      type : 'string'
    },
    fieldMaxBannerSize : {
      setting : 'maxBannerSize',
      type : 'string'
    },
    fieldMaxFlagSize : {
      setting : 'maxFlagSize',
      type : 'string'
    },
    fieldThumbExtension : {
      setting : 'thumbExtension',
      type : 'string'
    },
    fieldFloodInterval : {
      setting : 'floodInterval',
      type : 'string'
    },
    checkboxVerbose : {
      setting : 'verbose',
      type : 'boolean'
    },
    checkboxDisable304 : {
      setting : 'disable304',
      type : 'boolean'
    },
    checkboxAllowCustomJs : {
      setting : 'allowBoardCustomJs',
      type : 'boolean'
    },
    checkboxSsl : {
      setting : 'ssl',
      type : 'boolean'
    },
    checkboxGlobalBoardModeration : {
      setting : 'allowGlobalBoardModeration',
      type : 'boolean'
    },
    checkboxMediaThumb : {
      setting : 'mediaThumb',
      type : 'boolean'
    },
    checkboxGlobalCaptcha : {
      setting : 'forceCaptcha',
      type : 'boolean'
    },
    checkboxMaintenance : {
      setting : 'maintenance',
      type : 'boolean'
    },
    checkboxMultipleReports : {
      setting : 'multipleReports',
      type : 'boolean'
    },
    checkboxGlobalBanners : {
      setting : 'useGlobalBanners',
      type : 'boolean'
    },
    checkboxDisableFloodCheck : {
      setting : 'disableFloodCheck',
      type : 'boolean'
    },
    checkboxServeArchive : {
      setting : 'serveArchive',
      type : 'boolean'
    },
    checkboxDisableAccountCreation : {
      setting : 'disableAccountCreation',
      type : 'boolean'
    },
    fieldAcceptedMimes : {
      setting : 'acceptedMimes',
      type : 'array'
    },
    fieldAddons : {
      setting : 'addons',
      type : 'array'
    },
    comboArchive : {
      setting : 'archiveLevel',
      type : 'combo'
    },
    comboProxyAccess : {
      setting : 'proxyAccess',
      type : 'combo'
    },
    comboTorAccess : {
      setting : 'torAccess',
      type : 'combo'
    },
    comboTorAccess : {
      setting : 'torAccess',
      type : 'combo'
    },
    comboBoardCreationRequirement : {
      setting : 'boardCreationRequirement',
      type : 'combo'
    },
    comboBypassMode : {
      setting : 'bypassMode',
      type : 'combo'
    },
    comboMinClearIpRole : {
      setting : 'clearIpMinRole',
      type : 'combo'
    }
  };

}

function save() {

  var parameters = {};

  for ( var key in siteSettingsRelation) {

    var item = siteSettingsRelation[key];

    switch (item.type) {
    case 'string':
      parameters[item.setting] = document.getElementById(key).value.trim();
      break;
    case 'boolean':
      if (document.getElementById(key).checked) {
        parameters[item.setting] = true;
      }
      break;
    case 'combo':
      var combo = document.getElementById(key);
      parameters[item.setting] = combo.options[combo.selectedIndex].value;
      break;

    case 'array':
      var values = document.getElementById(key).value.trim().split(',');

      var processedValues = [];

      for (var i = 0; i < values.length; i++) {
        var value = values[i].trim();

        if (value.length) {
          processedValues.push(value);
        }
      }

      if (processedValues.length) {
        parameters[item.setting] = processedValues;
      }

      break;

    }

  }

  apiRequest('saveGlobalSettings', parameters, function requestComplete(status,
      data) {

    if (status === 'ok') {

      alert('Settings saved.');

      location.reload(true);
    } else {
      alert(status + ': ' + JSON.stringify(data));
    }
  });

}