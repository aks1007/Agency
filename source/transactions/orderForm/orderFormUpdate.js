var req

//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
    
    var check = sessionStorage.getItem('orderFormKey')
    if(check == null)
    {
        upload(1)
    }
    else
    {            
        document.getElementById('serialNo').value = check
        upload(check)
        sessionStorage.removeItem('orderFormKey')
    } 
}

//When focus moves out of Notice Input
document.getElementById('serialNo').addEventListener('input', (event)=>
{
    upload(serialNo.value)
})

//When focus moves out of Serial No.
document.getElementById('serialNo').addEventListener('focusout',(event)=>{
    if(serialNo.value == "")
    {
        forme.reset()
        serialNo.setCustomValidity('Please input a Serial No.')
        serialNo.reportValidity()
    }
})


//Deleting orderForm on submit button click
document.getElementById('submitButton').addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        //Update Notice
        fetch('http://localhost:7070/orderForm/basic/'+ serialNo.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                date : date.value,
                customer : customer.value.toUpperCase(),
                supplier : supplier.value.toUpperCase(),
                orderNo : orderNo.value,
                transporter : transporter.value.toUpperCase(),
                case : cases.value,
                destination : destination.value.toUpperCase(), 
                remarks : remarks.value,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.code == 200)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");}, 2000);
                printButton.focus()
            }
            else
            {
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })

        //Delete HTTP Request to OrderForm Items Collection
        fetch('http://localhost:7070/orderItem/basic/'+serialNo.value,{ method: 'DELETE'})
        .then(response =>response.json())
        .then(data =>
        {
            var table = document.getElementById('items')
            var rowCount = table.rows.length
            for(i=0;i<rowCount-1;i++)
            {
                console.log('item'+i,'mts'+i)
                fetch('http://localhost:7070/orderItem',{
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body : JSON.stringify({
                        serialNo : serialNo.value,
                        id : document.getElementById('id'+i).value,
                        item : document.getElementById('item'+i).value,
                        hsnCode :document.getElementById('hsnCode'+i).value,
                        pcs : document.getElementById('pcs'+i).value,
                        cut : document.getElementById('cut'+i).value,
                        mts : document.getElementById('mts'+i).value,
                        rate : document.getElementById('rate'+i).value,
                        unit : document.getElementById('unit'+i).value,
                        amount : document.getElementById('amount'+i).value
                    })
                })
            } 
        })
    }  
})

//Function for print operation
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('orderFormNo',serialNo.value)
    localStorage.setItem('orderFormBack',1)
    console.log(localStorage.getItem('orderFormNo'))
    window.location = "./orderFormPrint.html"
})

//Function to Validate Each Input Field
function validateForm()
{
    var input = document.getElementsByTagName('input')
    for (var i = 0; i <input.length; i++)
    {
        document.getElementsByTagName('input')[i].setCustomValidity('')
        var val = document.getElementsByTagName('input')[i].checkValidity()
        if(val == false)
        {
            req = 1
        }
    } 
}

//Function to format date
var d = new Date()
function dateFormat(d)
{
    var y = d.getFullYear()
    var m = d.getMonth()+1
    var dt = d.getDate()
    if(dt<10)
    {
        dt = "0" + dt
    }
    if(m<10)
    {
        m = "0" + m
    }
    return y + '-' + m + '-' + dt
}

//Function to reset form
function rl()
{
    location.reload()
}

