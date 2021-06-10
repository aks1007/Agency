var s = new Array()
var g = new Array()
var gr = new Array()
var invoiceNo = new Array()
var req

//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)  
    setSerialNo()     
    document.getElementById('date').valueAsDate = new Date();
    addItem()
}

//Function for print operation
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('goodsReturnBack',0)
    window.location = "./goodsReturnPrint.html"
})

//Set serial No. on page-load
function setSerialNo()
{
    fetch('http://localhost:7070/goodsReturn/last')
    .then(response => response.json())
    .then(data =>    {
       if(data.count==1)
       {            
        var x = data.GoodsReturn[0].serialNo  
        document.getElementById('serialNo').value = x +1;
        document.getElementById('date').focus()
       } 
       if(data.count==0)
       {
        document.getElementById('serialNo').value = 1
        document.getElementById('date').focus()
       }
    }
    )
}


//Function to check if Serial No. is valid
function checkForGoodsReturn()
{
    if(document.getElementById('serialNo').value.trim() == "")
    {
        serialNo.setCustomValidity('Please input a Serial No.')
        serialNo.reportValidity()
    }
    else
    {
        //HTTP GET-ONE REQUEST TO GOODS RETURN COLLECTION
        fetch('http://localhost:7070/goodsReturn/basic/'+ document.getElementById('serialNo').value)
        .then( response => response.json())
        .then(data => 
        {               
            if(data.serialNo != null)
            {                
                serialNo.setCustomValidity('Serial No.' + serialNo.value + ' already exists.')
                serialNo.reportValidity('')
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
    fetch('http://localhost:7070/customer/basic')
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
    fetch('http://localhost:7070/supplier/basic')
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
        document.getElementById('transportersList').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

//Function to check if the postal-service input is valid
function checkTransporter(it)
{
    fetch('http://localhost:7070/transporter/' + it.value )
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
                transporter.setCustomValidity(transporter.value + " is not a Transporter.")
                transporter.reportValidity()
            }

        }
    })
}

//Function to display all postal-services as a drop-down datalist
function showBills()
{
    fetch('http://localhost:7070/invoice/combo/'+ customer.value + '/' + supplier.value)
    .then( response => response.json())
    .then(data =>
    {
        var bills = new Array();
        rowCount = items.rows.length - 1
        for(j=0;j<rowCount;j++)
        {
            bills[j] = document.getElementById('billNo'+j).value
        }
        var limit = data.count
        var options = ''

        for(i=0;i<limit;i++)
        {
            var clear = 0
            for(j=0;j<rowCount;j++)
            {
                if(bills[j] == data.Invoice[i].billNo)
                {
                    clear = 1
                }
            }
            if(clear == 0)
            {
                options += '<option value="' + data.Invoice[i].billNo + '">' + data.Invoice[i].billNo + '</option>'
            }
        }
        document.getElementById('billList').innerHTML=options
        document.getElementById('billList').focus()

    })
    .catch(error =>{
        error.message
    })   
}

//Function to check if the postal-service input is valid
function checkBill(it,num)
{
    fetch('http://localhost:7070/invoice/bill/' + customer.value +'/'+supplier.value +'/'+ it.value)
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
                if(customer.value == '')
                {
                    customer.setCustomValidity("Please input Customer's name.")
                    customer.reportValidity()
                }
                else if(supplier.value == '')
                {
                    supplier.setCustomValidity("Please input Supplier's name.")
                    supplier.reportValidity()
                }
                else
                {
                    it.setCustomValidity("Please input correct Invoice No.")
                    it.reportValidity()
                }
            }
        }
        else
        {   
            var clear
            rowCount = items.rows.length - 1
            for(j=0;j<rowCount;j++)
            {
                if(it.value  == document.getElementById('billNo'+j).value & num!=j)
                {
                    clear = 1
                }
            }
            if(clear == 1)
            {
                it.setCustomValidity("Invoice No. " + it.value + " already listed.")
                it.reportValidity()
            }
            else
            {
                document.getElementById("na"+num).value = data.netAmount
                document.getElementById("ba"+num).value = (data.netAmount - data.grA - data.paid).toFixed(2)
                invoiceNo[num] = data.serialNo
                gr[num] = Number(data.grA)
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
    element2.type = "tel";
    element2.id = "billNo" + rowCount ;
    element2.placeholder = "INVOICE NO.";
    element2.required = true;
    element2.autocomplete = "off";
    element2.setAttribute("list", "billList")
    element2.setAttribute("onfocus", "showBills()")
    element2.setAttribute("oninput", "showBills()")
    element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkBill(billNo" + rowCount + "," + rowCount + ")")
    element2.autocomplete = "off";
    var elementx = document.createElement("datalist");
    elementx.id = "billList"; 
    element2.setAttribute("min",1)
    cell1.append(element2, elementx);    

    var cell2 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "number";
    element3.id = "na" + rowCount ;
    element3.required = true;
    element3.placeholder = "INVOICE AMOUNT";
    element3.style.textAlign = "center";
    element3.setAttribute("min",0)
    element3.step = "any";
    element3.disabled = true;
    cell2.appendChild(element3);

    var cell3 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "number";
    element4.id = "ba" + rowCount ;
    element4.required = true;
    element4.placeholder = "DUE AMOUNT";
    element4.style.textAlign = "center";
    element4.setAttribute("min",0)
    element4.step = "any";
    element4.disabled = true;
    cell3.appendChild(element4);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "number";
    element5.id = "ta" + rowCount ;
    element5.required = true;
    element5.placeholder = "TAXABLE AMOUNT"
    element5.setAttribute("min",0)
    element5.step = "any";
    cell4.appendChild(element5);

    var cell5 = row.insertCell(5);
    var element6 = document.createElement("input");
    element6.type = "numbers";
    element6.id = "gstP" + rowCount ;
    element6.placeholder = "%"
    element6.required = true;
    element6.setAttribute("min",0)
    element6.setAttribute("onfocusout","setGST(" + rowCount + ")")
    element6.autocomplete = "off";
    element6.step = "any";
    cell5.append(element6);

    var cell6 = row.insertCell(6);
    var element7 = document.createElement("input");
    element7.type = "number";
    element7.id = "gstA" + rowCount ;
    element7.placeholder = "GST AMOUNT";
    element7.setAttribute("onfocusout","setGR(" + rowCount + ")")
    element7.required = true;
    element7.setAttribute("min",0)
    element7.step = "any";
    cell6.appendChild(element7);

    var cell7 = row.insertCell(7);
    var element8 = document.createElement("input");
    element8.type = "number";
    element8.id = "grA" + rowCount ;
    element8.placeholder = "G.R. AMOUNT"
    element8.setAttribute("onfocusout","setStatus(" + rowCount + ")")
    element8.required = true;
    element8.setAttribute("min",0)
    element8.autocomplete = "off";
    element8.step = "any";
    cell7.append(element8);

    var cell8 = row.insertCell(8);
    var element9 = document.createElement("input");
    element9.type = "number";
    element9.id = "lrNo" + rowCount ;
    element9.required = true;
    element9.autocomplete = "off";
    element9.placeholder = "L.R. NO."
    cell8.append(element9);

    var cell9 = row.insertCell(9);
    var element20 = document.createElement("input");
    element20.type = "date";
    element20.id = "lrDate" + rowCount ;
    element20.required = true;
    cell9.append(element20);

    var cell10 = row.insertCell(10);
    var element21 = document.createElement("input")
    element21.type = "text";
    element21.id = "transporter" + rowCount;
    element21.required = true;
    element21.placeholder = "TRANSPORTER"
    element21.setAttribute("list", "transportersList")
    element21.setAttribute("onfocus", "showTransporters()")
    element21.setAttribute("onfocusout","checkTransporter(transporter" + rowCount + "," + rowCount + ")")
    element21.autocomplete = "off";
    var elementy = document.createElement("datalist");
    elementy.id = "transportersList"; 
    cell10.append(element21,elementy);

    var cell11 = row.insertCell(11);
    var element22 = document.createElement("select");
    element22.style.width = "100%";
    element22.id = "status" + rowCount ;
    element22.required = true;
    element22.autocomplete = "off";
    element22.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
    element22.setAttribute("onfocusout","calculateTotal()")
    var op1 = document.createElement("option")
    var op2 = document.createElement("option")
    op1.text = "PENDING";
    op2.text = "SETTLED";
    op1.value = "PENDING";
    op2.value = "SETTLED";
    element22.add(op1);
    element22.add(op2);
    cell11.append(element22);

    element20.valueAsDate = new Date()
}

//Function to delete rows from item table
function deleteItem()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    if(rowCount>2)
    {
        table.deleteRow(rowCount-1);
    }
}

