function followRow()
{
    findInPage.closeFindWindow()
    sessionStorage.setItem('locationKey',this.cells[1].innerText)
    x = sessionStorage.getItem('locationKey')
    window.location = './locationUpdate.html'
}

function enterRow()
{
    findInPage.closeFindWindow()
    this.addEventListener("keydown", function(event)
    {
        if(event.keyCode == 13)
        {
            sessionStorage.setItem('locationKey',this.cells[1].innerText)
            x = sessionStorage.getItem('locationKey')
            window.location = './locationUpdate.html'
        }
    })
}

function showDatabase()
{
    
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   

    fetch('http://localhost:7070/location')
    .then( response => response.json())
    .then(data => 
    {
        var limit = data.count
        for(i=0; i<limit; i++)
        {
            var table = document.getElementById('database')

            var rowCount = table.rows.length
        
            var row = table.insertRow(rowCount)

            row.id = 'data'
            row.tabIndex = rowCount
        
            var cell0 = row.insertCell(0)
            var element1 = document.createElement("span")
            element1.innerHTML = rowCount
            element1.style.textAlign = "centre"
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1)
            var element2 = document.createElement("span")
            element2.innerHTML = data.Location[rowCount-1].city
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = data.Location[rowCount-1].state
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3)
            var element4 = document.createElement("span")
            element4.innerHTML = data.Location[rowCount-1].stdCode
            element4.style.textAlign = "centre"
            cell3.appendChild(element4);

            if(rowCount%2==0)
            {
                row.className = "even"
            }
            else
            {
                row.className = "odd"
            }

            row.onclick = followRow            
            row.onfocus = enterRow
        }
    })
    .catch(error =>{
        error.message
    })
}


const ipcRenderer = require('electron').ipcRenderer
const remote = require('electron').remote;
const FindInPage = require('electron-find').FindInPage;

let findInPage = new FindInPage(remote.getCurrentWebContents());

ipcRenderer.on('on-find', (e, args) => {
  findInPage.openFindWindow()
  sessionStorage.setItem('findStatus','open')
})

document.getElementById('back').onclick = () => { 
    var y = sessionStorage.getItem('findStatus')
    if(y=='open')
    {        
        findInPage.closeFindWindow()
    }
    if(y==null)
    {            
        window.location = "./locationHome.html"
    }
}