//---------------------------------------------------------INITIALIZING VARIABLES
var req

var oNA = new Array()
var oBA = new Array()
var oTA = new Array()
var oGSTP = new Array()
var oGSTA = new Array()
var oGRA = new Array()
var oLRNO = new Array()
var oLRDATE = new Array()
var oTRANSPORTER = new Array()
var oSTATUS = new Array()

var iGRA = new Array()

var oldGRA = new Array();
var gO = new Array();
var sO = new Array();
var testO = new Array();
var oldInvoiceNo = new Array();

var newGRA = new Array();
var gN = new Array();
var sN = new Array();
var testN = new Array();
var newInvoiceNo = new Array();


//---------------------------------------------------------ON PAGE LOAD
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
//---------------------------------------------------------UPLOAD G.R. DATE ON SERIAL NO. INPUT
document.getElementById('serialNo').addEventListener('input', (event)=>
{
    upload(serialNo.value)
})

//---------------------------------------------------------INFORM USER TO FILL OUT SERIAL NO. INPUT FIELD, IN CASE IT IS EMPTY DURING FOCUS-OUT EVENT
document.getElementById('serialNo').addEventListener('focusout',(event)=>{
    if(serialNo.value == "")
    {
        forme.reset()
        //Notifies user through custom response message.
        serialNo.setCustomValidity('Please input a Serial No.')
        serialNo.reportValidity()
    }
})


//---------------------------------------------------------ON FORM SUBMIT
document.getElementById('submitButton').addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        //UPDATE GOODS RETURN TABLE
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

        //DELETE OLD GOODS RETURN BILLS
        fetch('http://localhost:7070/goodsReturnBill/basic/'+serialNo.value,{ method: 'DELETE'})
        .then(response => response.json())
        .then( data => 
        {
            var rowCount = items.rows.length
            //ADD NEW GOODS RETURN BILLS
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
        })  
        
        var size = oldInvoiceNo.length

        //UPDATE INVOICE TABLE PART 1
        for(j=0;j<size;j++)
        {
            if(gO[j]==null)
            {
                gO[j]=0
            }
            fetch('http://localhost:7070/invoice/basic/'+ oldInvoiceNo[j], 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    status : "PENDING",
                    grA : iGRA[j]
                }),
            })
            .then( console.log("PART 1 : " ,  oldInvoiceNo[j], iGRA[j]) )    
        }    

        var rowCount = items.rows.length

        //UPDATE INVOICE TABLE PART 2
        for(j=0;j<rowCount-1;j++)
        {
            fetch('http://localhost:7070/invoice/basic/'+ newInvoiceNo[j], 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    status : sN[j],
                    grA : iGRA[j] + gN[j]
                }),
            })
            .then( console.log("PART 2 : " ,  newInvoiceNo[j], iGRA[j], gN[j]) ) 
        }   
    }  
})

//---------------------------------------------------------PRINT GOODS RETURN SLIP
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('goodsReturnNo',serialNo.value)
    localStorage.setItem('goodsReturnBack',1)
    console.log(localStorage.getItem('goodsReturnNo'))
    window.location = "./goodsReturnPrint.html"
})

//---------------------------------------------------------VALIDATE EACH INPUT FIELD IN THE FORM
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

//---------------------------------------------------------FUNTION TO FORMAT DATE
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

//---------------------------------------------------------FUNCTION TO RESET FORM (PRINT BUTTON - ONFOCUSOUT)
function rl()
{
    location.reload()
}

//---------------------------------------------------------FUNCTION TO UPLOAD FORM DATA
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

//---------------------------------------------------------FUNCTION TO DELETE ALL GOODS RETURN BILLS IN FORM (INSIDE UPLOAD)
function deleteAllItems()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}

