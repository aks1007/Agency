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

    if(x==78)
    {
        window.location = "supplierNew.html"
    }

    if(x==85 )
    {
        window.location = "supplierView.html"
    }

    if(x==68 )
    {
        window.location = "supplierDelete.html"
    }

    if(x==67)
    {
        window.location = "supplierDatabase.html"
    }
}

document.getElementById('back').tabIndex = -1