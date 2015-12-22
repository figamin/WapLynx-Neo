var boardIdentifier;

if (!DISABLE_JS) {
  document.getElementById('addJsButton').style.display = 'inline';

  document.getElementById('addFormButton').style.display = 'none';

  boardIdentifier = document.getElementById('boardIdentifier').value;

  var rules = document.getElementsByClassName('ruleManagementCell');

  for (var i = 0; i < rules.length; i++) {
    processRuleCell(rules[i]);
  }

}

function processRuleCell(cell) {

  var button = cell.getElementsByClassName('deleteJsButton')[0];

  button.style.display = 'inline';

  cell.getElementsByClassName('deleteFormButton')[0].style.display = 'none';

  button.onclick = function() {

    var index = cell.getElementsByClassName('indexIdentifier')[0].value;

    apiRequest('deleteRule', {
      boardUri : boardIdentifier,
      ruleIndex : index,
    }, function requestComplete(status, data) {
      if (status === 'ok') {

        location.reload(true);

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

}

function addRule() {

  var typedRule = document.getElementById('fieldRule').value.trim();

  if (!typedRule.length) {
    alert('You can\'t inform a blank rule.');

  } else if (typedRule.length > 512) {
    alert('Rule too long, keep in under 512 characters.');
  } else {

    apiRequest('createRule', {
      boardUri : boardIdentifier,
      rule : typedRule,
    }, function requestComplete(status, data) {
      if (status === 'ok') {

        location.reload(true);

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

}