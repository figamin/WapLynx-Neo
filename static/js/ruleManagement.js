var ruleManagement = {};

ruleManagement.init = function() {

  api.convertButton('addFormButton', ruleManagement.addRule,
      'ruleManagementField');

  api.boardUri = document.getElementById('boardIdentifier').value;

  var rules = document.getElementsByClassName('ruleManagementCell');

  for (var i = 0; i < rules.length; i++) {
    ruleManagement.processRuleCell(rules[i]);
  }

};

ruleManagement.processRuleCell = function(cell) {

  var button = cell.getElementsByClassName('deleteFormButton')[0];

  api.convertButton(button, function() {

    var index = cell.getElementsByClassName('indexIdentifier')[0].value;

    api.apiRequest('deleteRule', {
      boardUri : api.boardUri,
      ruleIndex : index,
    }, function requestComplete(status, data) {
      if (status === 'ok') {
        location.reload(true);
      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  });

};

ruleManagement.addRule = function() {

  var typedRule = document.getElementById('fieldRule').value.trim();

  if (!typedRule.length) {
    alert('You can\'t inform a blank rule.');

  } else if (typedRule.length > 512) {
    alert('Rule too long, keep in under 512 characters.');
  } else {

    api.apiRequest('createRule', {
      boardUri : api.boardUri,
      rule : typedRule,
    }, function requestComplete(status, data) {
      if (status === 'ok') {

        location.reload(true);

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

};

ruleManagement.init();