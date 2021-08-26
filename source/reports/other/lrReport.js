const ipcRenderer = require('electron').ipcRenderer
var A = new Array()
var B = new Array()
var C = new Array()

//----------------------------------------------------------SETTING UP CHOSEN-JS
window.$ = window.jQuery = require('jquery');
require('chosen-js')
jQuery(document).ready(function(){
	jQuery(".chosen").chosen();
});;

//----------------------------------------------------------ON PAGE LOAD
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
    dateFrom.valueAsDate = new Date()
    dateTo.valueAsDate = new Date()
    showCustomers()
    showSuppliers()
    showCustomerGroups()
    showSupplierGroups()
    showTransporters()
}

//----------------------------------------------------------ESCAPE KEY SHORTCUT
function shortCuts(event)
{
    if(event.keyCode==27)
    {
        var x = searchRow.style.display
        if(x=='none')
        {
            searchRow.style.display = 'block'
            database.style.display = 'none'
            dateFrom.focus()
        }
        else
        {            
            ipcRenderer.send('hideReport')
        }
    }
}

//----------------------------------------------------------SHOW CUSTOMERS DROPDOWN
function showCustomers()
{
    fetch('http://localhost:7070/customer/')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        for(i=0;i<limit;i++)
        {
            $('#customer').append('<option value="' + data.Customer[i].customer + '">' + data.Customer[i].customer + '</option>')
            $('#customer').trigger("chosen:updated")
        }
    })
    .catch(error =>{
        error.message
    })   
}

//----------------------------------------------------------SHOW SUPPLIERS DROPDOWN
function showSuppliers()
{
    fetch('http://localhost:7070/supplier/')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        for(i=0;i<limit;i++)
        {
            $('#supplier').append('<option value="' + data.Supplier[i].supplier + '">' + data.Supplier[i].supplier + '</option>')
            $('#supplier').trigger("chosen:updated")
        }
    })
    .catch(error =>{
        error.message
    })   
}

//----------------------------------------------------------SHOW CUSTOMER GROUPS DROPDOWN
function showCustomerGroups()
{
    fetch('http://localhost:7070/customerGroup/')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        for(i=0;i<limit;i++)
        {
            $('#customerGroup').append('<option value="' + data.CustomerGroup[i].customerGroup + '">' + data.CustomerGroup[i].customerGroup + '</option>')
            $('#customerGroup').trigger("chosen:updated")
        }
    })
    .catch(error =>{
        error.message
    })   
}

//----------------------------------------------------------SHOW SUPPLIER GROUPS DROPDOWN
function showSupplierGroups()
{
    fetch('http://localhost:7070/supplierGroup/')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        for(i=0;i<limit;i++)
        {
            $('#supplierGroup').append('<option value="' + data.SupplierGroup[i].supplierGroup + '">' + data.SupplierGroup[i].supplierGroup + '</option>')
            $('#supplierGroup').trigger("chosen:updated")
        }
    })
    .catch(error =>{
        error.message
    })   
}

//----------------------------------------------------------SHOW TRANSPORTERS DROPDOWN
function showTransporters()
{
    fetch('http://localhost:7070/transporter')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        for(i=0;i<limit;i++)
        {
            $('#transporter').append('<option value="' + data.Transporter[i].transporter + '">' + data.Transporter[i].transporter + '</option>')
            $('#transporter').trigger("chosen:updated")
        }
    })
    .catch(error =>{
        error.message
    })   
}

//----------------------------------------------------------WHEN PARTY 'A' VALUE IS CHANGED ENABLE/DISABLE CUSTOMER/CUSTOMER GROUP SELECT
document.getElementById('partyA').addEventListener('change', ()=>
{
    
    $('#customer').prop('disabled', true);
    $('#customer').trigger("chosen:updated")

    $('#customerGroup').prop('disabled', true);
    $('#customerGroup').trigger("chosen:updated")

    if(partyA.value == "SELECT CUSTOMERS")
    {
        $('#customer').prop('disabled', false);
        $('#customer').trigger("chosen:updated")
    }

    if(partyA.value == "SELECT CUSTOMER GROUPS")
    {
        $('#customerGroup').prop('disabled', false);
        $('#customerGroup').trigger("chosen:updated")
    }
})

//----------------------------------------------------------WHEN PARTY 'B' VALUE IS CHANGED ENABLE/DISABLE SUPPLIER/SUPPLIER GROUP SELECT
document.getElementById('partyB').addEventListener('change', ()=>
{
    
    $('#supplier').prop('disabled', true);
    $('#supplier').trigger("chosen:updated")

    $('#supplierGroup').prop('disabled', true);
    $('#supplierGroup').trigger("chosen:updated")

    if(partyB.value == "SELECT SUPPLIERS")
    {
        $('#supplier').prop('disabled', false);
        $('#supplier').trigger("chosen:updated")
    }

    if(partyB.value == "SELECT SUPPLIER GROUPS")
    {
        $('#supplierGroup').prop('disabled', false);
        $('#supplierGroup').trigger("chosen:updated")
    }
})