//---------------------------------------------------------FUCNTION TO SHOW ALL CORRESPONDING GOODS RETURN BILS (INSIDE UPLOAD)
function showAllItems()
{
    fetch('http://localhost:7070/goodsReturnBill/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {   console.log(data)
        for(j = 0; j < data.count; j++)
        {    
            gN[j] = data.grA

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
            element1.valueAsNumber = rowCount + 1;
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
            element2.setAttribute("onchange", "chooseCheck(billNo" + rowCount + "," + rowCount + ")")
            element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkOldBill(billNo" + rowCount + "," + rowCount + ")")
            element2.autocomplete = "off";
            element2.value = data.GoodsReturnBill[j].billNo
            var elementx = document.createElement("datalist");
            elementx.id = "billList"; 
            element2.setAttribute("min",1)
            cell1.append(element2, elementx); 
            var b = data.GoodsReturnBill[j].billNo   

            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "number";
            element3.id = "na" + rowCount ;
            element3.required = true;
            element3.disabled = true;
            element3.placeholder = "INVOICE AMOUNT";
            element3.style.textAlign = "center";
            element3.setAttribute("min",0)
            element3.step = "any";
            element3.value = data.GoodsReturnBill[j].na
            cell2.appendChild(element3);
            oNA[b] = data.GoodsReturnBill[j].na
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "number";
            element4.id = "ba" + rowCount ;
            element4.required = true;
            element4.placeholder = "DUE AMOUNT";
            element4.style.textAlign = "center";
            element4.setAttribute("min",0)
            element4.step = "any";
            element4.value =  data.GoodsReturnBill[j].ba
            element4.disabled = true
            cell3.appendChild(element4);
            oBA[b] = data.GoodsReturnBill[j].ba
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "number";
            element5.id = "ta" + rowCount ;
            element5.required = true;
            element5.placeholder = "TAXABLE AMOUNT"
            element5.setAttribute("min",0)
            element5.step = "any";
            element5.value = data.GoodsReturnBill[j].ta
            cell4.appendChild(element5);
            oTA[b] = data.GoodsReturnBill[j].ta
        
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
            element6.value = data.GoodsReturnBill[j].gstP
            cell5.append(element6);
            oGSTP[b] = data.GoodsReturnBill[j].gstP
        
            var cell6 = row.insertCell(6);
            var element7 = document.createElement("input");
            element7.type = "number";
            element7.id = "gstA" + rowCount ;
            element7.placeholder = "GST AMOUNT";
            element7.setAttribute("onfocusout","setGR(" + rowCount + ")")
            element7.required = true;
            element7.setAttribute("min",0)
            element7.step = "any";
            element7.value = data.GoodsReturnBill[j].gstA
            cell6.appendChild(element7);
            oGSTA[b] = data.GoodsReturnBill[j].gstA
        
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
            element8.value = data.GoodsReturnBill[j].grA
            cell7.append(element8);
            oGRA[b] = data.GoodsReturnBill[j].grA
        
            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.type = "number";
            element9.id = "lrNo" + rowCount ;
            element9.required = true;
            element9.autocomplete = "off";
            element9.placeholder = "L.R. NO."
            element9.value = data.GoodsReturnBill[j].lrNo
            cell8.append(element9);
            oLRNO[b] = data.GoodsReturnBill[j].lrNo
        
            var cell9 = row.insertCell(9);
            var element20 = document.createElement("input");
            element20.type = "date";
            element20.id = "lrDate" + rowCount ;
            element20.required = true;
            element20.value = dateFormat(new Date(data.GoodsReturnBill[j].lrDate))
            cell9.append(element20);
            oLRDATE[b] = dateFormat(new Date(data.GoodsReturnBill[j].lrDate))
        
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
            element21.value = data.GoodsReturnBill[j].transporter
            var elementy = document.createElement("datalist");
            elementy.id = "transportersList"; 
            cell10.append(element21,elementy);
            oTRANSPORTER[b] = data.GoodsReturnBill[j].transporter
        
            var cell11 = row.insertCell(11);
            var element22 = document.createElement("select");
            element22.style.width = "100%";
            element22.id = "status" + rowCount ;
            element22.required = true;
            element22.autocomplete = "off";
            element22.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
            element22.setAttribute("onfocusout","calculateTotal()")
            element22.value = data.GoodsReturnBill[j].status
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
            oSTATUS[b] = data.GoodsReturnBill[j].status
            
            setBill(rowCount)
        }
    })           
}

