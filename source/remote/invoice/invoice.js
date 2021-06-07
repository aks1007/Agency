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
         window.location = "invoiceHome.html"
        }
    }

    if(event.altKey && x==78 )
    {
        window.location = "invoiceNew.html"
    }

    if(event.altKey && x==85 )
    {
        window.location = "invoiceUpdate.html"
    }

    if(event.altKey && x==68 )
    {
        window.location = "invoiceDelete.html"
    }

    if(event.altKey && x==67 )
    {
        window.location = "invoiceDatabase.html"
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
document.getElementById('ai').tabIndex = -1;
document.getElementById('di').tabIndex = -1;