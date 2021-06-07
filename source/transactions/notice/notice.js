function shortCuts(event)
{
    var x  = event.keyCode

    if(x == 27)
    {
        var y = sessionStorage.getItem('findStatus')
        if(y=='open')
        {

        }
        else
        {            
         window.location = "noticeHome.html"
        }
    }

    if(event.altKey && x==78 )
    {
        window.location = "noticeNew.html"
    }

    if(event.altKey && x==85 )
    {
        window.location = "noticeUpdate.html"
    }

    if(event.altKey && x==68 )
    {
        window.location = "noticeDelete.html"
    }

    if(event.altKey && x==67 )
    {
        window.location = "noticeDatabase.html"
    }

    if(event.ctrlKey && x==83)
    {
        showSearchRow()
    }
}

document.getElementById('back').tabIndex = -1;
document.getElementById('new').tabIndex = -1;
document.getElementById('update').tabIndex = -1;
document.getElementById('delete').tabIndex = -1;
document.getElementById('db').tabIndex = -1;