function deleteAllItems()
{
    var rowCount = items.rows.length-1
    for(i=rowCount;i>0;i--)
    {
        items.deleteRow(i)
    }
    addItem()
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
    var x = document.getElementById("billNo"+num)
    if(rc==num+2)
    {
        if(x.value == "" && num!=0)
        {
            deleteItem()
            remarks.focus()
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

//Function to add new document to GoodsReturn Collection
submitButton.addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        fetch('http://localhost:7070/goodsReturn', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                serialNo : serialNo.value,
                date : date.value,
                customer : customer.value.toUpperCase(),
                supplier : supplier.value.toUpperCase(),
                cNo : cNo.value,
                dNo : dNo.value,
                agrNo : agrNo.value,
                tta :tta.value,
                tax : tax.value,
                tgra : tgra.value,
                remarks : remarks.value,
            })
        })
        .then(response => response.json())
        .then(data =>{
            if(data.code == 201)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = "G.R. No. " + serialNo.value + " Recorded Successfully!"
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");}, 2000);
                localStorage.setItem('goodsReturnNo',serialNo.value)
                printButton.disabled = false;
                printButton.focus()
                localStorage.setItem('goodsReturnNo',serialNo.value)
            }
            else
            {                
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload();}, 2000);
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload();}, 2000);
        })
        
        var table = document.getElementById('items')
        var rowCount = table.rows.length
        for(i=0;i<rowCount-1;i++)
        {   
            fetch('http://localhost:7070/goodsReturnBill',{
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body : JSON.stringify({
                    serialNo : serialNo.value,
                    id : document.getElementById('id'+i).value,
                    billNo : document.getElementById('billNo'+i).value,
                    na : document.getElementById('na'+i).value,
                    ba : document.getElementById('ba'+i).value,
                    ta : document.getElementById('ta'+i).value,
                    gstP : document.getElementById('gstP'+i).value,
                    gstA : document.getElementById('gstA'+i).value,
                    grA : document.getElementById('grA'+i).value,
                    lrNo : document.getElementById('lrNo'+i).value,
                    lrDate : document.getElementById('lrDate'+i).value,
                    transporter : document.getElementById('transporter'+i).value,
                    status : document.getElementById('status'+i).value,
                    customer : document.getElementById('customer').value,
                    supplier : document.getElementById('supplier').value
                })
            })
            .catch((error) =>
            {
                console.log(error)
            })
        } 
        for(j=0;j<rowCount-1;j++)
        {
            fetch('http://localhost:7070/invoice/basic/'+ invoiceNo[j], 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    status : s[j],
                    grA : gr[j] + g[j]
                }),
            })
        }    
    }
})

