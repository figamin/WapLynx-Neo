api.localRequest('/wap/res/713.json', function gotBoardData(
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
  let i = data.posts.length - 1;
    while (data.posts[i].signedRole !== "Admin" && data.posts[i].subject === null)
    {
        i -= 1;
    }
    let d = new Date(data.posts[i].creation)
    /*let subj = data.posts[i].subject;
    if (subj == null)
    {
    document.getElementById("annoHeader").innerText = data.posts[i].name + " on "
    + d.toLocaleDateString() + " at " + d.toLocaleTimeString();
    }
    else*/
    document.getElementById("annoTitle").innerHTML = data.posts[i].subject + "<span style='float:right'>" + "by " + data.posts[i].name + " on " + d.toLocaleDateString() + " at " + d.toLocaleTimeString() + "</span>";
    //document.getElementById("annoSubtitle").innerText = ;
    if (data.posts[i].message.length > 600) {
        document.getElementById("annoMessage").innerText = data.posts[i].message.substring(0, 600) + "…";
    }
    else {
        document.getElementById("annoMessage").innerText = data.posts[i].message;
    }
    if(data.posts[i].files.length) {
        document.getElementById("annoImage").src = data.posts[i].files[0].path;
        document.getElementById("annoImage").title = data.posts[i].files[0].originalName;
    }
    else {
        document.getElementById("annoImage").hidden = "hidden"
    }
    document.getElementById("annoLink").href = "https://wapchan.org/wap/res/713.html#" + data.posts[i].postId;
    document.getElementById("annoLink").innerText = "Discuss…"
});
