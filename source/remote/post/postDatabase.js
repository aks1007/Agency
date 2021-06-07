function followRow()
{
    findInPage.closeFindWindow()
    sessionStorage.setItem('postKey',this.cells[1].innerText)
    x = sessionStorage.getItem('postKey')
    console.log(x)
    window.location = './postUpdate.html'
}

function enterRow()
{
    findInPage.closeFindWindow()
    this.addEventListener("keydown", function(event)
    {
        if(event.keyCode == 13)
        {
            sessionStorage.setItem('postKey',this.cells[1].innerText)
            x = sessionStorage.getItem('postKey')
            window.location = './postUpdate.html'
        }
    })
}

function showDatabase()
{
    
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   

    fetch('http://localhost:7070/post')
    .then( response => response.json())
    .then(data => 
    {
        console.log(data)
        var limit = data.count
        console.log(limit)
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
            element2.innerHTML = data.Post[rowCount-1].post
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = data.Post[rowCount-1].emailId
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3)
            var element4 = document.createElement("span")
            element4.innerHTML = data.Post[rowCount-1].phoneNo
            element4.style.textAlign = "centre"
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("span")
            element5.innerHTML = data.Post[rowCount-1].line1 + "   " + data.Post[rowCount-1].line2 + "   " + data.Post[rowCount-1].city + "   " + data.Post[rowCount-1].state + "   " + data.Post[rowCount-1].pinCode
            element5.style.textAlign = "centre"
            cell4.appendChild(element5);

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
        window.location = "./postHome.html"
    }
}