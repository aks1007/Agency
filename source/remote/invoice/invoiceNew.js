var req

//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)  
    setSerialNo()     
    document.getElementById('date').valueAsDate = new Date();
    document.getElementById('lrDate').valueAsDate = new Date();
}

//Function for print operation
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('invoiceBack',0)
    window.location = "./invoicePrint.html"
})

//Set serial No. on page-load
function setSerialNo()
{
    fetch('http://localhost:7070/invoice/last')
    .then(response => response.json())
    .then(data =>    {
       if(data.count==1)
       {            
        var x = data.Invoice[0].serialNo  
        document.getElementById('serialNo').value = x +1;
        entryNo.focus();
       } 
       if(data.count==0)
       {
        document.getElementById('serialNo').value = 1
        entryNo.focus()
       }
    }
    )
}


//Function to check if Serial No. is valid
function checkForInvoice()
{
    if(document.getElementById('serialNo').value.trim() == "")
    {
        //Notifies user through custom response message.
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "PLEASE INPUT SERIAL NO."
        setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 3000);
        document.getElementById('serialNo').select()
    }
    else
    {
        //HTTP GET-ONE REQUEST TO INVOICE COLLECTION
        fetch('http://localhost:7070/invoice/basic/'+ document.getElementById('serialNo').value)
        .then( response => response.json())
        .then(data => 
        {               
            if(data.serialNo != null)
            {                
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "SERIAL NO. " + document.getElementById("serialNo").value + " ALREADY EXISTS"
                setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 3000);
                document.getElementById("serialNo").select()
            } 
        })
    }    
}

//Function to manipulate the display of item table based on Content input
function itemDisplay(){
    if(content.value == 'documents')
    {
        var table = document.getElementById('item')
        var rowCount = table.rows.length
        for(i=1;i<rowCount;i++)
        { 
            deleteItem()
            document.getElementById('item').style.display = 'none' 
        }
    }
    else
    {
        var table = document.getElementById('item')
        var rowCount = table.rows.length
        if(rowCount == 1)
        {           
            document.getElementById('item').style.display = 'inline-table' 
            addItem() 
            document.getElementById('cNo0').focus()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = customer.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 3000);
                customer.focus()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = supplier.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 3000);
                supplier.focus()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = transporter.value +  " IS NOT A TRANSPORTER"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 3000);
                transporter.focus()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = destination.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 3000);
                destination.focus()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = it.value.toUpperCase() +  " IS NOT AN ITEM"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 3000);
                it.focus()
            }

        }
        else
        {
            document.getElementById('hsnCode'+num).value = data.hsnCode
            document.getElementById('cut'+num).value = data.itemCut
        }
    })
}

function checkCombo()
{
    var b = document.getElementById('billNo').value.trim()
    var c = document.getElementById('customer').value.trim()
    var s = document.getElementById('supplier').value.trim()    
    if(b!="" && c!="" && s!="")
    {
        fetch("http://localhost:7070/invoice/bill/"+c+"/"+s+"/"+b)
        .then(response => response.json())
        .then(data =>{
            if(data.code==200)
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "INVOICE ALREADY RECORDED AT SERIAL NO. " + data.serialNo
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 3000);
                billNo.select();
            }
        })
    }
}

//Function to add row to item table
function addItem()
{  
    items.style.display = 'inline-table'
    ai.style.left = "0";
    setTimeout(function(){ai.style.left = "-200px"}, 500)

    var table = document.getElementById('items')

    var rowCount = table.rows.length-1

    if(rowCount == 0)
    {
        ca.disabled = true
        ca.value = 0
    }

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
    element7.step = "any"
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
    element9.step = "any"
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
        if(x == 'METER')
        {
            element9.value = element6.value * element7.value
        }
        if(x == 'PIECE')
        {
            element9.value = element4.value * element7.value
        }
        calculateCumulative()
    }
}

//Function to delete rows from item table
function deleteItem()
{
    di.style.right = "0";
    setTimeout(function(){di.style.right = "-200px"}, 500)
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    if(rowCount>2)
    {
        table.deleteRow(rowCount-1);
    }
    if(rowCount == 2)
    {
        table.deleteRow(rowCount-1)
        items.style.display = "none";
        ca.disabled = false;
    }
    calculateCumulative()
    
}

//Reload Page when focus shifts out of Print-Button
function rl()
{
    location.reload()
}

//Function to add new row to Item table when tab is pressed at Last Row's Item Amount
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

//Function to delete the last row if it's Item No. field is empty
function lastRow(num)
{
    var table = document.getElementById('items')
    var rc = table.rows.length
    var x = document.getElementById("item"+num)
    if(rc==num+2)
    {
        if(x.value == "")
        {
            deleteItem()
            pcP.focus()
        }
    }
}

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