function calculateTotal()
{
    var rowCount = items.rows.length
    var taxable = 0
    var gst = 0
    var gr = 0
    for(i=0; i<rowCount-1; i++)
    {
        taxable += Number(document.getElementById('ta'+i).value)
        gst += Number(document.getElementById('gstA'+i).value)
        gr += Number(document.getElementById('grA'+i).value)
        s[i] = document.getElementById('status'+i).value
        g[i] = Number(document.getElementById('grA'+i).value)
    }
    tta.value = taxable.toFixed(2)
    tax.value = gst.toFixed(2)
    tgra.value = gr.toFixed(2)
}

function setStatus(s)
{
    var a = document.getElementById('grA'+s).value
    var b = document.getElementById('ba'+s).value
    var c = b-a
    if(c==0)
    {
        document.getElementById('status'+s).value = "SETTLED"
    }
    else if(c<0)
    {
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "G.R. AMOUNT EXCEEDS DUE INVOICE AMOUNT"
        setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
        document.getElementById('grA'+s).setCustomValidity("G.R. AMOUNT EXCEEDS DUE INVOICE AMOUNT")
        document.getElementById('grA'+s).reportValidity()
    }
    else
    {
        document.getElementById('status'+s).value = "PENDING"   
    }
}

function setGST(g)
{
    var a = document.getElementById('ta'+g).value
    var b = document.getElementById('gstP'+g).value
    var c = a * b / 100
    document.getElementById('gstA'+g).value = c.toFixed(2)
}

function setGR(g)
{
    var a = document.getElementById('ta'+g).valueAsNumber
    var b = document.getElementById('gstA'+g).valueAsNumber
    var c = a + b
    document.getElementById('grA'+g).value = c.toFixed(2)
}

document.getElementById('ai').tabIndex = -1;
document.getElementById('di').tabIndex = -1;

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