var req
var p = new Array();
var paid = new Array();
var iPaid = new Array();
var st = new Array();
var invoiceNo = new Array();
var uBill = new Array();
var uBpaid = new Array();


//----------------------------------------------------------------ON PAGE LOAD
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
    var check = sessionStorage.getItem('paymentKey')
    if(check == null)
    {
        upload(1)
    }
    else
    {            
        document.getElementById('serialNo').value = check
        upload(check)
        sessionStorage.removeItem('paymentKey')
    } 
}


//----------------------------------------------------------------FILL PAYMENT FORM AS SOON AS SERIAL NO. IS INPUT
document.getElementById('serialNo').addEventListener('input', (event)=>
{
    upload(serialNo.value)
    grs.style.display = 'none'
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


//----------------------------------------------------------------FUNCTION TO PRINT PAYMENT
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('paymentBack',1)
    window.location = "./paymentPrint.html"
})


//----------------------------------------------------------------DELETE PAYMENT ON FORM SUBMISSION
document.getElementById('submitButton').addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    else if(ba.value > 0)
    {
        event.preventDefault()
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "Adjusted Amount is less than Payment Amount. Add ₹" + ba.value
        setTimeout(function(){ x.className = x.className.replace("showError", "")}, 5000);
    }
    else if(ba.value < 0)
    {
        event.preventDefault()
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "Adjusted Amount is more than Payment Amount. Subtract ₹" + Math.abs(ba.value)
        setTimeout(function(){ x.className = x.className.replace("showError", "")}, 5000);
    }
    else if(req==0 & ba.value==0)
    {
        event.preventDefault()
        //DELETE FROM PAYMENTS TABLE
        fetch('http://localhost:7070/payment/basic/'+ serialNo.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                serialNo : serialNo.value,
                entryNo : entryNo.value,
                doe : doe.value,
                dop : dop.value,
                customer : customer.value.toUpperCase(),
                supplier : supplier.value.toUpperCase(),
                gr : gr.value,
                mop : mop.value,
                ta :ta.value,
                aa : aa.value,
                ba : ba.value,
                brokP : brokP.value,
                brok : brok.value,
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

        //DELETE FROM PAYMENTS BILL TABLE
        fetch('http://localhost:7070/paymentBill/basic/'+serialNo.value,{ method: 'DELETE'})

        //DELETE FROM PAYMENTS CHEQUE TABLE
        fetch('http://localhost:7070/paymentCheque/basic/'+serialNo.value,{ method: 'DELETE'})
        .then( data => 
        {
            //ADD TO PAYMENTS CHEQUE TABLE
            var cRow = cheques.rows.length-1
            for(i=0;i<cRow;i++)
            {
                fetch('http://localhost:7070/paymentCheque',{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body : JSON.stringify(
                    {
                        serialNo : serialNo.value,
                        cId : document.getElementById('cId'+i).value,
                        cNo : document.getElementById('cNo'+i).value,
                        cDate : document.getElementById('cDate'+i).value,
                        bank : document.getElementById('cBank'+i).value,
                        cAmount : document.getElementById('cAmount'+i).value,
                    })
                })
                .catch((error) => console.error(error))
            }
        })

        //DELETE FROM PAYMENTS FTS TABLE
        fetch('http://localhost:7070/paymentFt/basic/'+serialNo.value,{ method: 'DELETE'})
        .then( data => 
        {
            //ADD TO PAYMENTS FT TABLE
            var ftRow = fts.rows.length-1            
            for(j=0;j<ftRow;j++)
            {
                fetch('http://localhost:7070/paymentFt',{
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body : JSON.stringify(
                    {
                        serialNo : serialNo.value,
                        ftId : document.getElementById('ftId'+j).value,
                        utrNo : document.getElementById('utrNo'+j).value,
                        ftDate : document.getElementById('ftDate'+j).value,
                        bank : document.getElementById('ftBank'+j).value,
                        ftAmount : document.getElementById('ftAmount'+j).value,
                    })
                })
                .catch((error) => console.error(error))
            }
        })

        //UPDATE INVOICE PAID AND STATUS FIELD PART 1
        rc1 = items.rows.length - 1
        for(k=0;k<rc1;k++)
        {   
            if(uBill[k] != 0)
            {
                fetch('http://localhost:7070/invoice/basic/'+ uBill[k], 
                {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                    {
                        status : "PENDING",
                        paid : iPaid[k]
                    }),
                })
                .catch((error) => console.error(error))    
            }
        }

        //UPDATE INVOICE PAID AND STATUS FIELD PART 2
        var rc2 = items.rows.length - 1
        for(l=0;l<rc2;l++)
        {   console.log(l,st[l],iPaid[l],paid[l])
            if(document.getElementById('billNo'+l).value != 0)
            {
                fetch('http://localhost:7070/invoice/basic/'+ invoiceNo[l], 
                {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(
                    {
                        status : st[l],
                        paid : iPaid[l] + paid[l]
                    }),
                })
                .catch((error) => console.error(error))
            }
        }

        //ADD TO PAYMENTS BILL TABLE
        var table = document.getElementById('items')
        var rowCount = table.rows.length - 1
        for(m=0;m<rowCount;m++)
        { 
            fetch('http://localhost:7070/paymentBill',{
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body : JSON.stringify({
                    serialNo : serialNo.value,
                    id : document.getElementById('id'+m).value,
                    billNo : document.getElementById('billNo'+m).value,
                    na : document.getElementById('na'+m).value,
                    ba : document.getElementById('ba'+m).value,
                    dd : document.getElementById('dd'+m).value,
                    grA : document.getElementById('grl'+m).value,
                    rd : document.getElementById('rd'+m).value,
                    cl : document.getElementById('cl'+m).value,
                    discP : document.getElementById('discP'+m).value,
                    disc : document.getElementById('disc'+m).value,
                    pc : document.getElementById('pc'+m).value,
                    ol : document.getElementById('ol'+m).value,
                    intP : document.getElementById('intP'+m).value,
                    int : document.getElementById('int'+m).value,
                    oa : document.getElementById('oa'+m).value,
                    paid : document.getElementById('paid'+m).value,
                    status : document.getElementById('status'+m).value,
                    customer : document.getElementById('customer').value.toUpperCase(),
                    supplier : document.getElementById('supplier').value.toUpperCase()
                })
            })
            .catch((error) =>
            {
                console.error(error)
            })
        }
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
                printButton.disabled = false               
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
                printButton.disabled = true
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
            element1.id = "id" + rowCount ;
            element1.valueAsNumber = rowCount+1;
            element1.style.textAlign = "center";
            element1.disabled = true;
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
            element2.setAttribute("onfocusout","lastRow('billNo" + rowCount + "'," + rowCount + ",'items');"+"checkOldBill(billNo" + rowCount + "," + rowCount + ")")
            element2.autocomplete = "off";
            var elementx = document.createElement("datalist");
            elementx.id = "billList"; 
            element2.setAttribute("min",1)
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
            element7.value = data.PaymentBill[j].rd
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7);
            var element8 = document.createElement("input");
            element8.type = "number";
            element8.id = "cl" + rowCount ;
            element8.placeholder = "CLAIM LESS"
            element8.setAttribute("min",0)
            element8.setAttribute("onfocusout","calculatePaid('cl',"+ rowCount + ")")    
            element8.value = data.PaymentBill[j].cl
            element8.autocomplete = "off";
            element8.step = "any";
            cell7.append(element8);

            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.type = "number";
            element9.id = "discP" + rowCount ;
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
            element16.value = data.PaymentBill[j].paid
            element16.step = "any";
            element16.setAttribute("min",0);
            element15.setAttribute("onfocusout","calculatePaid('paid',"+ rowCount + ")")
            cell15.appendChild(element16);
            var ind = element2.value
            uBpaid[element2.value] = data.PaymentBill[j].paid

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
            element17.value = data.PaymentBill[j].status
            cell16.appendChild(element17);

            setBill(rowCount)
        }
        addGR()
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


