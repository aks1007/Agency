var req
var p = new Array();
var paid = new Array();
var st = new Array();
var invoiceNo = new Array();

//----------------------------------------------------------------ON PAGE LOAD
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
    items.style.display = 'none'
}


//----------------------------------------------------------------FILL PAYMENT FORM AS SOON AS SERIAL NO. IS INPUT
document.getElementById('serialNo').addEventListener('input', (event)=>
{
    upload(serialNo.value)
})


//----------------------------------------------------------------TO INFORM THE USER TO FILL OUT SERIAL NO. INPUT ON FOCUS OUT IF IT IS LEFT EMPTY
document.getElementById('serialNo').addEventListener('focusout',(event)=>{
    if(serialNo.value == "")
    {
        forme.reset()
        serialNo.setCustomValidity('Please input a Voucher No.')
        serialNo.reportValidity()
    }
})


//----------------------------------------------------------------DELETE PAYMENT ON FORM SUBMISSION
document.getElementById('submitButton').addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        //DELETE FROM PAYMENTS TABLE
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

        //UPDATE INVOICE PAID AND STATUS FIELD
        rowCount = items.rows.length
        for(i=0;i<rowCount-1;i++)
        {
            if(document.getElementById('billNo'+i).value != 0)
            {
                fetch('http://localhost:7070/invoice/basic/'+ invoiceNo[i], 
                {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                    {
                        status : "PENDING",
                        paid : paid[i] - p[i]
                    }),
                })     
            }
        }

        //DELETE FROM PAYMENTS BILL TABLE
        fetch('http://localhost:7070/paymentBill/basic/'+serialNo.value,{ method: 'DELETE'})

        //DELETE FROM PAYMENTS CHEQUE TABLE
        fetch('http://localhost:7070/paymentCheque/basic/'+serialNo.value,{ method: 'DELETE'})

        //DELETE FROM PAYMENTS FTS TABLE
        fetch('http://localhost:7070/paymentFt/basic/'+serialNo.value,{ method: 'DELETE'})
    }  
})


//----------------------------------------------------------------VALIDATE EACH INPUT FIELD OF THE FORM
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


//----------------------------------------------------------------FUNCTION TO CONVERT DATA.DATE TO DD-MM-YYYY
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


//----------------------------------------------------------------FUNCTION TO RELOAD FORM(WHEN PRINT BUTTON LOOSES FOCUS)
function rl()
{
    location.reload()
}


