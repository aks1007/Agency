const ipcRenderer = require('electron').ipcRenderer
    
window.$ = window.jQuery = require('jquery'); 
require('../select2')('jquery')

$(document).ready(function() {
    $('.js-example-basic-single').select2();
});

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
}

function shortCuts(event)
{
    if(event.keyCode==27)
    {
        var x = searchRow.style.display
        if(x=='none')
        {
            searchRow.style.display = 'block'
            database.style.display = 'none'
            category.focus()
        }
        else
        {            
            ipcRenderer.send('hideReport')
        }
    }
}

searchButton.addEventListener('click', ()=>
{
    console.log(category.value)
    var cat = category.value

    deleteAllRows()

    if(cat == 'ALL')
    {
        customerAddress()
        supplierAddress()
    }
    if(cat == 'CUSTOMERS')
    {
        customerAddress()
    }
    if(cat == 'SUPPLIERS')
    {
        supplierAddress()
    }
})

function deleteAllRows()
{
    var table = document.getElementById("database");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}

function customerAddress()
{
    fetch('http://localhost:7070/customer/address')
    .then( response => response.json())
    .then(data => 
    {   
        document.getElementById('searchRow').style.display = 'none'
        console.log(data)
        var limit = data.count
        for(i=0; i<limit; i++)
        {   
            document.getElementById('database').style.display = 'inline-table'

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
            element2.innerHTML = data.Customer[i].type
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = data.Customer[i].customer
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3)
            var element4 = document.createElement("span")
            element4.innerHTML = data.Customer[i].customerGroup
            element4.style.textAlign = "centre"
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("span")
            element5.innerHTML = data.Customer[i].phoneNo
            element5.style.textAlign = "centre"
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("span")
            element6.innerHTML = data.Customer[i].mobileNo
            element6.style.textAlign = "centre"
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("span")
            element7.innerHTML = data.Customer[i].line1
            element7.style.textAlign = "centre"
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("span")
            element8.innerHTML = data.Customer[i].line2
            element8.style.textAlign = "centre"
            cell7.appendChild(element8);

            var cell8 = row.insertCell(8)
            var element9 = document.createElement("span")
            element9.innerHTML = data.Customer[i].city
            element9.style.textAlign = "centre"
            cell8.appendChild(element9);

            var cell9 = row.insertCell(9)
            var element10 = document.createElement("span")
            element10.innerHTML = data.Customer[i].state
            element10.style.textAlign = "centre"
            cell9.appendChild(element10);

            var cell10 = row.insertCell(10)
            var element11 = document.createElement("span")
            element11.innerHTML = data.Customer[i].pinCode
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
        }
    })
    .catch(error =>{
        error.message
    })
}

function supplierAddress()
{
    fetch('http://localhost:7070/supplier/address')
    .then( response => response.json())
    .then(data => 
    {   
        document.getElementById('searchRow').style.display = 'none'
        console.log(data)
        var limit = data.count
        for(i=0; i<limit; i++)
        {   
            document.getElementById('database').style.display = 'inline-table'

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
            element2.innerHTML = data.Supplier[i].type
            element2.style.textAlign = "centre"
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("span")
            element3.innerHTML = data.Supplier[i].supplier
            element3.style.textAlign = "centre"
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3)
            var element4 = document.createElement("span")
            element4.innerHTML = data.Supplier[i].supplierGroup
            element4.style.textAlign = "centre"
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("span")
            element5.innerHTML = data.Supplier[i].phoneNo
            element5.style.textAlign = "centre"
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("span")
            element6.innerHTML = data.Supplier[i].mobileNo
            element6.style.textAlign = "centre"
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("span")
            element7.innerHTML = data.Supplier[i].line1
            element7.style.textAlign = "centre"
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("span")
            element8.innerHTML = data.Supplier[i].line2
            element8.style.textAlign = "centre"
            cell7.appendChild(element8);

            var cell8 = row.insertCell(8)
            var element9 = document.createElement("span")
            element9.innerHTML = data.Supplier[i].city
            element9.style.textAlign = "centre"
            cell8.appendChild(element9);

            var cell9 = row.insertCell(9)
            var element10 = document.createElement("span")
            element10.innerHTML = data.Supplier[i].state
            element10.style.textAlign = "centre"
            cell9.appendChild(element10);

            var cell10 = row.insertCell(10)
            var element11 = document.createElement("span")
            element11.innerHTML = data.Supplier[i].pinCode
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
        }
    })
    .catch(error =>{
        error.message
    })
}