//----------------------------------------------------------------FUNCTION TO ASSIGN INITIAL VALUES TO INVOICE ARRAYS
function setBill(num)
{
    var it = document.getElementById('billNo'+num).value
    uBill[num] = it
    if(it!=0)
    {
        fetch('http://localhost:7070/invoice/status/' + customer.value +'/'+supplier.value +'/'+ it)
        .then( response => response.json())
        .then(data => 
        {        
            invoiceNo[num] = data.serialNo
            iPaid[num] = Number(data.paid) - p[num]
            paid[num] = Number(document.getElementById('paid'+num).value)
            st[num] = document.getElementById('status'+num).value
            document.getElementById('ba'+num).value = Number(data.netAmount - data.grA - data.paid + document.getElementById('paid'+num).value)
        })
    }
}


//---------------------------------------------------------------DISPLAYING ALL RELEVANT INVOICE NOs IN BILL DATALIST
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
        var options = '<option value=0>0</option>'

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
        document.getElementById('gr').disabled = true
    })
    .catch(error =>{
        error.message
    })   
}

function chooseCheck(it,num)
{
    var size = uBill.length
    var x = 1
    for(i=0;i<size;i++)
    {
        if(it.value == uBill[i])
        {
            x = 0
        }
    }
    if(x == 0)
    {
        document.getElementById('billNo'+num).setAttribute("onfocusout","lastRow('billNo" + num + "'," + num + ",'items');"+"checkOldBill(billNo" + num + "," + num + ")")
    }
    else
    {
        document.getElementById('billNo'+num).setAttribute("onfocusout","lastRow('billNo" + num + "'," + num + ",'items');"+"checkBill(billNo" + num + "," + num + ")")
    }
}


