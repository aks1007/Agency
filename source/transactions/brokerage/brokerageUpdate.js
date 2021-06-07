var req
var oldRows
var netA = new Array()

//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
    
    var check = sessionStorage.getItem('brokerageKey')
    if(check == null)
    {
        upload(1)
    }
    else
    {            
        document.getElementById('serialNo').value = check
        upload(check)
        sessionStorage.removeItem('brokerageKey')
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
        serialNo.setCustomValidity('Please Input a Serial No')
        serialNo.reportValidity()
    }
})


//Deleting brokerage on submit button click
document.getElementById('submitButton').addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    else if(bAmount.value > 0)
    {
        event.preventDefault()
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "Adjusted Amount is less than Payment Amount. Add ₹" + bAmount.value
        setTimeout(function(){ x.className = x.className.replace("showError", "")}, 5000);
    }
    else if(bAmount.value < 0)
    {
        event.preventDefault()
        var x = document.getElementById("snackbar");
        x.className = "showError";
        x.innerHTML = "Adjusted Amount is more than Payment Amount. Subtract ₹" + Math.abs(bAmount.value)
        setTimeout(function(){ x.className = x.className.replace("showError", "")}, 5000);
    }
    else if(req==0 & bAmount.value==0)
    {
        event.preventDefault()
        //Update Notice
        fetch('http://localhost:7070/brokerage/basic/'+ serialNo.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                serialNo : serialNo.value,
                entryNo : entryNo.value,
                date : date.value,
                supplier : supplier.value.toUpperCase(),
                mop : mop.value,
                txnNo : txnNo.value,
                txnDate : dateOfTxn.value,
                bank : bank.value,
                brokReceived : brokReceived.value,
                tds : tds.value,
                totalBrok : tAmount.value,
                gstP : gstP.value,
                brokP : brokP.value,
                from : dateFrom.value,
                to : dateTo.value,
                selectAll : selectAll.checked,
                remarks : remarks.value,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if(data.code == 200)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = "Brokerage At Serial No. " + serialNo.value + " Updated Successfully!"
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");}, 2000);
                printButton.focus()
            }
            else
            {
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message
            setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
        })

        //SETIING BROKERAGE RECEIVED TO FALSE FOR EACH OLD VOUCHER
        for(j=0;j<oldRows;j++)
        {   
            fetch('http://localhost:7070/payment/basic/'+ document.getElementById("vouNo"+j).value, 
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    brokReceived : false
                }),
            })
        }

        //Delete HTTP Request to Brokerage Vouchers Collection
        fetch('http://localhost:7070/brokerageVoucher/basic/'+serialNo.value,{ method: 'DELETE'})
        .then(response => response.json())
        .then( data =>
        {
            //ADDING ROW TO BROKERAGE VOUCHER TABLE
            var rowCount = vouchers.rows.length-1
            for(i=0;i<rowCount;i++)
            {   
                if(document.getElementById('select'+i).checked)
                {
                    fetch('http://localhost:7070/brokerageVoucher',{
                        method: 'POST',
                        headers: {'content-type': 'application/json'},
                        body : JSON.stringify({
                            serialNo : serialNo.value,
                            id : document.getElementById('id'+i).value,
                            select : document.getElementById('select'+i).checked,
                            vouNo : document.getElementById('vouNo'+i).value,
                            vouDate : document.getElementById('vouDate'+i).value,
                            customer : document.getElementById('customer'+i).value,
                            bills : document.getElementById('bills'+i).value,
                            amount : document.getElementById('netAmt'+i).value,
                            brokP : document.getElementById('brokP'+i).value,
                            brok : document.getElementById('brok'+i).value,
                        })
                    })
                    .catch((error) =>
                    {
                        console.log(error)
                    })
                } 
            }

            //UPDATING BROKERAGE RECEIVED STATUS OF CHECKED VOUCHERS
            for(j=0;j<rowCount;j++)
            {   
                if(document.getElementById('select'+j).checked)
                {
                    fetch('http://localhost:7070/payment/basic/'+ document.getElementById("vouNo"+j).value, 
                    {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(
                        {
                            brokReceived : true
                        }),
                    })
                }
            } 
        })
    }  
})

//Function for print operation
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('brokerageNo',serialNo.value)
    localStorage.setItem('brokerageBack',1)
    window.location = "./brokeragePrint.html"
})

