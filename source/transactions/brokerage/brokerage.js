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
         window.location = "brokerageHome.html"
        }
    }

    if(event.altKey && x==78 )
    {
        window.location = "brokerageNew.html"
    }

    if(event.altKey && x==85 )
    {
        window.location = "brokerageUpdate.html"
    }

    if(event.altKey && x==68 )
    {
        window.location = "brokerageDelete.html"
    }

    if(event.altKey && x==67 )
    {
        window.location = "brokerageDatabase.html"
    }

    if(x==45)
    {
        addItem()
    }

    if(x==46)
    {
        event.preventDefault()
        deleteItem()
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