//----------------------------------------------------------WHEN PARTY 'C' VALUE IS CHANGED ENABLE/DISABLE TRANSPORTER SELECT
document.getElementById('partyC').addEventListener('change', ()=>
{
    
    $('#transporter').prop('disabled', true);
    $('#transporter').trigger("chosen:updated")

    if(partyC.value == "SELECT TRANSPORTERS")
    {
        $('#transporter').prop('disabled', false);
        $('#transporter').trigger("chosen:updated")
    }
})


//----------------------------------------------------------LOOKING FOR REPORT
searchButton.addEventListener('click', ()=>
{
    deleteAllRows()

    //IF DATE IS THE ONLY VARIABLE
    if(partyA.value == "ALL CUSTOMERS" && partyB.value == "ALL SUPPLIERS" && partyC.value == "ALL TRANSPORTERS")
    {   
        var x = new Date(dateTo.value)
        var dt = new Date(x.setDate(x.getDate()+1))
        fetch('http://localhost:7070/invoice/lr/from='+dateFrom.value+"&to="+dt,{ method : 'POST' })
        .then( response => response.json())
        .then(data => 
        {              
            if(data.count == 0)
            {
                noData.style.display = 'inline-block'
                noData.innerHTML = 'No data found!'
            }
            document.getElementById('searchRow').style.display = 'none'
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
                element2.innerHTML = dateFormat(new Date(data.Invoice[rowCount-1].date))
                element2.style.textAlign = "centre"
                cell1.appendChild(element2);
            
                var cell2 = row.insertCell(2)
                var element3 = document.createElement("span")
                element3.innerHTML = data.Invoice[i].billNo
                element3.style.textAlign = "centre"
                cell2.appendChild(element3);
    
                var cell3 = row.insertCell(3)
                var element4 = document.createElement("span")
                element4.innerHTML = data.Invoice[i].customer
                element4.style.textAlign = "centre"
                cell3.appendChild(element4);
    
                var cell4 = row.insertCell(4)
                var element5 = document.createElement("span")
                element5.innerHTML = data.Invoice[i].supplier
                element5.style.textAlign = "centre"
                cell4.appendChild(element5);
    
                var cell5 = row.insertCell(5)
                var element6 = document.createElement("span")
                element6.innerHTML = data.Invoice[rowCount-1].ca.toLocaleString('en', {useGrouping:true})
                element6.style.textAlign = "centre"
                cell5.appendChild(element6);
    
                var cell6 = row.insertCell(6)
                var element7 = document.createElement("span")
                element7.innerHTML = data.Invoice[rowCount-1].netAmount.toLocaleString('en', {useGrouping:true})
                element7.style.textAlign = "centre"
                cell6.appendChild(element7);
    
                var cell7 = row.insertCell(7)
                var element8 = document.createElement("span")
                element8.innerHTML = data.Invoice[i].destination
                element8.style.textAlign = "centre"
                cell7.appendChild(element8);
    
                var cell8 = row.insertCell(8)
                var element9 = document.createElement("span")
                element9.innerHTML = data.Invoice[i].transporter
                element9.style.textAlign = "centre"
                cell8.appendChild(element9);
    
                var cell9 = row.insertCell(9)
                var element10 = document.createElement("span")
                element10.innerHTML = dateFormat(new Date(data.Invoice[rowCount-1].lrDate))
                element10.style.textAlign = "centre"
                cell9.appendChild(element10);
    
                var cell10 = row.insertCell(10)
                var element11 = document.createElement("span")
                element11.innerHTML = data.Invoice[i].lrNo
                element11.style.textAlign = "centre"
                cell10.appendChild(element11);
    
                var cell11 = row.insertCell(11)
                var element12 = document.createElement("span")
                element12.innerHTML = data.Invoice[i].cases
                element12.style.textAlign = "centre"
                cell11.appendChild(element12);
    
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
    //IF DATE IS --NOT-- THE ONLY VARIABLE
    else
    {
        //If Party A is 'All Customers'
       if(partyA.value == "ALL CUSTOMERS")
       {
           A.length = 1
           A[0] = ""
       }
       //If Party A is 'Select Customers'
       if(partyA.value == "SELECT CUSTOMERS")
       {
           A.length = $("#customer").chosen().val().length
           for(i=0;i<A.length;i++)
           {
               A[i] = '"' + $("#customer").chosen().val()[i] + '"'
           }
       }
        //If Party B is 'All Suppliers'
        if(partyB.value == "ALL SUPPLIERS")
        {
            B.length = 1
            B[0] = ""
        }
        //If Party A is 'Select Suppliers'
        if(partyB.value == "SELECT SUPPLIERS")
        {
            B.length = $("#supplier").chosen().val().length
            for(i=0;i<B.length;i++)
            {
                B[i] = '"' + $("#supplier").chosen().val()[i] + '"'
            }
        }
        //If Party C is 'All Transporters'
        if(partyC.value == "ALL TRANSPORTERS")
        {
            C.length = 1
            C[0] = ""
        }
        //If Party C is 'Select Transporters'
        if(partyC.value == "SELECT TRANSPORTERS")
        {
            C.length = $("#transporter").chosen().val().length
            for(i=0;i<C.length;i++)
            {
                C[i] = '"' + $("#transporter").chosen().val()[i] + '"'
            }
        }

        var Body 

        function body()
        {
            Body = "{"  
             
            if( A != "")
            {
                Body = Body + '"customer" : [' + A + ']'
            }

            if(Body != "{" && B != "")
            {
                Body = Body + ", "
            }

            if( B != "")
            {
                Body = Body + '"supplier" : [' + B + ']'
            }

            if(Body != "{" && C != "")
            {
                Body = Body + ", "
            }

            if( C != "")
            {
                Body = Body + '"transporter" : [' + C + ']'
            }

            Body = Body + "}"

            console.log(Body)
        }

        body()
        
        var x = new Date(dateTo.value)
        var dt = new Date(x.setDate(x.getDate()+1))
        fetch('http://localhost:7070/invoice/lr/from='+dateFrom.value+"&to="+dt,{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : Body
        })
        .then( response => response.json())
        .then(data =>
        {   console.log(data)
            if(data.count == 0)
            {
                noData.style.display = 'inline-block'
                noData.innerHTML = 'No data found!'
            }
            document.getElementById('searchRow').style.display = 'none'
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
                element2.innerHTML = dateFormat(new Date(data.Invoice[rowCount-1].date))
                element2.style.textAlign = "centre"
                cell1.appendChild(element2);
            
                var cell2 = row.insertCell(2)
                var element3 = document.createElement("span")
                element3.innerHTML = data.Invoice[i].billNo
                element3.style.textAlign = "centre"
                cell2.appendChild(element3);
    
                var cell3 = row.insertCell(3)
                var element4 = document.createElement("span")
                element4.innerHTML = data.Invoice[i].customer
                element4.style.textAlign = "centre"
                cell3.appendChild(element4);
    
                var cell4 = row.insertCell(4)
                var element5 = document.createElement("span")
                element5.innerHTML = data.Invoice[i].supplier
                element5.style.textAlign = "centre"
                cell4.appendChild(element5);
    
                var cell5 = row.insertCell(5)
                var element6 = document.createElement("span")
                element6.innerHTML = data.Invoice[rowCount-1].ca.toLocaleString('en', {useGrouping:true})
                element6.style.textAlign = "centre"
                cell5.appendChild(element6);
    
                var cell6 = row.insertCell(6)
                var element7 = document.createElement("span")
                element7.innerHTML = data.Invoice[rowCount-1].netAmount.toLocaleString('en', {useGrouping:true})
                element7.style.textAlign = "centre"
                cell6.appendChild(element7);
    
                var cell7 = row.insertCell(7)
                var element8 = document.createElement("span")
                element8.innerHTML = data.Invoice[i].destination
                element8.style.textAlign = "centre"
                cell7.appendChild(element8);
    
                var cell8 = row.insertCell(8)
                var element9 = document.createElement("span")
                element9.innerHTML = data.Invoice[i].transporter
                element9.style.textAlign = "centre"
                cell8.appendChild(element9);
    
                var cell9 = row.insertCell(9)
                var element10 = document.createElement("span")
                element10.innerHTML = dateFormat(new Date(data.Invoice[rowCount-1].lrDate))
                element10.style.textAlign = "centre"
                cell9.appendChild(element10);
    
                var cell10 = row.insertCell(10)
                var element11 = document.createElement("span")
                element11.innerHTML = data.Invoice[i].lrNo
                element11.style.textAlign = "centre"
                cell10.appendChild(element11);
    
                var cell11 = row.insertCell(11)
                var element12 = document.createElement("span")
                element12.innerHTML = data.Invoice[i].cases
                element12.style.textAlign = "centre"
                cell11.appendChild(element12);
    
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
})


//----------------------------------------------------------DELETE ALL ROWS
function deleteAllRows()
{
    var table = document.getElementById("database");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
    noData.style.display = 'none';
}

//----------------------------------------------------------FORMATTING DATE TO 'DD MMM YYYY'
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