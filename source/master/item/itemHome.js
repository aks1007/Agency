function shortCuts(event)
{
    var x  = event.keyCode

    if(x == 27)
    {
        window.location = "../master.html"
    }

    if(x==78)
    {
        window.location = "itemNew.html"
    }

    if(x==85 )
    {
        window.location = "itemUpdate.html"
    }

    if(x==68 )
    {
        window.location = "itemDelete.html"
    }

    if(x==67)
    {
        window.location = "itemDatabase.html"
    }
}

document.getElementById('back').tabIndex = -1

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
}