//---------------------------------------------------------------SETTING INVOICE ROW VALUES BASED ON INVOICE NO. FOR PREVIOUSLY RECORDED INVOICES
function checkOldBill(it,num)
{   
    document.getElementById('na'+num).value = 0;
    document.getElementById('ba'+num).value = 0;
    document.getElementById('dd'+num).value = 0;
    document.getElementById('grl'+num).value = 0;
    document.getElementById('rd'+num).disabled = false
    document.getElementById('cl'+num).disabled = false
    document.getElementById('discP'+num).disabled = false
    document.getElementById('disc'+num).disabled = false
    document.getElementById('pc'+num).disabled = false
    document.getElementById('ol'+num).disabled = false
    document.getElementById('intP'+num).disabled = false
    document.getElementById('int'+num).disabled = false
    document.getElementById('oa'+num).disabled = false
    document.getElementById('status'+num).value = "PENDING"
    document.getElementById('status'+num).readOnly = true
    var op = document.getElementById('status'+num).getElementsByTagName('option')
    for(i=0;i<op.length;i++)
    {
        op[i].disabled = false
    }

    fetch('http://localhost:7070/invoice/status/' + customer.value +'/'+supplier.value +'/'+ it.value)
    .then( response => response.json())
    .then(data => 
    {        
        if(data.code != 200)
        {
            if(customer.value == '')
            {
                customer.reportValidity()
            }
            else if(supplier.value == '')
            {
                customer.reportValidity()
                supplier.reportValidity()
            }
            else if(it.value == '')
            {
                it.setCustomValidity('')
                it.reportValidity()
            }
            else if(it.value == 0)
            {   
                it.setCustomValidity("")
                rowCount = items.rows.length - 1
                var ok
                for(j=0;j<rowCount;j++)
                {
                    if(document.getElementById('billNo'+j).value == 0 & num != j)
                    {
                        ok = 0
                    }
                }
                if(ok != 0)
                {   
                    document.getElementById('rd'+num).setAttribute('onfocusout','')           
                    document.getElementById('paid'+num).focus()
                    document.getElementById('rd'+num).disabled = true
                    document.getElementById('cl'+num).disabled = true
                    document.getElementById('discP'+num).disabled = true
                    document.getElementById('disc'+num).disabled = true
                    document.getElementById('pc'+num).disabled = true
                    document.getElementById('ol'+num).disabled = true
                    document.getElementById('intP'+num).disabled = true
                    document.getElementById('int'+num).disabled = true
                    document.getElementById('oa'+num).disabled = true
                    document.getElementById('status'+num).value = "ON ACCOUNT"
                    document.getElementById('status'+num).readOnly = true
                    var op = document.getElementById('status'+num).getElementsByTagName('option')
                    for(i=0;i<op.length;i++)
                    {
                        op[i].disabled = true
                    }
                }
                else
                {
                    it.setCustomValidity("On Account has already been listed.")
                    it.reportValidity()
                }
            }
            else
            {
                it.setCustomValidity("Invoice No. " + it.value + " does not exist.")
                it.reportValidity()
            }
        }
        else if(data.code == 200)
        {            
            it.setCustomValidity('')
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
                it.setCustomValidity("Invoice No. " + it.value + " has already been listed.")
                it.reportValidity()
            }
            else
            {
                var ind = document.getElementById('billNo'+num).value
                document.getElementById('paid'+num).value = uBpaid[ind]
                document.getElementById("na"+num).value = (data.netAmount).toFixed(2)
                document.getElementById("ba"+num).value = Number(data.netAmount - data.grA - data.paid + document.getElementById("paid"+num).value).toFixed(2)                
                document.getElementById('grl'+num).value = (data.grA).toFixed(2)
                document.getElementById('dd'+num).value = (new Date(dop.value) - new Date(data.date))/86400000
                document.getElementById('status'+num).value = "SETTLED"
                addGR()
                invoiceNo[num] = data.serialNo
                paid[num] = document.getElementById("paid"+num).valueAsNumber  
                st[num] = document.getElementById('status'+num).value
            }
        }
    })
}


