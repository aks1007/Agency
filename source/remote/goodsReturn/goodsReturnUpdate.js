var req

var grO = new Array();
var gO = new Array();
var sO = new Array();
var testO = new Array();
var invoiceNoO = new Array();

var grN = new Array();
var gN = new Array();
var sN = new Array();
var testN = new Array();
var invoiceNoN = new Array();


//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
    
    var check = sessionStorage.getItem('goodsReturnKey')
    if(check == null)
    {
        upload(1)
    }
    else
    {            
        document.getElementById('serialNo').value = check
        upload(check)
        sessionStorage.removeItem('goodsReturnKey')
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
        //Notifies user through custom response message.
        serialNo.focus()
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "PLEASE INPUT A SERIAL NO FIRST."
        setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 3000)
    }
})


//Deleting goodsReturn on submit button click
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
        fetch('http://localhost:7070/goodsReturn/basic/'+ serialNo.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
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
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.code == 200)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = "G.R. No. " + serialNo.value + " Recorded Successfully!"
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

        //Delete HTTP Request to GoodsReturn Items Collection
        fetch('http://localhost:7070/goodsReturnBill/basic/'+serialNo.value,{ method: 'DELETE'})
        .then(response => response.json())
        .then( data => 
        {
            var rowCount = items.rows.length
            for(i=0;i<rowCount-1;i++)
            {
                fetch('http://localhost:7070/goodsReturnBill',{
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
                if(gO[j]==null)
                {
                    gO[j]=0
                }
                fetch('http://localhost:7070/invoice/basic/'+ invoiceNoN[j], 
                {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                    {
                        status : sN[j],
                        grA : Number(grN[j]) + Number(gN[j]) - Number(gO[j])
                    }),
                })
            } 
        })
    }  
})

