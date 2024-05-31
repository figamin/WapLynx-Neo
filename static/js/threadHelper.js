function loadThreadData() {
    let opPost = document.getElementsByClassName("opCell")[0]
    api.localRequest('/' + opPost.dataset.boarduri + '/catalog.json', function gotBoardData(
    error, rawData) {
      if (error) {
        if (callback) {
          callback(error);
        } else {
          console.log(error);
        }
        return;
      }
      let data = JSON.parse(rawData);
      let specificThread = getThread(data, Number(opPost.id))
      document.getElementById("replyCount").innerText = specificThread.postCount || 0
      document.getElementById("fileCount").innerText = specificThread.fileCount || 0
      document.getElementById("pageNum").innerText = specificThread.page
      //document.getElementById("navCatalog").href = "../" + opPost.dataset.boarduri + '/catalog.html'
      //document.getElementById("navCatalog").href = "../catalog.html";
    })
  }

  function getThread(data, id) {
    for(let i = 0; i < data.length; i++)
    {
      if(data[i].threadId == id)
      {
        return data[i]
      }
    }
  }
  loadThreadData()