//---------------------------------------------------------------SETTING INVOICE ROW VALUES BASED ON INVOICE NO.
function checkBill(it,num)
{
    document.getElementById('na'+num).value = 0;
    document.getElementById('ba'+num).value = 0;
    document.getElementById('dd'+num).value = 0;
    document.getElementById('grl'+num).value = 0;
    document.getElementById('paid'+num).value = 0; 
    document.getElementById('rd'+num).disabled = false
    document.getElementById('cl'+num).disabled = false
    document.getElementById('discP'+num).disabled = false
    document.getElementById('disc'+num).disabled = false
    document.getElementById('pc'+num).disabled = false
    document.getElementById('ol'+num).disabled = false
    document.getElementById('intP'+num).disabled = false
    document.getElementById('int'+num).disabled = false
    document.getElementById('oa'+num).disabled = false
    document.getElementById('status'+num).value = "PENDING"
    document.getElementById('status'+num).readOnly = true
    var op = document.getElementById('status'+num).getElementsByTagName('option')
    for(i=0;i<op.length;i++)
    {
        op[i].disabled = false
    }

    fetch('http://localhost:7070/invoice/bill/' + customer.value +'/'+supplier.value +'/'+ it.value)
    .then( response => response.json())
    .then(data => 
    {        
        if(data.code != 200)
        {
            if(customer.value == '')
            {
                customer.reportValidity()
            }
            else if(supplier.value == '')
            {
                customer.reportValidity()
                supplier.reportValidity()
            }
            else if(it.value == '')
            {
                it.setCustomValidity('')
                it.reportValidity()
            }
            else if(it.value == 0)
            {
                it.setCustomValidity("")
                rowCount = items.rows.length - 1
                var ok
                for(j=0;j<rowCount;j++)
                {
                    if(document.getElementById('billNo'+j).value == 0 & num != j)
                    {
                        ok = 0
                    }
                }
                if(ok != 0)
                {               
                    document.getElementById('paid'+num).select()
                    document.getElementById('rd'+num).disabled = true
                    document.getElementById('cl'+num).disabled = true
                    document.getElementById('discP'+num).disabled = true
                    document.getElementById('disc'+num).disabled = true
                    document.getElementById('pc'+num).disabled = true
                    document.getElementById('ol'+num).disabled = true
                    document.getElementById('intP'+num).disabled = true
                    document.getElementById('int'+num).disabled = true
                    document.getElementById('oa'+num).disabled = true
                    document.getElementById('status'+num).value = "ON ACCOUNT"
                    document.getElementById('status'+num).readOnly = true
                    var op = document.getElementById('status'+num).getElementsByTagName('option')
                    for(i=0;i<op.length;i++)
                    {
                        op[i].disabled = true
                    }
                }
                else
                {
                    it.setCustomValidity("On Account has already been listed.")
                    it.reportValidity()
                }
            }
            else
            {
                it.setCustomValidity("Invoice No. " + it.value + " does not exist.")
                it.reportValidity()
            }
        }
        else if(data.code == 200)
        {            
            it.setCustomValidity('')
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
                it.setCustomValidity("Invoice No. " + it.value + " has already been listed.")
                it.reportValidity()
            }
            else
            {
                document.getElementById("na"+num).value = (data.netAmount).toFixed(2)
                document.getElementById("ba"+num).value = (data.netAmount - data.grA - data.paid).toFixed(2)                
                document.getElementById('grl'+num).value = (data.grA).toFixed(2)
                document.getElementById("paid"+num).value = (data.netAmount - data.grA - data.paid).toFixed(2)
                document.getElementById('dd'+num).value = (new Date(dop.value) - new Date(data.date))/86400000
                document.getElementById('status'+num).value = "SETTLED"
                addGR()
                invoiceNo[num] = data.serialNo
                paid[num] = document.getElementById("paid"+num).valueAsNumber  
                st[num] = document.getElementById('status'+num).value
            }
        }
    })
}


//---------------------------------------------------------------DISPLAYING ALL CUSTOMER'S NAMES TO CUSTOMER DATALIST
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


