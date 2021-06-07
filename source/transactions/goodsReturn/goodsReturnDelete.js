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
        serialNo.setCustomValidity('Please input a Serial No.')
        serialNo.reportValidity()
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
        fetch('http://localhost:7070/goodsReturn/basic/'+ serialNo.value, { method: 'DELETE'})
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

        rowCount = items.rows.length-1
        for(i=0;i<rowCount;i++)
        {   
            fetch('http://localhost:7070/invoice/basic/'+ invoiceNo[i], 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    status : "PENDING",
                    grA : gr[i] - g[i]
                }),
            })
            .then(console.log(gr[i], g[i]))
        }

        //Delete HTTP Request to GoodsReturn Bills Collection
        fetch('http://localhost:7070/goodsReturnBill/basic/'+serialNo.value,{ method: 'DELETE'})
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
                showAllItems() 
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
                localStorage.setItem('goodsReturnNo',serialNo.value)
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
    fetch('http://localhost:7070/goodsReturnBill/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {            

            g[j] = data.GoodsReturnBill[j].grA   
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
            element2.disabled = true;
            element2.setAttribute("list", "billList")
            element2.setAttribute("onfocus", "showBills()")
            element2.setAttribute("oninput", "showBills()")
            element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkBill(billNo" + rowCount + "," + rowCount + ")")
            element2.autocomplete = "off";
            element2.value = data.GoodsReturnBill[j].billNo
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
            element3.value = data.GoodsReturnBill[j].na
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "number";
            element4.id = "ba" + rowCount ;
            element4.required = true;
            element4.disabled = true;
            element4.placeholder = "DUE AMOUNT";
            element4.style.textAlign = "center";
            element4.setAttribute("min",0)
            element4.step = "any";
            element4.value =  data.GoodsReturnBill[j].ba
            cell3.appendChild(element4);
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "number";
            element5.id = "ta" + rowCount ;
            element5.required = true;
            element5.disabled = true;
            element5.placeholder = "TAXABLE AMOUNT"
            element5.setAttribute("min",0)
            element5.step = "any";
            element5.value = data.GoodsReturnBill[j].ta
            cell4.appendChild(element5);
        
            var cell5 = row.insertCell(5);
            var element6 = document.createElement("input");
            element6.type = "numbers";
            element6.id = "gstP" + rowCount ;
            element6.placeholder = "%"
            element6.required = true;
            element6.disabled = true;
            element6.setAttribute("min",0)
            element6.setAttribute("onfocusout","setGST(" + rowCount + ")")
            element6.autocomplete = "off";
            element6.step = "any";
            element6.value = data.GoodsReturnBill[j].gstP
            cell5.append(element6);
        
            var cell6 = row.insertCell(6);
            var element7 = document.createElement("input");
            element7.type = "number";
            element7.id = "gstA" + rowCount ;
            element7.placeholder = "GST AMOUNT";
            element7.disabled = true;
            element7.setAttribute("onfocusout","setGR(" + rowCount + ")")
            element7.required = true;
            element7.setAttribute("min",0)
            element7.step = "any";
            element7.value = data.GoodsReturnBill[j].gstA
            cell6.appendChild(element7);
        
            var cell7 = row.insertCell(7);
            var element8 = document.createElement("input");
            element8.type = "number";
            element8.id = "grA" + rowCount ;
            element8.placeholder = "G.R. AMOUNT"
            element8.disabled = true;
            element8.setAttribute("onfocusout","setStatus(" + rowCount + ")")
            element8.required = true;
            element8.setAttribute("min",0)
            element8.autocomplete = "off";
            element8.step = "any";
            element8.value = data.GoodsReturnBill[j].grA
            cell7.append(element8);
        
            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.type = "number";
            element9.id = "lrNo" + rowCount ;
            element9.required = true;
            element9.autocomplete = "off";
            element9.placeholder = "L.R. NO."
            element9.disabled = true;
            element9.value = data.GoodsReturnBill[j].lrNo
            cell8.append(element9);
        
            var cell9 = row.insertCell(9);
            var element20 = document.createElement("input");
            element20.type = "date";
            element20.disabled = true;
            element20.id = "lrDate" + rowCount ;
            element20.required = true;
            element20.value = dateFormat(new Date(data.GoodsReturnBill[j].lrDate))
            cell9.append(element20);
        
            var cell10 = row.insertCell(10);
            var element21 = document.createElement("input")
            element21.type = "text";
            element21.id = "transporter" + rowCount;
            element21.required = true;
            element21.placeholder = "TRANSPORTER"
            element21.disabled = true;
            element21.setAttribute("list", "transportersList")
            element21.setAttribute("onfocus", "showTransporters()")
            element21.setAttribute("onfocusout","checkTransporter(transporter" + rowCount + "," + rowCount + ")")
            element21.autocomplete = "off";
            element21.value = data.GoodsReturnBill[j].transporter
            var elementy = document.createElement("datalist");
            elementy.id = "transportersList"; 
            cell10.append(element21,elementy);
        
            var cell11 = row.insertCell(11);
            var element22 = document.createElement("select");
            element22.style.width = "100%";
            element22.id = "status" + rowCount ;
            element22.required = true;
            element22.autocomplete = "off";
            element22.disabled = true;
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
            element22.value = data.GoodsReturnBill[j].status
            cell11.append(element22);            

            checkBill(rowCount)
        }
    })           
}

//Function to check if the postal-service input is valid
function checkBill(num)
{
    var it = document.getElementById('billNo'+num).value
    fetch('http://localhost:7070/invoice/status/' + customer.value +'/'+supplier.value +'/'+ it)
    .then( response => response.json())
    .then(data => 
    {        
        invoiceNo[num] = data.serialNo
        gr[num] = Number(data.grA)
        test[num] = data.netAmount - data.paid - data.grA    
    })
}