//------------------------FUNCTION TO UPLOAD PAYMENT BILL, PAYMENT CHEQUE AND PAYMENT FT TABLES(CALLED WHEN SERIAL NO. FIELD LOOSES FOCUS) 
function upload(num)
{   
    items.style.display = 'none';
    cheques.style.display = 'none';
    fts.style.display = 'none';
    deleteAllItems()
    deleteAllCheques()
    deleteAllFts()
    if(num == "")
    {
    }
    else
    {        
        fetch('http://localhost:7070/payment/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            if(data.serialNo!=null)
            {
                serialNo.value = data.serialNo
                entryNo.value = data.entryNo
                doe.value = dateFormat(new Date(data.doe))
                dop.value = dateFormat(new Date(data.dop))
                customer.value = data.customer.toUpperCase()
                supplier.value = data.supplier.toUpperCase()
                gr.value = data.gr.toUpperCase()
                mop.value = data.mop.toUpperCase()
                ta.value = data.ta
                aa.value = data.aa
                ba.value = data.ba
                brokP.value = data.brokP
                brok.value = data.brok
                remarks.value = data.remarks                
                showAllItems() 
                showAllCheques() 
                showAllFts()
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
                localStorage.setItem('paymentNo',serialNo.value)
            }            
            else
            {
                serialNo.focus()
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


//----------------------------------------------------------------FUNCTION TO FILL PAYMENT BILLS TABLE(CALLED INSIDE UPLOAD FUNCTION)
function showAllItems()
{
    fetch('http://localhost:7070/paymentBill/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {    
            p[j] = data.PaymentBill[j].paid
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
            element2.disabled = true
            element2.value = data.PaymentBill[j].billNo
            cell1.append(element2, elementx);  

            var cell2 = row.insertCell(2)
            var element3 = document.createElement("input");
            element3.type = "number";
            element3.id = "na" + rowCount;
            element3.required = true;
            element3.placeholder = "NET AMT"
            element3.style.textAlign = "center";
            element3.setAttribute("min",0);
            element3.step = "any"; 
            element3.disabled = true;
            element3.value = data.PaymentBill[j].na
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "number";
            element4.id = "ba" + rowCount ;
            element4.required = true;
            element4.placeholder = "PENDING AMT";
            element4.style.textAlign = "center";
            element4.setAttribute("min",0)
            element4.step = "any";
            element4.disabled = true;    
            element4.value = data.PaymentBill[j].ba;
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "number";
            element5.id = "dd" + rowCount ;
            element5.disabled = true;
            element5.required = true;
            element5.placeholder = "DUE DAYS"
            element5.setAttribute("min",0)
            element5.step = "any"; 
            element5.value = data.PaymentBill[j].dd;
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5);
            var element6 = document.createElement("input");
            element6.type = "number";
            element6.id = "grl" + rowCount ;
            element6.placeholder = "G.R. LESS"
            element6.disabled = true;
            element6.setAttribute("min",0)
            element6.autocomplete = "off";
            element6.step = "any";
            element6.value = data.PaymentBill[j].grA;
            cell5.append(element6);

            var cell6 = row.insertCell(6);
            var element7 = document.createElement("input");
            element7.type = "number";
            element7.id = "rd" + rowCount ;
            element7.placeholder = "RATE DIFF";
            element7.setAttribute("min",0)
            element7.setAttribute("onfocusout","calculatePaid('rd',"+ rowCount + ")")
            element7.step = "any";
            element7.disabled = true;
            element7.value = data.PaymentBill[j].rd
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7);
            var element8 = document.createElement("input");
            element8.type = "number";
            element8.id = "cl" + rowCount ;
            element8.placeholder = "CLAIM LESS"
            element8.setAttribute("min",0)
            element8.setAttribute("onfocusout","calculatePaid('cl',"+ rowCount + ")")    
            element8.disabled = true;
            element8.value = data.PaymentBill[j].cl
            element8.autocomplete = "off";
            element8.step = "any";
            cell7.append(element8);

            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.type = "number";
            element9.id = "discP" + rowCount ;
            element9.setAttribute("onfocusout","calculateAmount('disc',"+ rowCount +")")  
            element9.disabled = true;
            element9.value = data.PaymentBill[j].discP
            element9.autocomplete = "off";
            element9.placeholder = "DISCOUNT %"
            element9.step = "any"
            element9.setAttribute("min",0)
            element9.setAttribute("max",100)
            cell8.append(element9);

            var cell9 = row.insertCell(9);
            var element10 = document.createElement("input");
            element10.type = "number";
            element10.id = "disc" + rowCount ;
            element10.placeholder = "DISCOUNT"
            element10.setAttribute("onfocusout","calculatePercentage('disc',"+ rowCount +")")
            element10.disabled = true;
            element10.value = data.PaymentBill[j].disc
            element10.step = "any";
            element10.setAttribute("min",0)
            cell9.append(element10);

            var cell10 = row.insertCell(10);
            var element11 = document.createElement("input")
            element11.type = "number";
            element11.id = "pc" + rowCount;
            element11.placeholder = "PACKAGING"
            element11.autocomplete = "off";
            element11.setAttribute("onfocusout","calculatePaid('pc',"+ rowCount + ")")    
            element11.disabled = true;
            element11.value = data.PaymentBill[j].pc
            element11.step = "any";
            element11.setAttribute("min",0)
            cell10.appendChild(element11);

            var cell11 = row.insertCell(11)
            var element12 = document.createElement("input")
            element12.type = "number";
            element12.id = "ol" + rowCount;
            element12.placeholder = "DEDUCTED"
            element12.autocomplete = "off";
            element12.setAttribute("onfocusout","calculatePaid('ol',"+ rowCount + ")")    
            element12.disabled = true;
            element12.value = data.PaymentBill[j].ol
            element12.step = "any";
            element12.setAttribute("min",0)
            cell11.appendChild(element12);

            var cell12 = row.insertCell(12)
            var element13 = document.createElement("input")
            element13.type = "number";
            element13.id = "intP" + rowCount;
            element13.placeholder = "INTEREST %"
            element13.autocomplete = "off";
            element13.setAttribute("onfocusout","calculateAmount('int',"+ rowCount +")")   
            element13.disabled = true;
            element13.value = data.PaymentBill[j].intP
            element13.step = "any";
            element13.setAttribute("min",0)
            element13.setAttribute("max",100)
            cell12.appendChild(element13);

            var cell13 = row.insertCell(13)
            var element14 = document.createElement("input")
            element14.type = "number";
            element14.id = "int" + rowCount;
            element14.placeholder = "INTEREST"
            element14.autocomplete = "off";
            element14.setAttribute("onfocusout","calculatePercentage('int',"+ rowCount +")")  
            element14.disabled = true;
            element14.value = data.PaymentBill[j].int
            element14.step = "any";
            element14.setAttribute("min",0)
            cell13.appendChild(element14);

            var cell14 = row.insertCell(14)
            var element15 = document.createElement("input")
            element15.type = "number";
            element15.id = "oa" + rowCount;
            element15.placeholder = "SURCHARGE"
            element15.autocomplete = "off";
            element15.setAttribute("onfocusout","calculatePaid('oa',"+ rowCount + ")")    
            element15.disabled = true;
            element15.value = data.PaymentBill[j].oa
            element15.step = "any";
            element15.setAttribute("min",0)
            cell14.appendChild(element15);

            var cell15 = row.insertCell(15)
            var element16 = document.createElement("input")
            element16.type = "number";
            element16.id = "paid" + rowCount;
            element16.placeholder = "PAID AMT"
            element16.autocomplete = "off";
            element16.required = true;
            element16.disabled = true;
            element16.value = data.PaymentBill[j].paid
            element16.step = "any";
            element16.setAttribute("min",0);
            element15.setAttribute("onfocusout","calculatePaid('paid',"+ rowCount + ")")
            cell15.appendChild(element16);

            var cell16 = row.insertCell(16);
            var element17 = document.createElement("select");
            element17.style.width = "110%";
            element17.id = "status" + rowCount ;
            element17.autocomplete = "off";
            element17.setAttribute("onkeydown","nextRow(event," + rowCount + ",'items')")
            element17.setAttribute("onfocusout","calculateTotal();")
            var op1 = document.createElement("option")
            var op2 = document.createElement("option")
            var op3 = document.createElement("option")
            op1.id = "P" + rowCount;
            op2.id = "S" + rowCount;
            op3.id = "O" + rowCount;
            op1.text = "PENDING";
            op2.text = "SETTLED";
            op3.text = "ON ACCOUNT"
            op1.value = "PENDING";
            op2.value = "SETTLED";
            op3.value = "ON ACCOUNT";
            element17.add(op1);
            element17.add(op2);
            element17.add(op3);
            element17.disabled = true;
            element17.value = data.PaymentBill[j].status
            cell16.appendChild(element17); 

            checkBill(rowCount)
        }
    })           
}


