var dir = "https://wapchan.org/doodle/gifs/";
counter = 0;
$.ajax({
    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
    url: dir,
    success: function (data) {
        //List all .png file names in the page
        var giffen = $(data).find("a:contains(" + ".gif)")
        console.log(giffen)
        for(let i = giffen.length - 1; i > giffen.length - 5; i--) {
            var filename = giffen[i].href.replace(window.location.host, "").replace("https://", "");
            $(".doodlebox").append("<a href='https://wapchan.org/doodle/potiboard.php?mode=openpch&pch=" + filename.substring(1, 14) + ".png'><img style='width: 50%;border:1px solid black;' src='" + dir + filename + "'></a>");
        }
    }
});