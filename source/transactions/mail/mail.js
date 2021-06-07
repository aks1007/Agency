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
         window.location = "mailHome.html"
        }
    }

    if(event.altKey && x==78 )
    {
        window.location = "mailNew.html"
    }

    if(event.altKey && x==85 )
    {
        window.location = "mailUpdate.html"
    }

    if(event.altKey && x==68 )
    {
        window.location = "mailDelete.html"
    }

    if(event.altKey && x==67 )
    {
        window.location = "mailDatabase.html"
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