//Function to add new document to Invoice Collection
submitButton.addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        fetch('http://localhost:7070/invoice', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                serialNo : serialNo.value,
                entryNo : entryNo.value,
                billNo : billNo.value,
                orderNo : orderNo.value,
                date : date.value,
                subAgent : subAgent.value.toUpperCase(),
                customer : customer.value.toUpperCase(),
                supplier : supplier.value.toUpperCase(),
                transporter : transporter.value.toUpperCase(),
                destination : destination.value,
                cases : cases.value,
                lrNo : lrNo.value,
                lrDate : lrDate.value,
                ca : ca.value,
                pcP : pcP.value,
                pc : pc.value,
                rdP : rdP.value,
                rd : rd.value,
                ddP : ddP.value,
                dd : dd.value,
                discP : discP.value,
                disc : disc.value,
                scP : scP.value,
                sc : sc.value,
                slP : slP.value,
                sl : sl.value,
                cgstP : cgstP.value,
                cgst : cgst.value,
                sgstP : sgstP.value,
                sgst : sgst.value,
                igstP : igstP.value,
                igst : igst.value,
                netAmount : netAmount.value,
                remarks : remarks.value,
                status : 'PENDING'
            })
        })
        .then(response => response.json())
        .then(data =>{
            if(data.code == 201)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 3000);
                localStorage.setItem('invoiceNo',serialNo.value)
                printButton.disabled = false;
                printButton.focus()
                localStorage.setItem('invoiceNo',serialNo.value)
            }
            else
            {                
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload(); }, 3000);
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload();}, 3000);
        })
        
        var table = document.getElementById('items')
        var rowCount = table.rows.length
        for(i=0;i<rowCount-1;i++)
        {
            fetch('http://localhost:7070/invoiceItem',{
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body : JSON.stringify({
                    serialNo : serialNo.value,
                    id : document.getElementById('id'+i).value,
                    item : document.getElementById('item'+i).value,
                    hsnCode : document.getElementById('hsnCode'+i).value,
                    pcs : document.getElementById('pcs'+i).value,
                    cut : document.getElementById('cut'+i).value,
                    mts : document.getElementById('mts'+i).value,
                    rate : document.getElementById('rate'+i).value,
                    unit : document.getElementById('unit'+i).value,
                    amount : document.getElementById('amount'+i).value,
                })
            })
            .catch((error) =>
            {
                console.log(error)
            })
        }     
    }
})

//CALCULATIONS
function calculateCumulative()
{
    var sum = 0
    var x
    var rc = items.rows.length-1
    for(i=0;i<rc;i++)
    {
        x = document.getElementById('amount'+i).value
        sum = sum + Number(x)
    }
    ca.valueAsNumber = sum
}

var a
function calculateBefore(a)
{
    setValues()
    var x = document.getElementById(a+'P').valueAsNumber
    var c = ca.valueAsNumber
    document.getElementById(a).valueAsNumber = (c * x/100).toFixed(2)
    setValues()
}

function calculateAfter(a)
{
    setValues()
    var x = document.getElementById(a+'P').valueAsNumber
    var c = ca.valueAsNumber + pc.valueAsNumber - rd.valueAsNumber - dd.valueAsNumber - disc.valueAsNumber
    document.getElementById(a).valueAsNumber = (c * x/100).toFixed(2)
    setValues()
}

function calculateTax(a)
{
    setValues()
    var x = document.getElementById(a+'P').valueAsNumber
    var c = ca.valueAsNumber + pc.valueAsNumber - rd.valueAsNumber - dd.valueAsNumber - disc.valueAsNumber + sc.valueAsNumber - sl.valueAsNumber
    document.getElementById(a).valueAsNumber = (c * x/100).toFixed(2)
    setValues()
}

function setValues()
{
    var x = ['pc', 'rd', 'dd', 'disc', 'sc', 'sl', 'cgst', 'sgst', 'igst']
    var z = []
    for(i = 0 ; i<9;i++)
    {
        var y = document.getElementById(x[i]).value;
        if(y=='')
        {
            document.getElementById(x[i]).value = 0;
        }
        z[i] = document.getElementById(x[i]).valueAsNumber;
    }
    var c = document.getElementById('ca').valueAsNumber
    document.getElementById('netAmount').valueAsNumber = (c + z[0] - z[1] - z[2] - z[3] + z[4] - z[5] + z[6] + z[7] + z[8]).toFixed(2)
}

var p
function setPbefore(p)
{
    setValues()
    var x = document.getElementById(p).valueAsNumber
    var c = ca.valueAsNumber
    document.getElementById(p+'P').valueAsNumber = (x * 100/c).toFixed(2)
    setValues()
}

function setPafter(p)
{
    setValues()
    var x = document.getElementById(p).valueAsNumber
    var c = ca.valueAsNumber + pc.valueAsNumber - rd.valueAsNumber - dd.valueAsNumber - disc.valueAsNumber
    document.getElementById(p+'P').valueAsNumber = (x * 100/c).toFixed(2)
    setValues()
}

function setPtax(p)
{
    setValues()
    var x = document.getElementById(p).valueAsNumber
    var c = ca.valueAsNumber + pc.valueAsNumber - rd.valueAsNumber - dd.valueAsNumber - disc.valueAsNumber + sc.valueAsNumber - sl.valueAsNumber
    document.getElementById(p+'P').valueAsNumber = (x * 100/c).toFixed(2)
    setValues()
}