//Function to upload data 
function upload(num)
{   
    items.style.display = 'none';
    deleteAllItems()
    if(num == "")
    {
    }
    else
    {        
        fetch('http://localhost:7070/orderForm/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.     
            //If Notice exists
            if(data.serialNo!=null)
            {
                date.disabled = false
                customer.disabled = false
                supplier.disabled = false
                orderNo.disabled = false
                transporter.disabled = false
                cases.disabled = false
                destination.disabled = false
                remarks.disabled = false
                printButton.disabled = false
                submitButton.disabled = false

                serialNo.value = data.serialNo
                date.value = dateFormat(new Date(data.date))
                customer.value = data.customer.toUpperCase()
                supplier.value = data.supplier.toUpperCase()
                orderNo.value = data.orderNo
                transporter.value = data.transporter
                cases.value = data.case
                destination.value = data.destination
                remarks.value = data.remarks                
                showAllItems() 
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
            }     
            //If Notice doesn't exist'       
            else
            {
                serialNo.focus()
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
                forme.reset()
                serialNo.value = num
                serialNo.onfocusout = () =>{serialNo.focus()}
                printButton.disabled = true
                submitButton.disabled = true
            }    
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.innerHTML = ""
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
            forme.reset();
            serialNo.value = num
            serialNo.onfocusout = () =>{serialNo.focus()}
            printButton.disabled = true
            submitButton.disabled = true
        })
    }
}

function deleteAllItems()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}

function showAllItems()
{
    fetch('http://localhost:7070/orderItem/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {            
            items.style.display = 'inline-table';
            var table = document.getElementById('items')

            var rowCount = table.rows.length-1
        
            var row = table.insertRow(rowCount+1)
        
            row.className = "List"

            var cell0 = row.insertCell(0);
            var element1 = document.createElement("input");
            element1.type = "number";
            element1.disabled = true;
            element1.id = "id" + rowCount ;
            element1.value = data.OrderItem[j].id;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);

            var cell1 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.type = "text";
            element2.id = "item" + rowCount ;
            element2.placeholder = "ITEM NAME";
            element2.required = true;
            element2.value = data.OrderItem[j].item
            element2.autocomplete = "off";
            element2.setAttribute("list", "itemList")
            element2.setAttribute("onfocus", "showItems()")
            element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkItem(item" + rowCount + "," + rowCount + ")")
            element2.autocomplete = "off";
            var elementx = document.createElement("datalist");
            elementx.id = "itemList"; 
            cell1.append(element2, elementx);    

            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "text";
            element3.id = "hsnCode" + rowCount ;
            element3.placeholder = "HSN CODE";
            element3.value = data.OrderItem[j].hsnCode
            element3.style.textAlign = "center";
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "number";
            element4.id = "pcs" + rowCount ;
            element4.required = true;
            element4.placeholder = "NO. OF PIECES"
            element4.value = data.OrderItem[j].pcs
            element4.setAttribute("min",0)
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "numbers";
            element5.id = "cut" + rowCount ;
            element5.placeholder = "ITEM CUT LENGTH"
            element5.required = true;
            element5.value = data.OrderItem[j].cut
            element5.setAttribute("min",0)
            element5.autocomplete = "off";
            cell4.append(element5);

            var cell5 = row.insertCell(5);
            var element6 = document.createElement("input");
            element6.type = "number";
            element6.id = "mts" + rowCount ;
            element6.placeholder = "METRES OF CLOTH";
            element6.required = true;
            element6.value = data.OrderItem[j].mts
            element6.setAttribute("min",0)
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6);
            var element7 = document.createElement("input");
            element7.type = "number";
            element7.id = "rate" + rowCount ;
            element7.placeholder = "RATE"
            element7.required = true;
            element7.value = data.OrderItem[j].rate
            element7.setAttribute("min",0)
            element7.autocomplete = "off";
            cell6.append(element7);

            var cell7 = row.insertCell(7);
            var element8 = document.createElement("select");
            element8.style.width = "100%";
            element8.id = "unit" + rowCount ;
            element8.required = true;
            element8.autocomplete = "off";
            element8.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
            var op1 = document.createElement("option")
            var op2 = document.createElement("option")
            op1.text = "METER";
            op2.text = "PIECE";
            op1.value = "METER";
            op2.value = "PIECE";
            element8.add(op1);
            element8.add(op2);            
            element8.value = data.OrderItem[j].unit
            cell7.append(element8);

            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.type = "number";
            element9.id = "amount" + rowCount ;
            element9.placeholder = "AMOUNT"
            element9.disabled = true;
            element9.required = true;
            element9.value = data.OrderItem[j].amount
            cell8.append(element9);

            element6.onfocus = () => {
                var x = element4.value * element5.value
                if(x != NaN) 
                {
                    element6.value = x
                }        
            }

            element8.onblur = () => 
            {
                var x = element8.value
                if(x == 'METER')
                {
                    element9.value = element6.value * element7.value
                }
                if(x == 'PIECE')
                {
                    element9.value = element4.value * element7.value
                }
            } 
        }
    })           
}