//---------------------------------------------------------FUNCTION TO ADD NEW GOODS RETURN BILLS ROW (CALLED INSIDE NEWROW() FUNCTION)
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
    element2.setAttribute("onchange", "chooseCheck(billNo" + rowCount + "," + rowCount + ")")
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
    element3.disabled = true;
    element3.placeholder = "INVOICE AMOUNT";
    element3.style.textAlign = "center";
    element3.setAttribute("min",0)
    element3.step = "any";
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
    element4.disabled = true
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

//---------------------------------------------------------FUNCTION TO DELETE LAST ROW OF GOODS RETURN BILLS TABLE
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
            fetch('http://localhost:7070/invoice/basic/'+ newInvoiceNo[r], 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    status : "PENDING",
                    grA : newGRA[r] - gO[r]
                }),
            })
        }
        table.deleteRow(rowCount-1);
    }
}


//---------------------------------------------------------FUNCTION WHICH CALLS ADDITEM() WHEN LAST ROW OF G.R. BILLS TABLE LOSES FOCUS
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

//---------------------------------------------------------FUNCTION WHICH DELETES LAST ROW OF G.R. BILLS TABLE
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

//---------------------------------------------------------FUNCTION TO SHOW CUSTOMERS DATALIST, WHEN CUSTOMER INPUT FIELD GETS FOCUS
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


//---------------------------------------------------------FUNCTION TO VALIDATE CUSTOMER INPUT FIELD
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

//---------------------------------------------------------FUNCTION TO SHOW SUPPLIERS DATALIST, WHEN SUPPLIER INPUT FIELD GETS FOCUS
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


//---------------------------------------------------------FUNCTION TO VALIDATE SUPPLIER INPUT FIELD
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

//---------------------------------------------------------FUNCTION TO SHOW TRANSPORTER DATALIST, WHEN EACH TRANSPORTER INPUT FIELD GETS FOCUS
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

//---------------------------------------------------------FUNCTION TO VALIDATE EACH TRANPORTER INPUT FIELD
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
                transporter.setCustomValidity(transporter.value + " is not a Transporter.")
                transporter.reportValidity()
            }

        }
    })
}

//---------------------------------------------------------FUNCTION TO SHOW INVOICES DATALIST, WHEN EACH BILL INPUT FIELD GETS FOCUS

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

function chooseCheck(it,num)
{
    var size = oldInvoiceNo.length
    var x = 1
    for(i=0;i<size;i++)
    {
        if(it.value == oldInvoiceNo[i])
        {
            x = 0
        }
    }
    if(x == 0)
    {
        document.getElementById('billNo'+num).setAttribute("onfocusout","lastRow(" + num + ");"+"checkOldBill(billNo" + num + "," + num + ")")
    }
    else
    {
        document.getElementById('billNo'+num).setAttribute("onfocusout","lastRow(" + num + ");"+"checkBill(billNo" + num + "," + num + ")")
    }
}

//---------------------------------------------------------FUNCTION TO VALIDATE EACH OLD BILL INPUT AND PERFORM ASSOCIATED OPERATIONS
function checkOldBill(it,num)
{   
    fetch('http://localhost:7070/invoice/status/' + customer.value +'/'+supplier.value +'/'+ it.value)
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
                    customer.reportValidity()
                }
                else if(supplier.value == '')
                {
                    supplier.reportValidity()
                }
                else
                {
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
                if(it.value == document.getElementById('billNo'+j).value & num!=j)
                {                    
                    clear = 1
                }
            }
            if(clear == 1)
            {
                it.setCustomValidity("Invoice No." + it.value + " has already been listed!")
                it.reportValidity()
            }
            else
            { 
                var b = it.value
                document.getElementById('na'+num).value = oNA[b]
                document.getElementById('ba'+num).value = oBA[b]
                document.getElementById('ta'+num).value = oTA[b]
                document.getElementById('gstP'+num).value = oGSTP[b]
                document.getElementById('gstA'+num).value = oGSTA[b]
                document.getElementById('grA'+num).value = oGRA[b]
                document.getElementById('lrNo'+num).value = oLRNO[b]
                document.getElementById('lrDate'+num).value = oLRDATE[b]
                document.getElementById('transporter'+num).value = oTRANSPORTER[b]
                document.getElementById('status'+num).value = oSTATUS[b]
                
                //ASSIGNING SAVED INVOICE NO. TO newInvoiceNo[] FOR UPDATING INVOICE TABLE PART 2
                newInvoiceNo[num] = it.value            
            }
        }
    })
}

