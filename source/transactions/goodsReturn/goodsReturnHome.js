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
        window.location = "../transactions.html"
    }

    if(x==78)
    {
        window.location = "goodsReturnNew.html"
    }

    if(x==85 )
    {
        window.location = "goodsReturnUpdate.html"
    }

    if(x==68 )
    {
        window.location = "goodsReturnDelete.html"
    }

    if(x==67)
    {
        window.location = "goodsReturnDatabase.html"
    }
}

document.getElementById('back').tabIndex = -1