//---------------------------------------------------------------VALIDATING CUSTOMER NAME AFTER CUSTOMER INPUT FIELD LOOSES FOCUS
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
                customer.setCustomValidity('')
                customer.reportValidity()
            }
            else
            {
                customer.setCustomValidity(customer.value + " is not a Customer.")
                customer.reportValidity()
            }
        }
    })
}


//---------------------------------------------------------------DISPLAYING ALL SUPPLIER NAMES TO SUPPLIER DATALIST
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


//---------------------------------------------------------------VALIDATING THE SUPPLIER NAME WHEN SUPPLIER INPUT FIELD LOOSES FOCUS
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
                if(customer.checkValidity)            
                { 
                    customer.reportValidity() 
                }
                else
                {
                    supplier.setCustomValidity('')
                    supplier.reportValidity()
                } 
            }
            else
            {
                supplier.setCustomValidity(supplier.value + " is not a Supplier.")
                supplier.reportValidity()
            }

        }
    })
}


//---------------------------------------------------------------DISPLAYING ALL BANKS IN BANK DATA LIST
function showBanks()
{
    fetch('http://localhost:7070/bank')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Bank[i].bank + '">' + data.Bank[i].bank + '</option>'
        }
        document.getElementById('banksList').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}


//---------------------------------------------------------------VALIDATE BANK NAME WHEN BANK INPUT FIELD LOOSES FOCUS
function checkBank(b)
{
    fetch('http://localhost:7070/bank/' + b.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(b.value == '')
            {

            }
            else
            {
                b.setCustomValidity(b.value + " is not a Bank.")
                b.reportValidity()
            }

        }
    })
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
            element2.value = data.PaymentCheque[i].cNo
            cell1.appendChild(element2);    
    
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "date";
            element3.id = "cDate" + rowCount ;
            element3.style.textAlign = "center";
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
            element2.value = data.PaymentFt[i].utrNo
            cell1.appendChild(element2);    
    
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "date";
            element3.id = "ftDate" + rowCount ;
            element3.style.textAlign = "center";
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
            element5.setAttribute("onkeydown","nextRow(event," + rowCount + ",'fts')")
            element5.setAttribute("onfocusout","calculatePayAmt()")
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


//---------------------------------------------------------------ADDING A NEW ROW TO CHEQUE TABLE
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
    element1.id = "cId" + rowCount ;
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
    cell4.append(element5);

    element3.valueAsDate = new Date()
}


//---------------------------------------------------------------DELETING LAST ROW OF CHEQUE ROW
function deleteCheque()
{
    var table = document.getElementById("cheques");    
    var rowCount = table.rows.length;
    if(rowCount>1)
    {
        table.deleteRow(rowCount-1);
    }
}


//---------------------------------------------------------------ADDING A NEW ROW TO FT TABLE
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
    element1.id = "ftId" + rowCount ;
    element1.valueAsNumber = rowCount+1;
    element1.style.textAlign = "center";
    cell0.appendChild(element1);

    var cell1 = row.insertCell(1);
    var element2 = document.createElement("input");
    element2.type = "text";
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
    element4.type = "text";
    element4.id = "ftBank" + rowCount ;
    element4.placeholder = "BANK"
    element4.autocomplete = "off"; 
    element4.setAttribute("list", "banksList")
    element4.setAttribute("onfocus", "showBanks()")
    element4.setAttribute("oninput", "showBanks()")
    element4.setAttribute("onfocusout","checkBank("+"ftBank"+ rowCount + ")")
    element4.autocomplete = "off";
    var elementx = document.createElement("datalist");
    elementx.id = "banksList"
    cell3.append(element4,elementx);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "number";
    element5.id = "ftAmount" + rowCount ;
    element5.placeholder = "AMOUNT"
    element5.setAttribute("min",0)
    element5.autocomplete = "off";
    element5.step = "any";
    element5.setAttribute("onkeydown","nextRow(event," + rowCount + ",'fts')")
    element5.setAttribute("onfocusout","calculatePayAmt()")
    cell4.append(element5);

    element3.valueAsDate = new Date()
}


//---------------------------------------------------------------DELETING LAST ROW OF FT TABLE
function deleteFt()
{
    var table = document.getElementById("fts");    
    var rowCount = table.rows.length;
    if(rowCount>1)
    {   
        table.deleteRow(rowCount-1);
    }
}


