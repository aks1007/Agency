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
    vouchers.style.display = 'none'
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
    if(req==0)
    {
        event.preventDefault()
        //Update Notice
        fetch('http://localhost:7070/brokerage/basic/'+ serialNo.value, { method: 'DELETE'})
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
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload()}, 2000);
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload()}, 2000);
        })


        //SETIING BROKERAGE RECEIVED TO FALSE FOR EACH VOUCHER
        var rowCount = vouchers.rows.length
        for(j=0;j<rowCount-1;j++)
        {   
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

        } 

        //Delete HTTP Request to Brokerage Vouchers Collection
        fetch('http://localhost:7070/brokerageVoucher/basic/'+serialNo.value,{ method: 'DELETE'})
    }  
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
                showAllVouchers() 
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
                localStorage.setItem('brokerageNo',serialNo.value)
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

function deleteAllVouchers()
{
    var table = document.getElementById("vouchers");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}

function showAllVouchers()
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
            element1.style.textAlign = "centre"
            element1.disabled = true
            cell0.style.width = "3%"
            element1.value = data.BrokerageVoucher[j].id
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
            element2.disabled = true
            element2.checked = data.BrokerageVoucher[j].select
            cell1.appendChild(element2);
        
            var cell2 = row.insertCell(2)
            var element3 = document.createElement("input")
            element3.id = "vouNo"+(rowCount)
            element3.style.textAlign = "centre"
            element3.disabled = true
            element3.value = data.BrokerageVoucher[j].vouNo
            cell2.style.width = '7%'
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3)
            var element4 = document.createElement("input")
            element4.style.textAlign = "centre"
            element4.disabled = true
            element4.value = dateFormat(new Date(data.BrokerageVoucher[j].vouDate))
            cell3.style.width = '7%'
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4)
            var element5 = document.createElement("input")
            element5.id = "customer"+(rowCount-1)
            element5.style.textAlign = "centre"
            element5.disabled = true
            element5.value = data.BrokerageVoucher[j].customer
            cell4.style.width = '20%'
            cell4.appendChild(element5);

            var cell5 = row.insertCell(5)
            var element6 = document.createElement("input")
            element6.id = 'bills'+(rowCount-1)
            element6.style.textAlign = "centre"
            element6.disabled = true
            element6.value = data.BrokerageVoucher[j].bills
            cell5.appendChild(element6);
            cell5.style.width = "20%"

            var cell6 = row.insertCell(6)
            var element7 = document.createElement("input")
            element7.id = 'netAmt'+(rowCount-1)
            element7.style.textAlign = "centre"
            element7.disabled = true
            cell6.style.width = '10%'
            element7.value = data.BrokerageVoucher[j].amount
            cell6.appendChild(element7);

            var cell7 = row.insertCell(7)
            var element8 = document.createElement("input")
            element8.id = 'brokP'+(rowCount-1)
            element8.style.textAlign = "centre"
            element8.disabled = true
            element8.value = data.BrokerageVoucher[j].brokP
            cell7.style.width = '7%'
            cell7.appendChild(element8);

            var cell8 = row.insertCell(8)
            var element9 = document.createElement("input")
            element9.id = 'brok'+(rowCount-1)
            element9.style.textAlign = "centre"
            element9.disabled = true
            element9.value = data.BrokerageVoucher[j].brok
            cell8.style.width = '10%'
            cell8.appendChild(element9);
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