//----------------------------------------------------------------FUNCTION TO DELETE ALL PAYMENT BILL ROWS(CALLED INSIDE UPLOAD FUNCTION)
function deleteAllItems()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}


//----------------------------------------------------------------FUNCTION TO ASSIGN BILL NO., PAID AMOUNT , AND STATUS (CALLED INSIDE SHOWALLITEMS FUNCTION)
function checkBill(num)
{
    var it = document.getElementById('billNo'+num).value
    if(it!=0)
    {
        fetch('http://localhost:7070/invoice/status/' + customer.value +'/'+supplier.value +'/'+ it)
        .then( response => response.json())
        .then(data => 
        {        
            invoiceNo[num] = data.serialNo
            paid[num] = Number(data.paid)
            st[i] = "PENDING"
        })
    }
}


//----------------------------------------------------------------FUNCTION TO FILL PAYMENT CHEQUES TABLE(CALLED INSIDE UPLOAD FUNCTION)
function showAllCheques()
{
    fetch('http://localhost:7070/paymentCheque/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(i=0;i<data.count;i++)
        {
            cheques.style.display = "inline-table"

            var rowCount = cheques.rows.length-1
    
            var row = cheques.insertRow(rowCount+1)
    
            row.className = "List"
    
            var cell0 = row.insertCell(0);
            var element1 = document.createElement("input");
            element1.type = "number";
            element1.id = "cId" + rowCount ;
            element1.style.textAlign = "center";
            element1.disabled = true;
            element1.value = data.PaymentCheque[i].cId
            cell0.appendChild(element1);
    
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.type = "number";
            element2.id = "cNo" + rowCount ;
            element2.placeholder = "CHEQUE NO.";
            element2.autocomplete = "off";
            element2.disabled = true;
            element2.value = data.PaymentCheque[i].cNo
            cell1.appendChild(element2);    
    
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "date";
            element3.id = "cDate" + rowCount ;
            element3.style.textAlign = "center";
            element3.disabled = true;
            element3.value = dateFormat(new Date(data.PaymentCheque[i].cDate))
            cell2.appendChild(element3);
    
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "text";
            element4.id = "cBank" + rowCount ;
            element4.placeholder = "BANK"
            element4.autocomplete = "off";  
            element4.setAttribute("list", "banksList")
            element4.setAttribute("onfocus", "showBanks()")
            element4.setAttribute("oninput", "showBanks()")
            element4.setAttribute("onfocusout","checkBank("+"cBank"+ rowCount + ")")
            element4.autocomplete = "off";
            var elementx = document.createElement("datalist");
            elementx.id = "banksList";
            element4.disabled = true;
            element4.value = data.PaymentCheque[i].bank 
            cell3.append(element4,elementx);
    
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "number";
            element5.id = "cAmount" + rowCount ;
            element5.placeholder = "AMOUNT"
            element5.setAttribute("min",0)
            element5.autocomplete = "off";
            element5.step = "any";
            element5.setAttribute("onkeydown","nextRow(event," + rowCount + ",'cheques')")
            element5.setAttribute("onfocusout","calculatePayAmt()")
            element5.disabled = true;
            element5.value = data.PaymentCheque[i].cAmount
            cell4.append(element5);
        }
    })   
}


