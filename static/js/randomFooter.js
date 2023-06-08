var texts2= [
    '<p>\"wash your cels, alright?\"</p>',
    '<p>\"clean that <a href=\"/.static/images/thronytv.jpg\">crt</a> for once\"</p>',
    '<p>\"build a snow fort\"</p>',
    '<p>\"climb a <a href=\"/.static/images/lumtree.jpg\">tree</a>. it\'s good for you.\"</p>'
  ];
              var element2 = document.getElementById("randomFooter");
              element2.innerHTML = texts2[Math.floor(Math.random()*texts2.length)];
  
  