//---------------------------------------------------------------ADDING NEW ROW TO INVOICE TABLE
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
    element2.setAttribute("onfocusout","lastRow('billNo" + rowCount + "'," + rowCount + ",'items');"+"checkBill(billNo" + rowCount + "," + rowCount + ")")
    element2.autocomplete = "off";
    var elementx = document.createElement("datalist");
    elementx.id = "billList"; 
    element2.setAttribute("min",1)
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
    element3.value = 0;
    element3.disabled = true;
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
    element4.value = 0;
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
    element5.value = 0;
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
    element6.value = 0;
    cell5.append(element6);

    var cell6 = row.insertCell(6);
    var element7 = document.createElement("input");
    element7.type = "number";
    element7.id = "rd" + rowCount ;
    element7.placeholder = "RATE DIFF";
    element7.setAttribute("min",0)
    element7.setAttribute("onfocusout","calculatePaid('rd',"+ rowCount + ")")
    element7.step = "any";
    element7.value = 0;
    cell6.appendChild(element7);

    var cell7 = row.insertCell(7);
    var element8 = document.createElement("input");
    element8.type = "number";
    element8.id = "cl" + rowCount ;
    element8.placeholder = "CLAIM LESS"
    element8.setAttribute("min",0)
    element8.setAttribute("onfocusout","calculatePaid('cl',"+ rowCount + ")")    
    element8.value = 0;
    element8.autocomplete = "off";
    element8.step = "any";
    cell7.append(element8);

    var cell8 = row.insertCell(8);
    var element9 = document.createElement("input");
    element9.type = "number";
    element9.id = "discP" + rowCount ;
    element9.setAttribute("onfocusout","calculateAmount('disc',"+ rowCount +")")  
    element9.value = 0;
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
    element10.value = 0;
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
    element11.value = 0;
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
    element12.value = 0;
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
    element13.value = 0;
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
    element14.value = 0;
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
    element15.value = 0;
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
    element16.value = 0
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
    cell16.appendChild(element17); 
    // calculateTotal()
}


//---------------------------------------------------------------DELETING THE LAST INVOICE TABLE ROW
function deleteItem()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;  
    var x = rowCount - 2
    if(rowCount>1)
    {        
        table.deleteRow(rowCount-1);
        addGR()
    }
    if(rowCount == 2)
    {
        addItem()
    }
    calculateTotal()
}


//---------------------------------------------------------------ADDING G.R. DATA TO G.R. TABLE BASED ON PAYMENT INVOICES
function addGR()
{   
    var c = customer.value
    var s = supplier.value
    var rc = items.rows.length-1
    deleteAllGR()
    for(i=0;i<rc;i++)
    {   
        var clear = 1
        var b = Number(document.getElementById('billNo'+i).value)
        fetch('http://localhost:7070/goodsReturnBill/bill/'+c+'/'+s+'/'+b)
        .then(response => response.json())
        .then(data =>{

            for(j = 0; j < data.count; j++)
            {            
                grs.style.display = 'inline-table';
                var table = document.getElementById('grs')

                var rowCount = table.rows.length-1
            
                var row = table.insertRow(rowCount+1)
            
                row.className = "List"

                var cell0 = row.insertCell(0);
                var element1 = document.createElement("input");
                element1.type = "number";
                element1.id = "grId"+ rowCount ;
                element1.disabled = true;
                element1.valueAsNumber = data.GoodsReturnBill[j].serialNo;
                element1.style.textAlign = "center";
                cell0.appendChild(element1);
            
                var cell1 = row.insertCell(1);
                var element2 = document.createElement("input");
                element2.id = "grBNo" + rowCount
                element2.type = "number";
                element2.disabled = true;
                element2.value = data.GoodsReturnBill[j].billNo
                cell1.appendChild(element2);    
            
                var cell2 = row.insertCell(2);
                var element3 = document.createElement("input");
                element3.type = "number";
                element3.disabled = true;
                element3.value =  data.GoodsReturnBill[j].ba
                cell2.appendChild(element3);
            
                var cell3 = row.insertCell(3);
                var element4 = document.createElement("input");
                element4.type = "number";
                element4.disabled = true;
                element4.value = data.GoodsReturnBill[j].ta
                cell3.appendChild(element4);
            
                var cell4 = row.insertCell(4);
                var element5 = document.createElement("input");
                element5.type = "numbers";
                element5.disabled = true;
                element5.value = data.GoodsReturnBill[j].gstP
                cell4.append(element5);
            
                var cell5 = row.insertCell(5);
                var element6 = document.createElement("input");
                element6.type = "number";
                element6.disabled = true;
                element6.value = data.GoodsReturnBill[j].gstA
                cell5.appendChild(element6);
            
                var cell6 = row.insertCell(6);
                var element7 = document.createElement("input");
                element7.type = "number";
                element7.disabled = true;
                element7.value = data.GoodsReturnBill[j].grA
                cell6.append(element7);
            
                var cell7 = row.insertCell(7);
                var element8 = document.createElement("input");
                element8.type = "number";
                element8.disabled = true;
                element8.value = data.GoodsReturnBill[j].lrNo
                cell7.append(element8);
            
                var cell8 = row.insertCell(8);
                var element9 = document.createElement("input");
                element9.type = "date";
                element9.disabled = true;
                element9.value = dateFormat(new Date(data.GoodsReturnBill[j].lrDate))
                cell8.append(element9);
            
                var cell9 = row.insertCell(9);
                var element10 = document.createElement("input")
                element10.type = "text";
                element10.disabled = true;
                element10.value = data.GoodsReturnBill[j].transporter
                cell9.appendChild(element10);
            
                var cell10 = row.insertCell(10);
                var element11 = document.createElement("input");
                element11.style.width = "100%";
                element11.disabled = true;
                element11.value = data.GoodsReturnBill[j].status
                cell10.appendChild(element11);
            }
        })
    }   
}


