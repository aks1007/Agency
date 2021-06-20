function followRow()
{
    sessionStorage.setItem('invoiceKey',this.cells[0].innerText)
    window.location = './invoiceUpdate.html'
}

function enterRow()
{
    this.addEventListener("keydown", function(event)
    {
        if(event.keyCode == 13)
        {
            sessionStorage.setItem('invoiceKey',this.cells[0].innerText)
            x = sessionStorage.getItem('invoiceKey')
            window.location = './invoiceUpdate.html'
        }
    })
}

function showDatabase()
{
    
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   

    fetch('http://localhost:7070/invoice')
    .then( response => response.json())
    .then(data => 
    {
        console.log(data)
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
            element1.innerHTML = data.Invoice[rowCount-1].serialNo
            element1.style.textAlign = "centre"
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1)
            var element2 = document.createElement("span")
            element2.innerHTML = data.Invoice[rowCount-1].billNo
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = dateFormat(new Date(data.Invoice[rowCount-1].date))
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3)
            var element4 = document.createElement("span")
            element4.innerHTML = data.Invoice[rowCount-1].customer
            element4.style.textAlign = "centre"
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("span")
            element5.innerHTML = data.Invoice[rowCount-1].supplier
            element5.style.textAlign = "centre"
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("span")
            element6.innerHTML = data.Invoice[rowCount-1].transporter
            element6.style.textAlign = "centre"
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("span")
            element7.innerHTML = data.Invoice[rowCount-1].destination
            element7.style.textAlign = "centre"
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("span")
            element8.innerHTML = data.Invoice[rowCount-1].ca.toLocaleString('en', {useGrouping:true})
            element8.style.textAlign = "centre"
            cell7.appendChild(element8);

            var ta = data.Invoice[rowCount-1].ca + data.Invoice[rowCount-1].pc - data.Invoice[rowCount-1].rd - data.Invoice[rowCount-1].dd - data.Invoice[rowCount-1].disc + data.Invoice[rowCount-1].sc - data.Invoice[rowCount-1].sl
            var cell8 = row.insertCell(8)
            var element9 = document.createElement("span")
            element9.innerHTML = ta.toLocaleString('en', {useGrouping:true})
            element9.style.textAlign = "centre"
            cell8.appendChild(element9);

            var tax = data.Invoice[rowCount-1].cgst + data.Invoice[rowCount-1].sgst + data.Invoice[rowCount-1].igst
            var cell9 = row.insertCell(9)
            var element10 = document.createElement("span")
            element10.innerHTML = tax.toLocaleString('en', {useGrouping:true})
            element10.style.textAlign = "centre"
            cell9.appendChild(element10);            

            var cell10 = row.insertCell(10)            
            var element11 = document.createElement("span")
            element11.innerHTML = data.Invoice[rowCount-1].netAmount.toLocaleString('en', {useGrouping:true})
            element11.style.textAlign = "centre"
            cell10.appendChild(element11);

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
        window.location = "./invoiceHome.html"
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
    fetch("http://localhost:7070/invoice/range/from="+dateFrom.value+"&to="+dt)
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
            element1.innerHTML = data.Invoice[rowCount-1].serialNo
            element1.style.textAlign = "centre"
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1)
            var element2 = document.createElement("span")
            element2.innerHTML = data.Invoice[rowCount-1].billNo
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = dateFormat(new Date(data.Invoice[rowCount-1].date))
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3)
            var element4 = document.createElement("span")
            element4.innerHTML = data.Invoice[rowCount-1].customer
            element4.style.textAlign = "centre"
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("span")
            element5.innerHTML = data.Invoice[rowCount-1].supplier
            element5.style.textAlign = "centre"
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("span")
            element6.innerHTML = data.Invoice[rowCount-1].transporter
            element6.style.textAlign = "centre"
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("span")
            element7.innerHTML = data.Invoice[rowCount-1].destination
            element7.style.textAlign = "centre"
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("span")
            element8.innerHTML = data.Invoice[rowCount-1].ca.toLocaleString('en', {useGrouping:true})
            element8.style.textAlign = "centre"
            cell7.appendChild(element8);

            var ta = data.Invoice[rowCount-1].ca + data.Invoice[rowCount-1].pc - data.Invoice[rowCount-1].rd - data.Invoice[rowCount-1].dd - data.Invoice[rowCount-1].disc + data.Invoice[rowCount-1].sc - data.Invoice[rowCount-1].sl
            var cell8 = row.insertCell(8)
            var element9 = document.createElement("span")
            element9.innerHTML = ta.toLocaleString('en', {useGrouping:true})
            element9.style.textAlign = "centre"
            cell8.appendChild(element9);

            var tax = data.Invoice[rowCount-1].cgst + data.Invoice[rowCount-1].sgst + data.Invoice[rowCount-1].igst
            var cell9 = row.insertCell(9)
            var element10 = document.createElement("span")
            element10.innerHTML = tax.toLocaleString('en', {useGrouping:true})
            element10.style.textAlign = "centre"
            cell9.appendChild(element10);            

            var cell10 = row.insertCell(10)            
            var element11 = document.createElement("span")
            element11.innerHTML = data.Invoice[rowCount-1].netAmount.toLocaleString('en', {useGrouping:true})
            element11.style.textAlign = "centre"
            cell10.appendChild(element11);

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