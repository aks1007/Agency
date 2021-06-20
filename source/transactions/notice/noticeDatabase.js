function followRow()
{
    sessionStorage.setItem('noticeKey',this.cells[0].innerText)
    window.location = './noticeUpdate.html'
}

function enterRow()
{
    this.addEventListener("keydown", function(event)
    {
        if(event.keyCode == 13)
        {
            sessionStorage.setItem('noticeKey',this.cells[0].innerText)
            x = sessionStorage.getItem('noticeKey')
            window.location = './noticeUpdate.html'
        }
    })
}

function showDatabase()
{
    
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   

    fetch('http://localhost:7070/notice')
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
            element1.innerHTML = data.Notice[rowCount-1].serialNo
            element1.style.textAlign = "centre"
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1)
            var element2 = document.createElement("span")
            element2.innerHTML = dateFormat(new Date(data.Notice[rowCount-1].date))
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = data.Notice[rowCount-1].subject
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);

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

var d = new Date()
function dateFormat(d)
{
    var y = d.getFullYear()
    var dt = d.getDate()
    if(dt<10)
    {
        dt = "0" + dt
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    m = months[d.getMonth()];
    return dt + ' ' + m + ' ' + y
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
        window.location = "./noticeHome.html"
    }
} 

function showSearchRow()
{
    document.getElementById('searchByDate').style.left = "0"
    setTimeout(function(){document.getElementById('searchByDate').style.left ="-206px"}, 500)
    dateFrom.valueAsDate = new Date()
    dateTo.valueAsDate = new Date()

    var rc = database.rows.length
    for(i=rc;i>1;i--)
    {
        database.deleteRow(i-1)
    }
    database.style.display = "none"
    searchRow.style.display = "block"
    dateFrom.focus()
}

searchButton.addEventListener('click',(event) =>
{
    if(dateFrom.checkValidity() == false)
    {        
        dateFrom.style.borderColor = "red"
        dateFrom.focus()
    }
    else if(dateTo.checkValidity() == false)
    {
        dateTo.focus()
        dateTo.style.borderColor = "red"
    }
    else
    {
        event.preventDefault()
        searchRow.style.display = "none"
        database.style.display = "inline-table"
        filteredData()
    }
    
})

function filteredData()
{
    var x = new Date(dateTo.value)
    var dt = new Date(x.setDate(x.getDate()+1))
    fetch("http://localhost:7070/notice/range/from="+dateFrom.value+"&to="+dt)
    .then(request => request.json())
    .then(data =>
    {
        console.log(data)
        database.style.display = "inline-table"
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
            element1.innerHTML = data.Notice[rowCount-1].serialNo
            element1.style.textAlign = "centre"
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1)
            var element2 = document.createElement("span")
            element2.innerHTML = dateFormat(new Date(data.Notice[rowCount-1].date))
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = data.Notice[rowCount-1].subject
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);

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
}

searchByDate.tabIndex = -1