//---------------------------------------------------------------FUNCTION TO VALIDATE INPUTS
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
    vouchers.style.display = 'none';
    deleteAllVouchers()
    if(num == "")
    {
    }
    else
    {              
        fetch('http://localhost:7070/brokerage/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            if(data.serialNo!=null)
            {
                serialNo.value = data.serialNo
                entryNo.value = data.entryNo
                date.value = dateFormat(new Date(data.date))
                supplier.value = data.supplier.toUpperCase()
                mop.value = data.mop
                txnNo.value = data.txnNo
                dateOfTxn.value = dateFormat(new Date(data.txnDate))
                bank.value = data.bank
                brokReceived.value = data.brokReceived
                tds.value = data.tds
                tAmount.value = data.totalBrok
                aAmount.value = data.totalBrok
                bAmount.value = 0
                gstP.value = data.gstP
                brokP.value = data.brokP
                dateFrom.value = dateFormat(new Date(data.from))
                dateTo.value = dateFormat(new Date(data.to))
                selectAll.checked = data.selectAll                
                remarks.value = data.remarks  
                                
                printButton.disabled = false
                
                showVouchers()
                showAllVouchers() 
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

function deleteAllVouchers()
{
    var table = document.getElementById("vouchers");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}

function showVouchers()
{
    fetch('http://localhost:7070/brokerageVoucher/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {   
        for(j = 0; j < data.count; j++)
        {       
            vouchers.style.display = 'inline-table';
            var table = document.getElementById('vouchers')

            var rowCount = table.rows.length-1
        
            var row = table.insertRow(rowCount+1)
        
            row.className = "List"

            var cell0 = row.insertCell(0)
            var element1 = document.createElement("input")
            element1.id = "id" + rowCount
            element1.style.textAlign = "centre"
            element1.disabled = true
            cell0.style.width = "3%"
            element1.value = rowCount+1
            cell0.appendChild(element1)
        
            var cell1 = row.insertCell(1)
            var element2 = document.createElement("input")
            element2.type = 'checkbox'
            element2.id = 'select' + rowCount
            element2.style.height = '40px'
            element2.checked = false
            element2.style.textAlign = "centre"
            element2.style.width = '40px'
            element2.setAttribute('onchange', 'calculateAdjustedBrokerage()')
            cell1.style.width = '3%'
            element2.checked = data.BrokerageVoucher[j].select
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("input")
            element3.id = "vouNo"+ rowCount
            element3.style.textAlign = "centre"
            element3.disabled = true
            element3.value = data.BrokerageVoucher[j].vouNo
            cell2.style.width = '7%'
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3)
            var element4 = document.createElement("input")
            element4.style.textAlign = "centre"
            element4.id = "vouDate" + rowCount ;
            element4.disabled = true
            element4.value = dateFormat2(new Date(data.BrokerageVoucher[j].vouDate))
            cell3.style.width = '7%'
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("input")
            element5.id = "customer"+rowCount
            element5.style.textAlign = "centre"
            element5.disabled = true
            element5.value = data.BrokerageVoucher[j].customer
            cell4.style.width = '20%'
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("input")
            element6.id = 'bills'+rowCount
            element6.style.textAlign = "centre"
            element6.disabled = true
            element6.value = data.BrokerageVoucher[j].bills
            cell5.appendChild(element6);
            cell5.style.width = "20%"

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("input")
            element7.id = 'netAmt'+rowCount
            element7.style.textAlign = "centre"
            element7.disabled = true
            cell6.style.width = '10%'
            element7.value = data.BrokerageVoucher[j].amount
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("input")
            element8.id = 'brokP'+rowCount
            element8.style.textAlign = "centre"
            element8.value = data.BrokerageVoucher[j].brokP
            cell7.style.width = '7%'
            cell7.appendChild(element8);

            var cell8 = row.insertCell(8)
            var element9 = document.createElement("input")
            element9.id = 'brok'+rowCount
            element9.style.textAlign = "centre"
            element9.value = data.BrokerageVoucher[j].brok
            cell8.style.width = '10%'
            cell8.appendChild(element9);
        }
        oldRows = j
    })           
}


//Function to add row to item table
function showAllVouchers()
{  
    vouchers.style.display = "none"  
    deleteAllVouchers()  
    fetch("http://localhost:7070/payment/range/" + supplier.value + "/from="+dateFrom.value+"&to="+dateTo.value)
    .then(request => request.json())
    .then(data =>
    {   
        var limit = data.count
        for(i=0; i<limit; i++)
        {       
            vouchers.style.display = "inline-table"
            
            var table = document.getElementById('vouchers')

            var rowCount = table.rows.length
        
            var row = table.insertRow(rowCount)
            row.className = 'List'
        
            var cell0 = row.insertCell(0)
            var element1 = document.createElement("input")
            element1.id = "id"+(rowCount-1)
            element1.value = rowCount
            element1.style.textAlign = "centre"
            element1.disabled = true
            cell0.style.width = "3%"
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1)
            var element2 = document.createElement("input")
            element2.type = 'checkbox'
            element2.id = 'select' + (rowCount-1)
            element2.style.height = '40px'
            element2.checked = false
            element2.style.textAlign = "centre"
            element2.style.width = '40px'
            element2.setAttribute('onchange', 'calculateAdjustedBrokerage()')
            cell1.style.width = '3%'
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("input")
            element3.id = "vouNo"+(rowCount-1)
            element3.value = data.Payment[rowCount-oldRows-1].serialNo
            element3.style.textAlign = "centre"
            element3.disabled = true
            cell2.style.width = '7%'
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3)
            var element4 = document.createElement("input")
            element4.id = "vouDate"+(rowCount-1)
            element4.value = dateFormat2(new Date(data.Payment[rowCount-oldRows-1].dop))
            element4.style.textAlign = "centre"
            element4.disabled = true
            cell3.style.width = '7%'
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("input")
            element5.id = "customer"+(rowCount-1)
            element5.value = data.Payment[rowCount-oldRows-1].customer
            element5.style.textAlign = "centre"
            element5.disabled = true
            cell4.style.width = '20%'
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("input")
            element6.id = 'bills'+(rowCount-1)
            element6.style.textAlign = "centre"
            element6.disabled = true
            cell5.appendChild(element6);
            cell5.style.width = "20%"
            showBills(element3.value, rowCount-1)

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("input")
            element7.id = 'netAmt'+(rowCount-1)
            element7.value = data.Payment[rowCount-oldRows-1].ta
            element7.style.textAlign = "centre"
            element7.disabled = true
            cell6.style.width = '10%'
            cell6.appendChild(element7);
            netA[(rowCount - 1)] = data.Payment[rowCount-oldRows-1].ta

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("input")
            element8.id = 'brokP'+(rowCount-1)
            element8.value = data.Payment[rowCount-oldRows-1].brokP
            element8.style.textAlign = "centre"
            cell7.style.width = '7%'
            cell7.appendChild(element8);

            var cell8 = row.insertCell(8)
            var element9 = document.createElement("input")
            element9.id = 'brok'+(rowCount-1)
            element9.value = data.Payment[rowCount-oldRows-1].brok
            element9.style.textAlign = "centre"
            cell8.style.width = '10%'
            cell8.appendChild(element9);
        }
    })        
}


