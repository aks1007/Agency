const { TouchBarColorPicker } = require("electron")

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
    document.getElementById('doe').valueAsDate = new Date();
    document.getElementById('dop').valueAsDate = new Date();
    addItem()
}

//Function for print operation
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('paymentBack',0)
    window.location = "./paymentPrint.html"
})

//Set serial No. on page-load
function setSerialNo()
{
    fetch('http://localhost:7070/payment/last')
    .then(response => response.json())
    .then(data =>    {
       if(data.count==1)
       {            
        var x = data.Payment[0].serialNo  
        document.getElementById('serialNo').value = x +1;
        document.getElementById('entryNo').focus()
       } 
       if(data.count==0)
       {
        document.getElementById('serialNo').value = 1
        document.getElementById('entryNo').focus()
       }
    }
    )
}


//Function to check if Serial No. is valid
function checkForPayment()
{
    if(document.getElementById('serialNo').value.trim() == "")
    {
        //Notifies user through custom response message.
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "PLEASE INPUT VOUCHER NO."
        setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 3000);
        document.getElementById('serialNo').select()
    }
    else
    {
        //HTTP GET-ONE REQUEST TO PAYMENT COLLECTION
        fetch('http://localhost:7070/payment/basic/'+ document.getElementById('serialNo').value)
        .then( response => response.json())
        .then(data => 
        {               
            if(data.serialNo != null)
            {                
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "VOUCHER NO. " + document.getElementById("serialNo").value + " ALREADY EXISTS"
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = customer.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                customer.focus()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = supplier.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                supplier.focus()
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
        console.log(data)
        if(data.code !== 200)
        {
            if(it.value == '')
            {
            }
            else
            {
                if(customer.value == '')
                {
                    customer.focus()  
                    //Notifies user through custom response message.
                    var x = document.getElementById("snackbar");
                    x.className = "showError";
                    x.innerHTML = "PLEASE INPUT CUSTOMER's NAME"
                    setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                }
                else if(supplier.value == '')
                {
                    supplier.focus()  
                    //Notifies user through custom response message.
                    var x = document.getElementById("snackbar");
                    x.className = "showError";
                    x.innerHTML = "PLEASE INPUT SUPPLIER's NAME"
                    setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                }
                else
                {
                    //Notifies user through custom response message.
                    var x = document.getElementById("snackbar");
                    x.className = "showError";
                    x.innerHTML = "PLEASE INPUT CORRECT INVOICE NO."
                    setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                    it.focus()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "INVOICE NO." + it.value + " ALREADY LISTED!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                it.focus()
            }
            else
            {
                document.getElementById("ba"+num).value = data.netAmount - data.grA - data.paid
                invoiceNo[num] = data.serialNo
                gr[num] = Number(data.grA)
            }
        }
    })
}

//Function to add row to cheque table
function addCheque()
{  

    var table = document.getElementById('cheques')

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
    element2.type = "number";
    element2.id = "cNo" + rowCount ;
    element2.placeholder = "CHEQUE NO.";
    element2.autocomplete = "off";
    element2.setAttribute("onfocusout","lastRow('cNo" + rowCount + "'," + rowCount + ",'cheques')")
    cell1.appendChild(element2);    

    var cell2 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "date";
    element3.id = "cDate" + rowCount ;
    element3.style.textAlign = "center";
    cell2.appendChild(element3);

    var cell3 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "number";
    element4.id = "bank" + rowCount ;
    element4.placeholder = "BANK"
    element4.autocomplete = "off";
    cell3.appendChild(element4);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "number";
    element5.id = "cAmount" + rowCount ;
    element5.placeholder = "AMOUNT"
    element5.setAttribute("min",0)
    element5.autocomplete = "off";
    element5.step = "any";
    element5.setAttribute("onkeydown","nextRow(event," + rowCount + ",'cheques')")
    cell4.append(element5);
}

//Function to delete rows from cheque table
function deleteCheque()
{
    var table = document.getElementById("cheques");    
    var rowCount = table.rows.length;
    if(rowCount>1)
    {
        table.deleteRow(rowCount-1);
    }
}

//Function to add row to cheque table
function addFt()
{  

    var table = document.getElementById('fts')

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
    element2.type = "number";
    element2.id = "utrNo" + rowCount ;
    element2.placeholder = "UTR NO.";
    element2.autocomplete = "off";
    element2.setAttribute("onfocusout","lastRow('utrNo" + rowCount + "'," + rowCount + ",'fts')")
    cell1.appendChild(element2);    

    var cell2 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "date";
    element3.id = "ftDate" + rowCount ;
    element3.style.textAlign = "center";
    cell2.appendChild(element3);

    var cell3 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "number";
    element4.id = "bank" + rowCount ;
    element4.placeholder = "BANK"
    element4.autocomplete = "off";
    cell3.appendChild(element4);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "number";
    element5.id = "ftAmount" + rowCount ;
    element5.placeholder = "AMOUNT"
    element5.setAttribute("min",0)
    element5.autocomplete = "off";
    element5.step = "any";
    element5.setAttribute("onkeydown","nextRow(event," + rowCount + ",'fts')")
    cell4.append(element5);
}

//Function to delete rows from cheque table
function deleteFt()
{
    var table = document.getElementById("fts");    
    var rowCount = table.rows.length;
    if(rowCount>1)
    {
        table.deleteRow(rowCount-1);
    }
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
    element2.setAttribute("onfocusout","lastRow('billNo" + rowCount + "'," + rowCount + ",'items');"+"checkBill(billNo" + rowCount + "," + rowCount + ")")
    element2.autocomplete = "off";
    var elementx = document.createElement("datalist");
    elementx.id = "billList"; 
    element2.setAttribute("min",1)
    cell1.append(element2, elementx);    

    var cell2 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "number";
    element3.id = "ba" + rowCount ;
    element3.required = true;
    element3.placeholder = "INVOICE AMT";
    element3.style.textAlign = "center";
    element3.setAttribute("min",0)
    element3.step = "any";
    element3.disabled = true;
    cell2.appendChild(element3);

    var cell3 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "number";
    element4.id = "dd" + rowCount ;
    element4.required = true;
    element4.placeholder = "DUE DAYS"
    element4.setAttribute("min",0)
    element4.step = "any";
    cell3.appendChild(element4);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "number";
    element5.id = "grl" + rowCount ;
    element5.placeholder = "G.R. LESS"
    element5.setAttribute("min",0)
    element5.autocomplete = "off";
    element5.step = "any";
    cell4.append(element5);

    var cell5 = row.insertCell(5);
    var element6 = document.createElement("input");
    element6.type = "number";
    element6.id = "rd" + rowCount ;
    element6.placeholder = "RATE DIFF";
    element6.setAttribute("min",0)
    element6.step = "any";
    cell5.appendChild(element6);

    var cell6 = row.insertCell(6);
    var element7 = document.createElement("input");
    element7.type = "number";
    element7.id = "cl" + rowCount ;
    element7.placeholder = "CLAIM LESS"
    element7.setAttribute("min",0)
    element7.autocomplete = "off";
    element7.step = "any";
    cell6.append(element7);

    var cell7 = row.insertCell(7);
    var element8 = document.createElement("input");
    element8.type = "number";
    element8.id = "discP" + rowCount ;
    element8.autocomplete = "off";
    element8.placeholder = "DISCOUNT %"
    cell7.append(element8);

    var cell8 = row.insertCell(8);
    var element9 = document.createElement("input");
    element9.type = "number";
    element9.id = "disc" + rowCount ;
    element9.placeholder = "DISCOUNT"
    cell8.append(element9);

    var cell9 = row.insertCell(9);
    var element10 = document.createElement("input")
    element10.type = "number";
    element10.id = "pc" + rowCount;
    element10.placeholder = "PACKAGING"
    element10.autocomplete = "off";
    cell9.appendChild(element10);

    var cell10 = row.insertCell(10)
    var element11 = document.createElement("input")
    element11.type = "number";
    element11.id = "ol" + rowCount;
    element11.placeholder = "DEDUCTED"
    element11.autocomplete = "off";
    cell10.appendChild(element11);

    var cell11 = row.insertCell(11)
    var element12 = document.createElement("input")
    element12.type = "number";
    element12.id = "intP" + rowCount;
    element12.placeholder = "INTEREST %"
    element12.autocomplete = "off";
    cell11.appendChild(element12);

    var cell12 = row.insertCell(12)
    var element13 = document.createElement("input")
    element13.type = "number";
    element13.id = "int" + rowCount;
    element13.placeholder = "INTEREST"
    element13.autocomplete = "off";
    cell12.appendChild(element13);

    var cell13 = row.insertCell(13)
    var element14 = document.createElement("input")
    element14.type = "number";
    element14.id = "oa" + rowCount;
    element14.placeholder = "SURCHARGE"
    element14.autocomplete = "off";
    cell13.appendChild(element14);

    var cell14 = row.insertCell(14)
    var element15 = document.createElement("input")
    element15.type = "number";
    element15.id = "paid" + rowCount;
    element15.placeholder = "PAID AMT"
    element15.autocomplete = "off";
    cell14.appendChild(element15);

    var cell15 = row.insertCell(15);
    var element16 = document.createElement("select");
    element16.style.width = "100%";
    element16.id = "status" + rowCount ;
    element16.required = true;
    element16.autocomplete = "off";
    element16.setAttribute("onkeydown","nextRow(event," + rowCount + ",'items')")
    element16.setAttribute("onfocusout","calculateTotal()")
    var op1 = document.createElement("option")
    var op2 = document.createElement("option")
    var op3 = document.createElement("option")
    op1.text = "PENDING";
    op2.text = "SETTLED";
    op3.text = "ON ACCOUNT"
    op1.value = "PENDING";
    op2.value = "SETTLED";
    op3.value = "ON ACCOUNT";
    element16.add(op1);
    element16.add(op2);
    element16.add(op3);
    cell15.appendChild(element16);  
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

//Reload Page when focus shifts out of Print-Button
function rl()
{
    location.reload()
}

//Function to add new row to a table
function nextRow(event, num, t)
{
    var nr =  event.keyCode

    if(event.shiftKey && nr==9)
    {

    }

    else if(nr == 9)
    {

        var table = document.getElementById(t)
        var rc = table.rows.length
        if(rc==num+2)
        {
            if(t=='items')
            {
                addItem()
            }
            else if(t=='cheques')
            {
                addCheque()
            }
            else if(t=='fts')
            {
                addFt()
            }
        }

    }
}

//Function to delete the last row of a table
function lastRow(i,num,t)
{
    var table = document.getElementById(t)
    var rc = table.rows.length
    var x = document.getElementById(i)
    if(rc==num+2)
    {
        if(x.value == "" && num!=0)
        {
            if(t=='items')
            {
                deleteItem()
                brokP.focus()
            }
            else if(t=='cheques')
            {
                deleteCheque()
            }
            else if(t=='fts')
            {
                deleteFt()
            }
        }
    }
}

document.getElementById('mop').addEventListener('change',()=>{
    var x = mop.value
    if(x == "CASH")
    {
        var r1 = cheques.rows.length
        var r2 = fts.rows.length
        for(i=0;i<r1;i++)
        {
            deleteCheque()
        }
        for(j=0;j<r2;j++)
        {
            deleteFt()
        }
        cheques.style.display = "none"
        fts.style.display = "none"
    }
    else if(x == "CHEQUE")
    {
        var r1 = cheques.rows.length
        var r2 = fts.rows.length
        for(i=0;i<r1;i++)
        {
            deleteCheque()
        }
        for(j=0;j<r2;j++)
        {
            deleteFt()
        }
        cheques.style.display = "inline-table"
        fts.style.display = "none"
        addCheque()
    }
    else if(x == "FT")
    {
        var r1 = cheques.rows.length
        var r2 = fts.rows.length
        for(i=0;i<r1;i++)
        {
            deleteCheque()
        }
        for(j=0;j<r2;j++)
        {
            deleteFt()
        }
        fts.style.display = "inline-table"
        cheques.style.display = "none"
        addFt()
    } 
    else if(x == "BOTH")
    {   
         var r1 = cheques.rows.length
        var r2 = fts.rows.length
        for(i=0;i<r1;i++)
        {
            deleteCheque()
        }
        for(j=0;j<r2;j++)
        {
            deleteFt()
        }
        addCheque()
        addFt()
        cheques.style.display = "inline-table"
        fts.style.display = "inline-table"
    }
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

//Function to add new document to Payment Collection
submitButton.addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        fetch('http://localhost:7070/payment', {
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
                localStorage.setItem('paymentNo',serialNo.value)
                printButton.disabled = false;
                printButton.focus()
                localStorage.setItem('paymentNo',serialNo.value)
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
            fetch('http://localhost:7070/paymentBill',{
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body : JSON.stringify({
                    serialNo : serialNo.value,
                    id : document.getElementById('id'+i).value,
                    billNo : document.getElementById('billNo'+i).value,
                    ba : document.getElementById('ba'+i).value,
                    ta : document.getElementById('ta'+i).value,
                    gstP : document.getElementById('gstP'+i).value,
                    gstA : document.getElementById('gstA'+i).value,
                    grA : document.getElementById('grA'+i).value,
                    lrNo : document.getElementById('lrNo'+i).value,
                    lrDate : document.getElementById('lrDate'+i).value,
                    transporter : document.getElementById('transporter'+i).value,
                    status : document.getElementById('status'+i).value,
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
        document.getElementById('grA'+s).focus()
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