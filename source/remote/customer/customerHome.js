window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
}

document.getElementById('quit').onclick = () =>
{
    const ipcRenderer = require('electron').ipcRenderer

    ipcRenderer.send('hide')
}

document.getElementById('quit').onclick = () =>
{
    const ipcRenderer = require('electron').ipcRenderer

    ipcRenderer.send('hide')
}

function shortCuts(event)
{
    var x  = event.keyCode

    if(x==78)
    {
        window.location = "customerNew.html"
    }

    if(x==85 )
    {
        window.location = "customerUpdate.html"
    }

    if(x==68 )
    {
        window.location = "customerDelete.html"
    }

    if(x==67)
    {
        window.location = "customerDatabase.html"
    }
}