//----------------------------------------------------------------FUNCTION TO DELETE ALL ROWS IN PAYMENT CHEQUE TABLE(CALLED INSIDE UPLOAD FUNCTION)
function deleteAllCheques()
{
    var table = document.getElementById("cheques");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}


//----------------------------------------------------------------FUNCTION TO FILL PAYMENT FTS TABLE(CALLED INSIDE UPLOAD FUNCTION)
function showAllFts()
{
    fetch('http://localhost:7070/paymentFt/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(i=0;i<data.count;i++)
        {
            fts.style.display = "inline-table"

            var rowCount = fts.rows.length-1
    
            var row = fts.insertRow(rowCount+1)
    
            row.className = "List"
    
            var cell0 = row.insertCell(0);
            var element1 = document.createElement("input");
            element1.type = "number";
            element1.id = "ftId" + rowCount ;
            element1.style.textAlign = "center";
            element1.disabled = true;
            element1.value = data.PaymentFt[i].ftId
            cell0.appendChild(element1);
    
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.type = "number";
            element2.id = "utrNo" + rowCount ;
            element2.placeholder = "CHEQUE NO.";
            element2.autocomplete = "off";
            element2.disabled = true;
            element2.value = data.PaymentFt[i].utrNo
            cell1.appendChild(element2);    
    
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "date";
            element3.id = "ftDate" + rowCount ;
            element3.style.textAlign = "center";
            element3.disabled = true;
            element3.value = dateFormat(new Date(data.PaymentFt[i].ftDate))
            cell2.appendChild(element3);
    
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "text";
            element4.id = "ftBank" + rowCount ;
            element4.placeholder = "BANK"
            element4.autocomplete = "off";  
            element4.setAttribute("list", "banksList")
            element4.setAttribute("onfocus", "showBanks()")
            element4.setAttribute("oninput", "showBanks()")
            element4.setAttribute("onfocusout","checkBank("+"cBank"+ rowCount + ")")
            element4.autocomplete = "off";
            var elementx = document.createElement("datalist");
            elementx.id = "banksList";
            element4.disabled = true;
            element4.value = data.PaymentFt[i].bank 
            cell3.append(element4,elementx);
    
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "number";
            element5.id = "ftAmount" + rowCount ;
            element5.placeholder = "AMOUNT"
            element5.setAttribute("min",0)
            element5.autocomplete = "off";
            element5.step = "any";
            element5.setAttribute("onkeydown","nextRow(event," + rowCount + ",'cheques')")
            element5.setAttribute("onfocusout","calculatePayAmt()")
            element5.disabled = true;
            element5.value = data.PaymentFt[i].ftAmount
            cell4.append(element5);
        }
    })   
}


//----------------------------------------------------------------FUNCTION TO DELETE ALL ROWS IN PAYMENT FT TABLE(CALLED INSIDE UPLOAD FUNCTION)
function deleteAllFts()
{
    var table = document.getElementById("fts");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}