//Reload Page when focus shifts out of Print-Button
function rl()
{
    location.reload()
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
                supplier.setCustomValidity('')
                supplier.reportValidity()
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
function checkBank()
{   
    fetch('http://localhost:7070/bank/' + bank.value )
    .then( response => response.json())
    .then(data => 
    {           
        if(data.code !== 200)
        {   
            if(bank.value == '')
            {   
            }
            else
            {   
                bank.setCustomValidity(bank.value + " is not a Bank.")
                bank.reportValidity()
            }

        }
    })
}

//Function to display all bills in voucher row
function showBills(vouNo, rowNo)
{
    var Bills = new Array()
    fetch('http://localhost:7070/paymentBill/basic/'+ vouNo)
    .then( response => response.json())
    .then(data =>
    {   
        for(i=0;i<data.count;i++)
        {
            Bills[i] = data.PaymentBill[i].billNo
        }
        document.getElementById('bills'+rowNo).value = Bills[0]
        for(j=1;j<Bills.length;j++)
        {            
            document.getElementById('bills'+rowNo).value += "," + Bills[j]
        }
    })
    .catch(error =>{
        error.message
    })   
}




//---------------------------------------------------------------FUNCTION TO CALCULATE TOTAL BROKERAGE AND BALANCE BROKERAGE
function calculateTotalBrokerage()
{
    tAmount.value = Number(brokReceived.value) + Number(tds.value)
    bAmount.value = Number(tAmount.value) - Number(aAmount.value)
}

//---------------------------------------------------------------FUNCTION TO CALCULATE ADJUSTED BROKERAGE AND BALANCE BROKERAGE
function calculateAdjustedBrokerage()
{   
    var rowCount = vouchers.rows.length - 1
    document.getElementById('aAmount').value = 0
    for(i=0;i<rowCount;i++)
    {   
        var x = document.getElementById('select'+i).checked
        if(document.getElementById('select'+i).checked)
        {   
            document.getElementById('aAmount').value = Number(document.getElementById('aAmount').value) + Number(document.getElementById('brok'+i).value)
        }
    }
    bAmount.value = Number(tAmount.value) - Number(aAmount.value)
}


//----------------------------------------------------------------FUNCTION TO CALCULATE BROKERAGE AMOUNT FROM BROKERAGE PERCENTAGE
function calculateVoucherBrokerage()
{
    var rowCount = vouchers.rows.length - 1
    for(var i = 0; i < rowCount;i++)
    {
        var b = document.getElementById('brokP'+i).value
        var n = document.getElementById('netAmt'+i).value
        document.getElementById('brok'+i).value = (n*b/100).toFixed(2)
    }
}


//---------------------------------------------------------------CALCULATE TOTAL BROKERAGE WHEN BROKERAGE RECEIVED IS CHANGED
document.getElementById('brokReceived').addEventListener('change',() =>{
    if(brokReceived.value == '')
    {
        brokReceived.value = 0
    }
    calculateTotalBrokerage()
})

//---------------------------------------------------------------CALCULATE TOTAL BROKERAGE WHEN TDS AMOUNT IS CHANGED
document.getElementById('tds').addEventListener('change',() =>{
    if(tds.value == '')
    {
        tds.value = 0
    }
    calculateTotalBrokerage()
})


//----------------------------------------------------------------ENABLING TRANSACTION DETAILS ON MOP CHANGE
document.getElementById('mop').addEventListener('change',()=>{
    var x = mop.value
    if(x=='CASH')
    {
        txnNo.disabled = true
        dateOfTxn.disabled = true
        bank.disabled = true
        txnNo.value = ''
        dateOfTxn.value = new Date()
        bank.value = ''
    }
    if(x=='CASHLESS')
    {
        txnNo.disabled = false
        dateOfTxn.disabled = false
        bank.disabled = false
    }
})


//-------------------------------------------------------------------CALULATION NET VOUCHER AMOUNT FOR EACH ROW ON GST % CHANGE
document.getElementById('gstP').addEventListener('change',() =>{
    var rowCount = vouchers.rows.length - 1
    var g = document.getElementById('gstP').value
    for(i=0; i<rowCount; i++)
    {
        document.getElementById('netAmt'+i).value = (netA[i] - (g*netA[i]/100)).toFixed(2)
    }
    calculateVoucherBrokerage()
    calculateAdjustedBrokerage()
})


//-------------------------------------------------------------------EDIT BROK % FOR EACH VOUCHER ON BROKERAGE PERCENTAGE CHANGE
document.getElementById('brokP').addEventListener('change', ()=>{
    var rowCount = vouchers.rows.length - 1
    for (var i = 0; i < rowCount; i++)
    {
        document.getElementById('brokP'+i).value = document.getElementById('brokP').value
    }
    calculateVoucherBrokerage()
    calculateAdjustedBrokerage()
})

//---------------------------------------------------------------CHECKING/UNCHECKING ALL CHECKBOXES
document.getElementById('selectAll').addEventListener('change',() =>{
    var rowCount = vouchers.rows.length - 1
    var c = selectAll.checked
    if(c == true)
    {
        for(i=0;i<rowCount;i++)
        {
            document.getElementById('select'+i).checked = true
        }
    }
    else
    {
        for(i=0;i<rowCount;i++)
        {
            document.getElementById('select'+i).checked = false
        }
    }
    calculateAdjustedBrokerage()
})


//----------------------------------------------------------------DATE FORMATING
var d = new Date()
function dateFormat2(d)
{
    var y = d.getFullYear()
    var dt = d.getDate()
    if(dt<10)
    {
        dt = "0" + dt
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    m = months[d.getMonth()];
    return dt + ' ' + m + ' ' + y
}


//----------------------------------------------------------------FUNCTION TO CHECK OR UNCHECK SELECT ALL CHECK BOX
function setSelectAll()
{
    var rowCount = vouchers.rows.length - 1
    for(i=0;i<rowCount;i++)
    {
        var s = document.getElementById('select'+i).checked
        if(s==false)
        {
            selectAll.checked = false
        }
    }
}

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