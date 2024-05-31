const posts = document.getElementsByClassName("uploadDetails");
for(let i = 0; i < posts.length; i++)
{
    posts[i].appendChild(document.createElement('br'));
    let sauceLink = document.createElement('a');
    sauceLink.innerHTML = " SauceNAO"
    sauceLink.href = "https://saucenao.com/search.php?url=" + posts[i].getElementsByClassName('originalNameLink')[0]
    sauceLink.target="_blank"
    posts[i].appendChild(sauceLink)
}