//---------------------------------------------------------------DELETING ALL G.R. ROWS
function deleteAllGR()
{   
    var rowCount = grs.rows.length-1
    for(i=rowCount;i>0;i--)
    {
        grs.deleteRow(i)
    }
    grs.style.display = "none"
}


//---------------------------------------------------------------CALCULATING TOTAL ADJUSTED AND BALANCE AMOUNTS
function calculateTotal()
{
    var rowCount = items.rows.length - 1
    var adjAmt = 0
    for(i=0;i<rowCount;i++)
    {
        adjAmt += Number(document.getElementById('paid'+i).value)
    }
    aa.value = adjAmt.toFixed(2)
    ba.value = (ta.value - aa.value).toFixed(2)
}


//---------------------------------------------------------------SETTING INVOICE STATUS TO SETTLED IF PAID IN FULL
function setStatus(it,s)
{
    var a = document.getElementById('paid'+s).value
    var b = document.getElementById('ba'+s).value
    var c = b-a
    if(a == '')
    {
        calculatePaid(s)  
    }
    else if(c==0)
    {
        document.getElementById('status'+s).value = "SETTLED"
    }
    else if(c<0)
    {
        document.getElementById(it+s).setCustomValidity('Paid Amount can not exceed Due Invoice Amount.')
        document.getElementById(it+s).reportValidity()
    }
    else if(a<0)
    {
        document.getElementById(it+s).setCustomValidity('Paid Amount can not be less than 0.')
        document.getElementById(it+s).reportValidity()
    }
    else
    {
        document.getElementById('status'+s).value = "PENDING"   
    }
    st[s] = document.getElementById('status'+s).value
    paid[s] = document.getElementById('paid'+s).value
    invoiceNo[s] = document.getElementById('billNo'+s).value
}


//---------------------------------------------------------------ADDING NEXT ROW OF EACH TABLE WHEN LAST INPUT FIELD LOOSES FOCUS
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


//---------------------------------------------------------------DELETING LAST UNREQUIRED ROW FROM EACH TABLE
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


//---------------------------------------------------------------DISPLAYING CHEQUE AND FT TABLES BASED ON MODE OF PAYMENT
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
        ta.disabled = false
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


