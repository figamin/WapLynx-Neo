var ids = document.getElementsByClassName('labelId');

for (var i = 0; i < ids.length; i++) {
  if (ids[i].textContent === '0ee4d7') {
    var currentAttributes = ids[i].parentNode.parentNode.parentNode.getAttribute('class');
    ids[i].parentNode.parentNode.parentNode.setAttribute('class','filteredPost ' + currentAttributes);
  }
}