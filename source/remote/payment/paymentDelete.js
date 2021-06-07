var req
var gr = new Array();
var g = new Array();
var s = new Array();
var test = new Array();
var invoiceNo = new Array();

//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
    document.getElementById('date').valueAsDate = new Date();
    items.style.display = 'none'
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


//Deleting payment on submit button click
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
        fetch('http://localhost:7070/payment/basic/'+ serialNo.value, { method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            if(data.code == 200)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");location.reload()}, 2000);
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

        rowCount = items.rows.length
        for(i=0;i<rowCount-1;i++)
        {
            var t = test[i] - g[i]
            if(t>0)
            {
                s[i] = "PENDING"
            }
            else
            {
                s[i] = "SETTLED"
            }
            fetch('http://localhost:7070/invoice/basic/'+ invoiceNo[i], 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    status : s[i],
                    grA : gr[i] - g[i]
                }),
            })
        }

        //Delete HTTP Request to Payment Items Collection
        fetch('http://localhost:7070/paymentBill/basic/'+serialNo.value,{ method: 'DELETE'})
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
        fetch('http://localhost:7070/payment/basic/'+ num)
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
                showAllItems() 
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
                localStorage.setItem('paymentNo',serialNo.value)
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
    fetch('http://localhost:7070/paymentBill/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {            

            g[j] = data.PaymentBill[j].grA            
            console.log(g[j])
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
            element1.valueAsNumber = data.PaymentBill[j].id;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.type = "number";
            element2.id = "billNo" + rowCount ;
            element2.placeholder = "INVOICE NO.";
            element2.required = true;
            element2.autocomplete = "off";
            element2.disabled = true;
            element2.setAttribute("list", "billList")
            element2.setAttribute("onfocus", "showBills()")
            element2.setAttribute("oninput", "showBills()")
            element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkBill(billNo" + rowCount + "," + rowCount + ")")
            element2.autocomplete = "off";
            element2.value = data.PaymentBill[j].billNo
            var elementx = document.createElement("datalist");
            elementx.id = "billList"; 
            element2.setAttribute("min",0)
            cell1.append(element2, elementx);    
        
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "number";
            element3.id = "ba" + rowCount ;
            element3.required = true;
            element3.disabled = true;
            element3.placeholder = "INVOICE AMOUNT";
            element3.style.textAlign = "center";
            element3.setAttribute("min",0)
            element3.step = "any";
            element3.value =  data.PaymentBill[j].ba
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "number";
            element4.id = "ta" + rowCount ;
            element4.required = true;
            element4.disabled = true;
            element4.placeholder = "TAXABLE AMOUNT"
            element4.setAttribute("min",0)
            element4.step = "any";
            element4.value = data.PaymentBill[j].ta
            cell3.appendChild(element4);
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "numbers";
            element5.id = "gstP" + rowCount ;
            element5.placeholder = "%"
            element5.required = true;
            element5.disabled = true;
            element5.setAttribute("min",0)
            element5.setAttribute("onfocusout","setGST(" + rowCount + ")")
            element5.autocomplete = "off";
            element5.step = "any";
            element5.value = data.PaymentBill[j].gstP
            cell4.append(element5);
        
            var cell5 = row.insertCell(5);
            var element6 = document.createElement("input");
            element6.type = "number";
            element6.id = "gstA" + rowCount ;
            element6.placeholder = "GST AMOUNT";
            element6.disabled = true;
            element6.setAttribute("onfocusout","setGR(" + rowCount + ")")
            element6.required = true;
            element6.setAttribute("min",0)
            element6.step = "any";
            element6.value = data.PaymentBill[j].gstA
            cell5.appendChild(element6);
        
            var cell6 = row.insertCell(6);
            var element7 = document.createElement("input");
            element7.type = "number";
            element7.id = "grA" + rowCount ;
            element7.placeholder = "G.R. AMOUNT"
            element7.disabled = true;
            element7.setAttribute("onfocusout","setStatus(" + rowCount + ")")
            element7.required = true;
            element7.setAttribute("min",0)
            element7.autocomplete = "off";
            element7.step = "any";
            element7.value = data.PaymentBill[j].grA
            cell6.append(element7);
        
            var cell7 = row.insertCell(7);
            var element8 = document.createElement("input");
            element8.type = "number";
            element8.id = "lrNo" + rowCount ;
            element8.required = true;
            element8.autocomplete = "off";
            element8.placeholder = "L.R. NO."
            element8.disabled = true;
            element8.value = data.PaymentBill[j].lrNo
            cell7.append(element8);
        
            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.type = "date";
            element9.disabled = true;
            element9.id = "lrDate" + rowCount ;
            element9.required = true;
            element9.value = dateFormat(new Date(data.PaymentBill[j].lrDate))
            cell8.append(element9);
        
            var cell9 = row.insertCell(9);
            var element10 = document.createElement("input")
            element10.type = "text";
            element10.id = "transporter" + rowCount;
            element10.required = true;
            element10.placeholder = "TRANSPORTER"
            element10.disabled = true;
            element10.setAttribute("list", "transportersList")
            element10.setAttribute("onfocus", "showTransporters()")
            element10.setAttribute("onfocusout","checkTransporter(transporter" + rowCount + "," + rowCount + ")")
            element10.autocomplete = "off";
            element10.value = data.PaymentBill[j].transporter
            var elementy = document.createElement("datalist");
            elementy.id = "transportersList"; 
            cell9.append(element10,elementy);
        
            var cell10 = row.insertCell(10);
            var element11 = document.createElement("select");
            element11.style.width = "100%";
            element11.id = "status" + rowCount ;
            element11.required = true;
            element11.autocomplete = "off";
            element11.disabled = true;
            element11.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
            element11.setAttribute("onfocusout","calculateTotal()")
            element11.value = data.PaymentBill[j].status
            var op1 = document.createElement("option")
            var op2 = document.createElement("option")
            op1.text = "PENDING";
            op2.text = "SETTLED";
            op1.value = "PENDING";
            op2.value = "SETTLED";
            element11.add(op1);
            element11.add(op2);
            cell10.append(element11);

            checkBill(rowCount)
        }
    })           
}

//Function to check if the postal-service input is valid
function checkBill(num)
{
    var it = document.getElementById('billNo'+num).value
    fetch('http://localhost:7070/invoice/bill/' + customer.value +'/'+supplier.value +'/'+ it)
    .then( response => response.json())
    .then(data => 
    {        
        invoiceNo[num] = data.serialNo
        gr[num] = Number(data.grA)
        test[num] = data.netAmount - data.paid - data.grA
        console.log(test[num])
    })
}