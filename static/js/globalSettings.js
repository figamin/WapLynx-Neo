if (!DISABLE_JS) {
  document.getElementById('saveJSButton').style.display = 'inline';

  document.getElementById('saveFormButton').style.display = 'none';

  var siteSettingsRelation = {

    fieldConcurrentRebuildMessages : {
      setting : 'concurrentRebuildMessages',
      type : 'string'
    },
    fieldSlaves : {
      setting : 'slaves',
      type : 'array'
    },
    checkboxGlobalBanners : {
      type : 'boolean',
      setting : 'useGlobalBanners',
    },
    checkboxDisableCatalogPosting : {
      type : 'boolean',
      setting : 'disableCatalogPosting',
    },
    checkboxAllowTorFiles : {
      type : 'boolean',
      setting : 'allowTorFiles',
    },
    checkboxAllowTorPosting : {
      type : 'boolean',
      setting : 'allowTorPosting',
    },
    fieldIpExpiration : {
      type : 'string',
      setting : 'ipExpirationDays'
    },
    fieldMaster : {
      setting : 'master',
      type : 'string'
    },
    fieldMessageLength : {
      setting : 'messageLength',
      type : 'string'
    },
    fieldTorPort : {
      setting : 'torPort',
      type : 'string'
    },
    fieldSpamIpsSource : {
      setting : 'spamIpsSource',
      type : 'string'
    },
    fieldAddress : {
      setting : 'address',
      type : 'string'
    },
    fieldMediaPageSize : {
      setting : 'mediaPageSize',
      type : 'string'
    },
    fieldBypassHours : {
      type : 'string',
      setting : 'bypassDurationHours',
    },
    fieldRssDomain : {
      setting : 'rssDomain',
      type : 'string'
    },
    fieldInactivityThreshold : {
      setting : 'inactivityThreshold',
      type : 'string'
    },
    fieldCSP : {
      setting : 'CSP',
      type : 'string'
    },
    fieldPort : {
      setting : 'port',
      type : 'string'
    },
    fieldSfwOverboard : {
      setting : 'sfwOverboard',
      type : 'string'
    },
    fieldMultiBoardThreadCount : {
      setting : 'multiboardThreadCount',
      type : 'string'
    },
    fieldSslPass : {
      setting : 'sslPass',
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
    fieldOverboard : {
      setting : 'overboard',
      type : 'string'
    },
    fieldPageSize : {
      setting : 'pageSize',
      type : 'string'
    },
    fieldMaxTags : {
      setting : 'maxBoardTags',
      type : 'string'
    },
    fieldLatestPostsCount : {
      setting : 'latestPostCount',
      type : 'string'
    },
    fieldAutoSageLimit : {
      setting : 'autoSageLimit',
      type : 'string'
    },
    fieldThreadLimit : {
      setting : 'maxThreadCount',
      type : 'string'
    },
    fieldSiteTitle : {
      setting : 'siteTitle',
      type : 'string'
    },
    fieldTempDir : {
      setting : 'tempDirectory',
      type : 'string'
    },
    fieldSenderEmail : {
      setting : 'emailSender',
      type : 'string'
    },
    fieldCaptchaExpiration : {
      setting : 'captchaExpiration',
      type : 'string'
    },
    fieldMaxRequestSize : {
      setting : 'maxRequestSizeMB',
      type : 'string'
    },
    fieldMaxFileSize : {
      setting : 'maxFileSizeMB',
      type : 'string'
    },
    fieldMaxFiles : {
      setting : 'maxFiles',
      type : 'string'
    },
    fieldBanMessage : {
      setting : 'defaultBanMessage',
      type : 'string'
    },
    fieldAnonymousName : {
      setting : 'defaultAnonymousName',
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
      setting : 'languagePackPath',
      type : 'string'
    },
    fieldMaxRules : {
      setting : 'maxBoardRules',
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
      setting : 'maxBoardVolunteers',
      type : 'string'
    },
    fieldGlobalLatestImages : {
      setting : 'globalLatestImages',
      type : 'string'
    },
    fieldMaxBannerSize : {
      setting : 'maxBannerSizeKB',
      type : 'string'
    },
    fieldMaxFlagSize : {
      setting : 'maxFlagSizeKB',
      type : 'string'
    },
    fieldThumbExtension : {
      setting : 'thumbExtension',
      type : 'string'
    },
    fieldFloodInterval : {
      setting : 'floodTimerSec',
      type : 'string'
    },
    checkboxVerbose : {
      setting : 'verbose',
      type : 'boolean'
    },
    checkboxFfmpegGifs : {
      setting : 'ffmpegGifs',
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
    checkboxDisableSpamCheck : {
      setting : 'disableSpamCheck',
      type : 'boolean'
    },
    checkboxAutoPruneFiles : {
      setting : 'autoPruneFiles',
      type : 'boolean'
    },
    checkboxFrontPageStats : {
      setting : 'frontPageStats',
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
    checkboxSpamBypass : {
      setting : 'allowSpamBypass',
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
    checkboxSFWLatestImages : {
      setting : 'onlySfwLatestImages',
      type : 'boolean'
    },
    checkboxDisableFloodCheck : {
      setting : 'disableFloodCheck',
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