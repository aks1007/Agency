const ipcRenderer = require('electron').ipcRenderer

window.onload = () =>
{       
    serialNo.value = localStorage.getItem('paymentNo')
    document.getElementById('companyName').innerHTML = localStorage.getItem('companyName')
    document.getElementById('address').innerHTML = localStorage.getItem('address')
    document.getElementById('phoneNo').innerHTML = "PH NO : " + localStorage.getItem('phoneNo')
    telephoneNo.innerHTML = "TEL : " + localStorage.getItem('telephoneNo')
    document.getElementById('gstin').innerHTML = "GSTIN : " + localStorage.getItem('gstin')
    pan.innerHTML = "PAN : " + localStorage.getItem('pan')
    //GENERATE PRINT FORM
    upload(serialNo.value) 

    fileName = "Payment" + serialNo.value + ".pdf"
    var size = 'A5'
    var landscape = true
    setTimeout(function()
    {   
        ipcRenderer.send('print', fileName, size , landscape)
        var x = localStorage.getItem("paymentBack")
        if(x == 0) 
        {
            window.location = "./paymentNew.html"        
        } 
        if(x == 1)
        {
            window.location = "./paymentUpdate.html"
        }   
    },2000)    
}

var d = new Date()
function dateFormat(d)
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
                serialNo.innerHTML = data.serialNo
                date.innerHTML = dateFormat(new Date(data.dop))
                customer.innerHTML = data.customer.toUpperCase()
                supplier.innerHTML = data.supplier.toUpperCase()
                ta.innerHTML = "₹" + data.ta
                brokP.innerHTML = data.brokP + "%"
                brok.innerHTML = "₹" + data.brok
                remarks.innerHTML = data.remarks                
                showAllItems() 
                showAllCheques()
                showAllFts()
            }      
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
    {   console.log(data)
        for(j = 0; j < data.count; j++)
        {            
            items.style.display = 'inline-table';
            var table = document.getElementById('items')

            var rowCount = table.rows.length-1
        
            var row = table.insertRow(rowCount+1)
        
            row.className = "List"

            var cell0 = row.insertCell(0);
            var element1 = document.createElement("span");
            element1.innerHTML = data.PaymentBill[j].id;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("span");
            element2.innerHTML = data.PaymentBill[j].billNo
            cell1.appendChild(element2);    
        
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("span");
            element3.style.textAlign = "center";
            element3.innerHTML =  data.PaymentBill[j].na
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("span");
            element4.innerHTML = data.PaymentBill[j].dd
            cell3.appendChild(element4);
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("span");
            element5.innerHTML = data.PaymentBill[j].grA
            cell4.append(element5);
        
            var cell5 = row.insertCell(5);
            var element6 = document.createElement("span");
            element6.innerHTML = data.PaymentBill[j].rd
            cell5.appendChild(element6);
        
            var cell6 = row.insertCell(6);
            var element7 = document.createElement("span");
            element7.innerHTML = data.PaymentBill[j].pc
            cell6.append(element7);
        
            var cell7 = row.insertCell(7);
            var element8 = document.createElement("span");
            element8.innerHTML = data.PaymentBill[j].cl
            cell7.append(element8);
        
            var cell8 = row.insertCell(8);
            var element9 = document.createElement("span");
            element9.innerHTML = data.PaymentBill[j].disc
            cell8.append(element9);
        
            var cell9 = row.insertCell(9);
            var element10 = document.createElement("span")
            element10.innerHTML = data.PaymentBill[j].int
            cell9.appendChild(element10);
        
            var cell10 = row.insertCell(10);
            var element11 = document.createElement("span");
            element11.innerHTML = data.PaymentBill[j].oa - data.PaymentBill[j].ol
            cell10.append(element11);

            var cell11 = row.insertCell(11);
            var element12 = document.createElement("span");
            element12.innerHTML = data.PaymentBill[j].paid
            cell11.append(element12);

            var cell12 = row.insertCell(12);
            var element13 = document.createElement("span");
            element13.innerHTML = data.PaymentBill[j].status
            cell12.append(element13);
        }
    })           
}


function showAllCheques()
{
    fetch('http://localhost:7070/paymentCheque/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {   console.log(data)
        for(j = 0; j < data.count; j++)
        {            
            items.style.display = 'inline-table';
            var table = document.getElementById('cheques')

            var rowCount = table.rows.length-1
        
            var row = table.insertRow(rowCount+1)
        
            row.className = "List"

            var cell0 = row.insertCell(0);
            var element1 = document.createElement("span");
            element1.innerHTML = data.PaymentCheque[j].cId;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("span");
            element2.innerHTML = data.PaymentCheque[j].cNo
            cell1.appendChild(element2);    
        
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("span");
            element3.style.textAlign = "center";
            element3.innerHTML =  dateFormat(new Date(data.PaymentCheque[j].cDate))
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("span");
            element4.innerHTML = data.PaymentCheque[j].bank
            cell3.appendChild(element4);
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("span");
            element5.innerHTML = data.PaymentCheque[j].cAmount
            cell4.append(element5);
        }
    })           
}


function showAllFts()
{
    fetch('http://localhost:7070/paymentFt/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {   console.log(data)
        for(j = 0; j < data.count; j++)
        {            
            items.style.display = 'inline-table';
            var table = document.getElementById('fts')

            var rowCount = table.rows.length-1
        
            var row = table.insertRow(rowCount+1)
        
            row.className = "List"

            var cell0 = row.insertCell(0);
            var element1 = document.createElement("span");
            element1.innerHTML = data.PaymentFt[j].ftId;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("span");
            element2.innerHTML = data.PaymentFt[j].utrNo
            cell1.appendChild(element2);    
        
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("span");
            element3.style.textAlign = "center";
            element3.innerHTML =  dateFormat(new Date(data.PaymentFt[j].ftDate))
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("span");
            element4.innerHTML = data.PaymentFt[j].bank.toUpperCase()
            cell3.appendChild(element4);
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("span");
            element5.innerHTML = data.PaymentFt[j].ftAmount
            cell4.append(element5);
        }
    })           
}