//Function for print operation
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('goodsReturnNo',serialNo.value)
    localStorage.setItem('goodsReturnBack',1)
    console.log(localStorage.getItem('goodsReturnNo'))
    window.location = "./goodsReturnPrint.html"
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
        fetch('http://localhost:7070/goodsReturn/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.     
            //If Notice exists
            if(data.serialNo!=null)
            {
                serialNo.value = data.serialNo
                date.value = dateFormat(new Date(data.date))
                customer.value = data.customer.toUpperCase()
                supplier.value = data.supplier.toUpperCase()
                cNo.value = data.cNo
                dNo.value = data.dNo
                agrNo.value = data.agrNo
                tta.value = data.tta
                tax.value = data.tax
                tgra.value = data.tgra
                remarks.value = data.remarks 
                                
                printButton.disabled = false
                
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
    fetch('http://localhost:7070/goodsReturnBill/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {            
            gO[j] = Number(data.GoodsReturnBill[j].grA)   
            gN[j] = Number(data.GoodsReturnBill[j].grA)
            
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
            element1.valueAsNumber = data.GoodsReturnBill[j].id;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.type = "number";
            element2.id = "billNo" + rowCount ;
            element2.placeholder = "INVOICE NO.";
            element2.required = true;
            element2.autocomplete = "off";
            element2.setAttribute("list", "billList")
            element2.setAttribute("onfocus", "showBills()")
            element2.setAttribute("oninput", "showBills()")
            element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkBill(billNo" + rowCount + "," + rowCount + ")")
            element2.autocomplete = "off";
            element2.value = data.GoodsReturnBill[j].billNo
            var elementx = document.createElement("datalist");
            elementx.id = "billList"; 
            element2.setAttribute("min",1)
            cell1.append(element2, elementx);    
        
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "number";
            element3.id = "ba" + rowCount ;
            element3.required = true;
            element3.placeholder = "INVOICE AMOUNT";
            element3.style.textAlign = "center";
            element3.setAttribute("min",0)
            element3.step = "any";
            element3.value =  data.GoodsReturnBill[j].ba
            element3.disabled = true
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "number";
            element4.id = "ta" + rowCount ;
            element4.required = true;
            element4.placeholder = "TAXABLE AMOUNT"
            element4.setAttribute("min",0)
            element4.step = "any";
            element4.value = data.GoodsReturnBill[j].ta
            cell3.appendChild(element4);
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "numbers";
            element5.id = "gstP" + rowCount ;
            element5.placeholder = "%"
            element5.required = true;
            element5.setAttribute("min",0)
            element5.setAttribute("onfocusout","setGST(" + rowCount + ")")
            element5.autocomplete = "off";
            element5.step = "any";
            element5.value = data.GoodsReturnBill[j].gstP
            cell4.append(element5);
        
            var cell5 = row.insertCell(5);
            var element6 = document.createElement("input");
            element6.type = "number";
            element6.id = "gstA" + rowCount ;
            element6.placeholder = "GST AMOUNT";
            element6.setAttribute("onfocusout","setGR(" + rowCount + ")")
            element6.required = true;
            element6.setAttribute("min",0)
            element6.step = "any";
            element6.value = data.GoodsReturnBill[j].gstA
            cell5.appendChild(element6);
        
            var cell6 = row.insertCell(6);
            var element7 = document.createElement("input");
            element7.type = "number";
            element7.id = "grA" + rowCount ;
            element7.placeholder = "G.R. AMOUNT"
            element7.setAttribute("onfocusout","setStatus(" + rowCount + ")")
            element7.required = true;
            element7.setAttribute("min",0)
            element7.autocomplete = "off";
            element7.step = "any";
            element7.value = data.GoodsReturnBill[j].grA
            cell6.append(element7);
        
            var cell7 = row.insertCell(7);
            var element8 = document.createElement("input");
            element8.type = "number";
            element8.id = "lrNo" + rowCount ;
            element8.required = true;
            element8.autocomplete = "off";
            element8.placeholder = "L.R. NO."
            element8.value = data.GoodsReturnBill[j].lrNo
            cell7.append(element8);
        
            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.type = "date";
            element9.id = "lrDate" + rowCount ;
            element9.required = true;
            element9.value = dateFormat(new Date(data.GoodsReturnBill[j].lrDate))
            cell8.append(element9);
        
            var cell9 = row.insertCell(9);
            var element10 = document.createElement("input")
            element10.type = "text";
            element10.id = "transporter" + rowCount;
            element10.required = true;
            element10.placeholder = "TRANSPORTER"
            element10.setAttribute("list", "transportersList")
            element10.setAttribute("onfocus", "showTransporters()")
            element10.setAttribute("onfocusout","checkTransporter(transporter" + rowCount + "," + rowCount + ")")
            element10.autocomplete = "off";
            element10.value = data.GoodsReturnBill[j].transporter
            var elementy = document.createElement("datalist");
            elementy.id = "transportersList"; 
            cell9.append(element10,elementy);
        
            var cell10 = row.insertCell(10);
            var element11 = document.createElement("select");
            element11.style.width = "100%";
            element11.id = "status" + rowCount ;
            element11.required = true;
            element11.autocomplete = "off";
            element11.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
            element11.setAttribute("onfocusout","calculateTotal()")
            element11.value = data.GoodsReturnBill[j].status
            var op1 = document.createElement("option")
            var op2 = document.createElement("option")
            op1.text = "PENDING";
            op2.text = "SETTLED";
            op1.value = "PENDING";
            op2.value = "SETTLED";
            element11.add(op1);
            element11.add(op2);
            cell10.append(element11);
            
            setBill(rowCount)
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
    element3.id = "ba" + rowCount ;
    element3.required = true;
    element3.placeholder = "INVOICE AMOUNT";
    element3.style.textAlign = "center";
    element3.setAttribute("min",0)
    element3.step = "any";
    element3.disabled = true
    cell2.appendChild(element3);

    var cell3 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "number";
    element4.id = "ta" + rowCount ;
    element4.required = true;
    element4.placeholder = "TAXABLE AMOUNT"
    element4.setAttribute("min",0)
    element4.step = "any";
    cell3.appendChild(element4);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "numbers";
    element5.id = "gstP" + rowCount ;
    element5.placeholder = "%"
    element5.required = true;
    element5.setAttribute("min",0)
    element5.setAttribute("onfocusout","setGST(" + rowCount + ")")
    element5.autocomplete = "off";
    element5.step = "any";
    cell4.append(element5);

    var cell5 = row.insertCell(5);
    var element6 = document.createElement("input");
    element6.type = "number";
    element6.id = "gstA" + rowCount ;
    element6.placeholder = "GST AMOUNT";
    element6.setAttribute("onfocusout","setGR(" + rowCount + ")")
    element6.required = true;
    element6.setAttribute("min",0)
    element6.step = "any";
    cell5.appendChild(element6);

    var cell6 = row.insertCell(6);
    var element7 = document.createElement("input");
    element7.type = "number";
    element7.id = "grA" + rowCount ;
    element7.placeholder = "G.R. AMOUNT"
    element7.setAttribute("onfocusout","setStatus(" + rowCount + ")")
    element7.required = true;
    element7.setAttribute("min",0)
    element7.autocomplete = "off";
    element7.step = "any";
    cell6.append(element7);

    var cell7 = row.insertCell(7);
    var element8 = document.createElement("input");
    element8.type = "number";
    element8.id = "lrNo" + rowCount ;
    element8.required = true;
    element8.autocomplete = "off";
    element8.placeholder = "L.R. NO."
    cell7.append(element8);

    var cell8 = row.insertCell(8);
    var element9 = document.createElement("input");
    element9.type = "date";
    element9.id = "lrDate" + rowCount ;
    element9.required = true;
    cell8.append(element9);

    var cell9 = row.insertCell(9);
    var element10 = document.createElement("input")
    element10.type = "text";
    element10.id = "transporter" + rowCount;
    element10.required = true;
    element10.placeholder = "TRANSPORTER"
    element10.setAttribute("list", "transportersList")
    element10.setAttribute("onfocus", "showTransporters()")
    element10.setAttribute("onfocusout","checkTransporter(transporter" + rowCount + "," + rowCount + ")")
    element10.autocomplete = "off";
    var elementy = document.createElement("datalist");
    elementy.id = "transportersList"; 
    cell9.append(element10,elementy);

    var cell10 = row.insertCell(10);
    var element11 = document.createElement("select");
    element11.style.width = "100%";
    element11.id = "status" + rowCount ;
    element11.required = true;
    element11.autocomplete = "off";
    element11.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
    element11.setAttribute("onfocusout","calculateTotal()")
    var op1 = document.createElement("option")
    var op2 = document.createElement("option")
    op1.text = "PENDING";
    op2.text = "SETTLED";
    op1.value = "PENDING";
    op2.value = "SETTLED";
    element11.add(op1);
    element11.add(op2);
    cell10.append(element11);

    element9.valueAsDate = new Date()
}

//Function to delete rows from item table
function deleteItem()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    if(rowCount>2)
    {   
        var r = rowCount - 2
        if(document.getElementById('billNo'+r).value!="")
        {
            if(gO[r]==null)
            {
                gO[r] = 0
            }
            fetch('http://localhost:7070/invoice/basic/'+ invoiceNoN[r], 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    status : "PENDING",
                    grA : grN[r] - gO[r]
                }),
            })
        }
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
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
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
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
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
        document.getElementById('transportersList').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

