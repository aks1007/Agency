window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
}

function shortCuts(event)
{
    var x  = event.keyCode

    if(x == 27)
    {
        window.location = "../master.html"
    }

    if(x==78 )
    {
        window.location = "itemGroupNew.html"
    }

    if(x==85 )
    {
        window.location = "itemGroupUpdate.html"
    }

    if(x==68 )
    {
        window.location = "itemGroupDelete.html"
    }

    if(x==67 )
    {
        window.location = "itemGroupDatabase.html"
    }
}

document.getElementById('back').tabIndex = -1
