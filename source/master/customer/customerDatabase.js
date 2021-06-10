function followRow()
{
    findInPage.closeFindWindow()
    sessionStorage.setItem('customerKey',this.cells[1].innerText)
    x = sessionStorage.getItem('customerKey')
    console.log(x)
    window.location = './customerUpdate.html'
}

function enterRow()
{
    findInPage.closeFindWindow()
    this.addEventListener("keydown", function(event)
    {
        if(event.keyCode == 13)
        {
            sessionStorage.setItem('customerKey',this.cells[1].innerText)
            x = sessionStorage.getItem('customerKey')
            window.location = './customerUpdate.html'
        }
    })
}

function showDatabase()
{
    
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   

    fetch('http://localhost:7070/customer/basic')
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
            element2.innerHTML = data.Customer[rowCount-1].customer
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = data.Customer[rowCount-1].customerGroup
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3)
            var element4 = document.createElement("span")
            element4.innerHTML = data.Customer[rowCount-1].dealsIn
            element4.style.textAlign = "centre"
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("span")
            element5.innerHTML = data.Customer[rowCount-1].emailId
            element5.style.textAlign = "centre"
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("span")
            element6.innerHTML = data.Customer[rowCount-1].phoneNo
            element6.style.textAlign = "centre"
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("span")
            element7.innerHTML = data.Customer[rowCount-1].mobileNo
            element7.style.textAlign = "centre"
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("span")
            element8.innerHTML = data.Customer[rowCount-1].line1 + "   " + data.Customer[rowCount-1].line2 + "   " + data.Customer[rowCount-1].city + "   " + data.Customer[rowCount-1].state + "   " + data.Customer[rowCount-1].pinCode
            element8.style.textAlign = "centre"
            cell7.appendChild(element8);

            var cell8 = row.insertCell(8)
            var element9 = document.createElement("span")
            element9.innerHTML = data.Customer[rowCount-1].post
            element9.style.textAlign = "centre"
            cell8.appendChild(element9);

            var cell9 = row.insertCell(9)
            var element10 = document.createElement("span")
            element10.innerHTML = data.Customer[rowCount-1].pan
            element10.style.textAlign = "centre"
            cell9.appendChild(element10);

            var cell10 = row.insertCell(10)
            var element11 = document.createElement("span")
            element11.innerHTML = data.Customer[rowCount-1].gstNo
            element11.style.textAlign = "centre"
            cell10.appendChild(element11);

            var cell11 = row.insertCell(11)
            var element12 = document.createElement("span")
            element12.innerHTML = data.Customer[rowCount-1].poc
            element12.style.textAlign = "centre"
            cell11.appendChild(element12);

            var cell12 = row.insertCell(12)
            var element13 = document.createElement("span")
            element13.innerHTML = data.Customer[rowCount-1].creditLimit
            element13.style.textAlign = "centre"
            cell12.appendChild(element13);

            var cell13 = row.insertCell(13)
            var element14 = document.createElement("span")
            element14.innerHTML = data.Customer[rowCount-1].creditDays
            element14.style.textAlign = "centre"
            cell13.appendChild(element14);

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
        window.location = "./customerHome.html"
    }
}