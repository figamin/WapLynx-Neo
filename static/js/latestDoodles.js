var dir = "https://wapchan.org/doodle/src/";
counter = 0;
$.ajax({
    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
    url: dir,
    success: function (data) {
        //List all .png file names in the page
        var giffen = $(data).find("a:contains(" + ".png)")
        console.log(giffen)
        for(let i = giffen.length - 1; i > giffen.length - 5; i--) {
            var filename = giffen[i].href.replace(window.location.host, "").replace("https://", "");
            $(".doodlebox").append("<a href='https://wapchan.org/doodle'><img style='width: 200px;border:1px solid black;' src='" + dir + filename + "'></a>");
        }
    }
});
