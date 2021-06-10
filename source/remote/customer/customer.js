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
         window.location = "customerHome.html"
        }
    }

    if(event.altKey && x==78 )
    {
        window.location = "customerNew.html"
    }

    if(event.altKey && x==85 )
    {
        window.location = "customerUpdate.html"
    }

    if(event.altKey && x==68 )
    {
        window.location = "customerDelete.html"
    }

    if(event.altKey && x==67 )
    {
        window.location = "customerDatabase.html"
    }
}

function Slash(event)
{
    var key = event.keyCode;
    //Backspace pressed
    if(key == 191 || key == 220)
    {
        event.preventDefault();
    }
}

document.getElementById('back').tabIndex = -1;
document.getElementById('new').tabIndex = -1;
document.getElementById('view').tabIndex = -1;
document.getElementById('delete').tabIndex = -1;
document.getElementById('db').tabIndex = -1;