//---------------------------------------------------------------CREATING REMOTE WINDOW FOR RECORDING GOODS RETURNS
document.getElementById('gr').addEventListener('change',() =>{
    var x = document.getElementById('gr').value
    if(x == "YES")
    {  
        document.getElementById('gr').disabled = true      
        localStorage.setItem('grWindow', 'true')
        localStorage.setItem('grCustomer', customer.value)
        localStorage.setItem('grSupplier', supplier.value)
        localStorage.setItem('grDate', dop.valueAsDate)

        var address = 'source/remote/goodsReturn/goodsReturnNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})


//---------------------------------------------------------------DISABLING PAYMENT AMOUNT INPUT FIELD IF MODE OF PAYMENT IS NOT CASH
document.getElementById('mop').addEventListener('focusout',() => {
    var x = document.getElementById('mop').value
    if (x == "CASH")
    {
        document.getElementById('ta').disabled = false
    }
    else
    {
        document.getElementById('ta').disabled = true
        document.getElementById('ta').valueAsNumber = 0  
    }
})


//---------------------------------------------------------------CALCULATING TOTAL AMOUNT OF PAYMENT
function calculatePayAmt()
{
    r1 = cheques.rows.length-1
    r2 = fts.rows.length-1
    var ca = 0
    var fa = 0
    for(i=0;i<r1;i++)
    {
        ca += Number(document.getElementById('cAmount'+i).value)
    }
    for(j=0;j<r2;j++) 
    {
        fa += Number(document.getElementById('ftAmount'+j).value)
    }
    document.getElementById('ta').value = (ca + fa).toFixed(2)
    calculateTotal()
}


//---------------------------------------------------------------CALCULATING TOTAL WHEN PAYMENT AMOUNT IS CHANGED
document.getElementById('ta').addEventListener('change',() =>{
    calculateTotal()
})


//---------------------------------------------------------------CALCULATING PAID AMOUNT FOR EACH INVOICE
function calculatePaid(it,num)
{
    var grl = Number(document.getElementById('grl'+num).value)
    var rd = Number(document.getElementById('rd'+num).value)
    var cl = Number(document.getElementById('cl'+num).value)
    var discP = Number(document.getElementById('discP'+num).value)
    var disc = Number(document.getElementById('disc'+num).value)
    var pc = Number(document.getElementById('pc'+num).value)
    var ol = Number(document.getElementById('ol'+num).value)
    var intP = Number(document.getElementById('intP'+num).value)
    var int = Number(document.getElementById('int'+num).value)
    var oa = Number(document.getElementById('oa'+num).value)
    var na = Number(document.getElementById('na'+num).value)

    var fields = [grl, rd, cl, discP, disc, pc, ol, intP, int, oa]
    {
        for (var i = 0; i < fields.length; i++)
        {
            if(fields[i] == NaN)
            {
                fields[i] = 0
            }
        }
    }
    document.getElementById('paid'+num).valueAsNumber = (na - grl - rd - cl - disc + pc - ol + int + oa).toFixed(2) 
    setStatus(it,num)
}


//---------------------------------------------------------------CALCULATING DISCOUNT AND INTEREST AMOUNT
function calculateAmount(it,num)
{
    var dp = Number(document.getElementById('discP'+num).value)
    var ip = Number(document.getElementById('intP'+num).value)
    var na = Number(document.getElementById('na'+num).value)
    if(dp=='') { dp = 0 }
    if(ip=='') { ip = 0 }  
    document.getElementById('disc'+num).valueAsNumber = (dp*na / 100).toFixed(2)
    document.getElementById('int'+num).valueAsNumber = (ip*na / 100).toFixed(2)
    document.getElementById('discP'+num).valueAsNumber = dp
    document.getElementById('intP'+num).valueAsNumber = ip
    calculatePaid(it,num)
}


//---------------------------------------------------------------CALCULATING DISCOUNT AND INTEREST PERCENTAGE
function calculatePercentage(it,num)
{
    var d = Number(document.getElementById('disc'+num).value)
    var i = Number(document.getElementById('int'+num).value)
    var na = Number(document.getElementById('na'+num).value)
    if(d=='') { d = 0 }
    if(i=='') { i = 0 }  
    document.getElementById('discP'+num).valueAsNumber = (d * 100 / na).toFixed(2)
    document.getElementById('intP'+num).valueAsNumber = (i * 100 / na).toFixed(2)
    document.getElementById('disc'+num).valueAsNumber = d
    document.getElementById('int'+num).valueAsNumber = i
    calculatePaid(it,num)
}


//---------------------------------------------------------------CALCULATING BROKERAGE AMOUNT
document.getElementById('brokP').addEventListener('change', () =>{
    brok.value = (brokP.value * ta.value / 100).toFixed(2)
})


//---------------------------------------------------------------CALCULATING BROKERAGE PERCENTAGE
document.getElementById('brok').addEventListener('change', () =>{
    brokP.value = (brok.value * 100 / ta.value).toFixed(2)
})


//----------------------------------------------------------------VALIDATE DATE OF ENTRY WHEN IT LOOSES FOCUS
document.getElementById('doe').addEventListener('focusout', () =>{
    if(!document.getElementById('doe').checkValidity())
    {
        document.getElementById('doe').reportValidity()
    }
})


//----------------------------------------------------------------VALIDATE DATE OF PAYMENT WHEN IT LOOSES FOCUS
document.getElementById('dop').addEventListener('focusout', () =>{
    if(!document.getElementById('dop').checkValidity())
    {
        document.getElementById('dop').reportValidity()
    }
})


//---------------------------------------------------------------RELOADING PAGE(USED WHEN PRINT BUTTON LOOSES FOCUS)
function rl()
{
    location.reload()
}

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