//Function to add row to item table
function addItem()
{  

    var table = document.getElementById('items')

    var rowCount = table.rows.length-1

    var row = table.insertRow(rowCount+1)

    row.className = "List"

    var cell0 = row.insertCell(0);
    var element1 = document.createElement("input");
    element1.type = "number";
    element1.disabled = true;
    element1.id = "id" + rowCount ;
    element1.valueAsNumber = rowCount+1;
    element1.style.textAlign = "center";
    cell0.appendChild(element1);

    var cell1 = row.insertCell(1);
    var element2 = document.createElement("input");
    element2.type = "text";
    element2.id = "item" + rowCount ;
    element2.placeholder = "ITEM NAME";
    element2.required = true;
    element2.autocomplete = "off";
    element2.setAttribute("list", "itemList")
    element2.setAttribute("onfocus", "showItems()")
    element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkItem(item" + rowCount + "," + rowCount + ")")
    element2.autocomplete = "off";
    var elementx = document.createElement("datalist");
    elementx.id = "itemList"; 
    cell1.append(element2, elementx);    

    var cell2 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "text";
    element3.id = "hsnCode" + rowCount ;
    element3.placeholder = "HSN CODE";
    element3.style.textAlign = "center";
    cell2.appendChild(element3);

    var cell3 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "number";
    element4.id = "pcs" + rowCount ;
    element4.required = true;
    element4.placeholder = "NO. OF PIECES"
    element4.setAttribute("min",0)
    cell3.appendChild(element4);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "numbers";
    element5.id = "cut" + rowCount ;
    element5.placeholder = "ITEM CUT LENGTH"
    element5.required = true;
    element5.setAttribute("min",0)
    element5.autocomplete = "off";
    cell4.append(element5);

    var cell5 = row.insertCell(5);
    var element6 = document.createElement("input");
    element6.type = "number";
    element6.id = "mts" + rowCount ;
    element6.placeholder = "METRES OF CLOTH";
    element6.required = true;
    element6.setAttribute("min",0)
    cell5.appendChild(element6);

    var cell6 = row.insertCell(6);
    var element7 = document.createElement("input");
    element7.type = "number";
    element7.id = "rate" + rowCount ;
    element7.placeholder = "RATE"
    element7.required = true;
    element7.setAttribute("min",0)
    element7.autocomplete = "off";
    cell6.append(element7);

    var cell7 = row.insertCell(7);
    var element8 = document.createElement("select");
    element8.style.width = "100%";
    element8.id = "unit" + rowCount ;
    element8.required = true;
    element8.autocomplete = "off";
    element8.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
    var op1 = document.createElement("option")
    var op2 = document.createElement("option")
    op1.text = "METER";
    op2.text = "PIECE";
    op1.value = "METER";
    op2.value = "PIECE";
    element8.add(op1);
    element8.add(op2);
    cell7.append(element8);

    var cell8 = row.insertCell(8);
    var element9 = document.createElement("input");
    element9.type = "number";
    element9.id = "amount" + rowCount ;
    element9.placeholder = "AMOUNT"
    element9.disabled = true;
    element9.required = true;
    cell8.append(element9);

    element6.onfocus = () => {
        var x = element4.value * element5.value
        if(x != NaN) 
        {
            element6.value = x
        }        
        element6.select();
    }

    element8.onblur = () => {
        var x = element8.value
        console.log(x)
        if(x == 'METER')
        {
            element9.value = element6.value * element7.value
        }
        if(x == 'PIECE')
        {
            element9.value = element4.value * element7.value
        }
    }
}

//Function to delete rows from cheque table
function deleteItem()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    if(rowCount>1)
    {
        table.deleteRow(rowCount-1);
    }
}

//Reload Page when focus shifts out of Print-Button
function rl()
{
    location.reload()
}