//---------------------------------------------------------FUNCTION TO VALIDATE EACH NEW BILL INPUT AND PERFORM ASSOCIATED OPERATIONS
function checkBill(it,num)
{
    fetch('http://localhost:7070/invoice/status/' + customer.value +'/'+supplier.value +'/'+ it.value)
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
                    customer.reportValidity()
                }
                else if(supplier.value == '')
                {
                    supplier.reportValidity()
                }
                else
                {
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
                it.setCustomValidity("Invoice No." + it.value + " has already been listed!")
                it.reportValidity()
            }
            else
            {
                document.getElementById('ta'+num).value = ''
                document.getElementById('gstP'+num).value = ''
                document.getElementById('gstA'+num).value = ''
                document.getElementById('grA'+num).value = ''
                document.getElementById('lrNo'+num).value = ''
                document.getElementById('lrDate'+num).value = new Date()
                document.getElementById('transporter'+num).value = ''
                document.getElementById('status'+num).value = ''
                document.getElementById('na'+num).value = Number(data.netAmount)
                document.getElementById('ba'+num).value = Number(data.netAmount - data.paid - data.grA)
                
                //ASSIGNING INTITAL G.R. AMOUNT TO iGRA[num]
                iGRA[num] = Number(data.grA) - Number(document.getElementById('grA'+num).value)

                //ASSIGNING SAVED INVOICE NO. TO newInvoiceNo[] FOR UPDATING INVOICE TABLE PART 2
                newInvoiceNo[num] = it.value 
            }
        }
    })
}

//---------------------------------------------------------FUNCTION TO ASSIGN G.R. BILL ASSOCIATED VARIABLES AND ARRAYS
function setBill(num)
{

    var it = document.getElementById('billNo'+num).value
    fetch('http://localhost:7070/invoice/status/' + customer.value +'/'+supplier.value +'/'+ it)
    .then( response => response.json())
    .then(data => 
    {        
        //ASSIGNING SAVED INVOICE NO. TO oldInvoiceNo[] FOR UPDATING INVOICE TABLE PART 1
        oldInvoiceNo[num] = document.getElementById('billNo'+num).value
        document.getElementById('ba'+num).value = (Number(data.netAmount - data.paid - data.grA) + Number(document.getElementById('grA'+num).value)).toFixed(2)

        //ASSIGNING SAVED INVOICE NO. TO newInvoiceNo[] FOR UPDATING INVOICE TABLE PART 2
        newInvoiceNo[num] = document.getElementById('billNo'+num).value

        //ASSIGNING INTITAL G.R. AMOUNT TO iGRA[num]
        iGRA[num] = Number(data.grA) - Number(document.getElementById('grA'+num).value)
    })
    calculateTotal()
}



//---------------------------------------------------------FUNCTION TO ASSIGN VALUE TO EACH STATUS SELECT FIELD
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
        document.getElementById('grA'+s).setCustomValidity('G.R. Amount exceeds due Invoice Amount.')
        document.getElementById('grA'+s).reportValidity()
    }
    else
    {
        document.getElementById('status'+s).value = "PENDING"   
    }
}

//---------------------------------------------------------FUNCTION TO CALCULATE GST AMOUNT
function setGST(g)
{
    var a = document.getElementById('ta'+g).value
    var b = document.getElementById('gstP'+g).value
    var c = a * b / 100
    document.getElementById('gstA'+g).value = c.toFixed(2)
}

//---------------------------------------------------------FUNCTION TO CALCULATE G.R. AMOUNT
function setGR(g)
{
    var a = document.getElementById('ta'+g).valueAsNumber
    var b = document.getElementById('gstA'+g).valueAsNumber
    var c = a + b
    document.getElementById('grA'+g).value = c.toFixed(2)
}

//---------------------------------------------------------FUCNTION TO CALCULATE TOTAL 
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

//---------------------------------------------------------NO KEYBOARD CONTROL FOR SIDE NAVIGATION
ai.tabIndex = -1;
di.tabIndex = -1;

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