//Function to check if the postal-service input is valid
function checkTransporter(it)
{
    fetch('http://localhost:7070/transporter/basic/' + it.value )
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
                x.innerHTML = transporter.value +  " IS NOT A TRANSPORTER"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                it.focus()
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
    console.log()
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
                console.log()
                if(document.getElementById('grA'+num).value == null)
                {
                    document.getElementById('grA'+num).value = 0
                }
                document.getElementById('ba'+num).value = Number(data.netAmount - data.paid - data.grA) + Number(document.getElementById('grA'+num).value)
                invoiceNoN[num] = data.serialNo
                grN[num] = Number(data.grA)
            }
        }
    })
}

function setBill(num)
{
    var it = document.getElementById('billNo'+num).value
    fetch('http://localhost:7070/invoice/bill/' + customer.value +'/'+supplier.value +'/'+ it)
    .then( response => response.json())
    .then(data => 
    {        
        invoiceNoO[num] = data.serialNo
        grO[num] = Number(data.grA)
        testO[num] = data.netAmount - data.paid - data.grA
        document.getElementById('ba'+num).value = (Number(testO[num]) + Number(document.getElementById('grA'+num).value)).toFixed(2)

        invoiceNoN[num] = data.serialNo
        grN[num] = Number(data.grA)
        testN[num] = data.netAmount - data.paid - data.grA
    })
}

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
        sN[i] = document.getElementById('status'+i).value
        gN[i] = Number(document.getElementById('grA'+i).value)
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

ai.tabIndex = -1;
di.tabIndex = -1;