//Function to add new row to Item table when tab is pressed at Last Row's Unit Field
function nextRow(event, num)
{
    var nr =  event.keyCode

    if(event.shiftKey && nr==9)
    {

    }

    else if(nr == 9)
    {

        var table = document.getElementById('items')
        var rc = table.rows.length
        if(rc==num+2)
        {
            addItem()
        }

    }
}

//Function to delete the last row if it's Cheque No. field is empty
function lastRow(num)
{
    var table = document.getElementById('items')
    var rc = table.rows.length
    var x = document.getElementById("item"+num)
    if(rc==num+2)
    {
        if(x.value == "" && num!=0)
        {
            deleteItem()
            remarks.focus()
        }
    }
}

function showCustomers()
{
    fetch('http://localhost:7070/customer/')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Customer[i].customer + '">' + data.Customer[i].customer + '</option>'
        }
        document.getElementById('customers').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

function checkCustomer()
{
    fetch('http://localhost:7070/customer/basic/' + customer.value )
    .then( response => response.json())
    .then(data => 
    {
        if(data.code !== 200)
        {
            if(customer.value == '')
            {
            }
            else
            {
                customer.setCustomValidity(customer.value + " is not a Customer.")
                customer.reportValidity()
            }
        }
    })
}

function showSuppliers()
{
    fetch('http://localhost:7070/supplier/')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Supplier[i].supplier + '">' + data.Supplier[i].supplier + '</option>'
        }
        document.getElementById('suppliers').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

function checkSupplier()
{
    fetch('http://localhost:7070/supplier/basic/' + supplier.value )
    .then( response => response.json())
    .then(data => 
    {
        if(data.code !== 200)
        {
            if(supplier.value == '')
            {
            }
            else
            {
                supplier.setCustomValidity(supplier.value + " is not a Supplier.")
                supplier.reportValidity()
            }

        }
    })
}

//Function to display all postal-services as a drop-down datalist
function showTransporters()
{
    fetch('http://localhost:7070/transporter')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Transporter[i].transporter + '">' + data.Transporter[i].transporter + '</option>'
        }
        document.getElementById('transporters').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

//Function to check if the postal-service input is valid
function checkTransporter()
{
    fetch('http://localhost:7070/transporter/basic/' + transporter.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(transporter.value == '')
            {
            }
            else
            {
                transporter.setCustomValidity(transporter.value + " is not a Transporter.")
                transporter.reportValidity()
            }

        }
    })
}

function showCities()
{
    fetch('http://localhost:7070/location')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Location[i].city + '">' + data.Location[i].city + '</option>'
        }
        document.getElementById('destinations').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

function checkCity()
{
    fetch('http://localhost:7070/location/' + destination.value )
    .then( response => response.json())
    .then(data => 
    {        
        if(data.code !== 200)
        {
            if(destination.value == '')
            {
            }
            else
            {
                destination.setCustomValidity(destination.value + " is not a Transporter.")
                destination.reportValidity()
            }

        }
    })
}

//Function to display all postal-services as a drop-down datalist
function showItems()
{
    fetch('http://localhost:7070/item')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Item[i].item + '">' + data.Item[i].item + '</option>'
        }
        document.getElementById('itemList').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

//Function to check if the postal-service input is valid
function checkItem(it,num)
{
    fetch('http://localhost:7070/item/' + it.value )
    .then( response => response.json())
    .then(data => 
    {        
        if(data.code !== 200)
        {
            if(it.value == '')
            {
            }
            else
            {
                it.setCustomValidity(it.value.toUpperCase() + " is not an Item.")
                it.reportValidity()
            }

        }
        else
        {
            document.getElementById('hsnCode'+num).value = data.hsnCode
            document.getElementById('cut'+num).value = data.itemCut
        }
    })
}

//CUSTOMER
document.getElementById('customer').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/customer/customerNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})

//SUPPLIER
document.getElementById('supplier').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/supplier/supplierNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})

//TRANSPORTER
document.getElementById('transporter').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/transporter/transporterNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})

//LOCATION
document.getElementById('destination').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/location/locationNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})