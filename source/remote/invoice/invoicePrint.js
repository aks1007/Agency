const ipcRenderer = require('electron').ipcRenderer

window.onload = () =>
{       
    serialNo.value = localStorage.getItem('invoiceNo')
    document.getElementById('companyName').innerHTML = localStorage.getItem('companyName')
    document.getElementById('address').innerHTML = localStorage.getItem('address')
    document.getElementById('phoneNo').innerHTML = "PH NO : " + localStorage.getItem('phoneNo')
    telephoneNo.innerHTML = "TEL : " + localStorage.getItem('telephoneNo')
    document.getElementById('gstin').innerHTML = "GSTIN : " + localStorage.getItem('gstin')
    pan.innerHTML = "PAN : " + localStorage.getItem('pan')
    //GENERATE PRINT FORM
    upload(serialNo.value)  

    fileName = "Invoice" + serialNo.value + ".pdf"
    var size = 'A4'
    var landscape = false
    setTimeout(function()
    {   
     ipcRenderer.send('print', fileName, size , landscape )
     var x = localStorage.getItem("invoiceBack")
     if(x == 0) 
     {
        window.location = "./invoiceNew.html"        
     } 
     if(x == 1)
     {
         window.location = "./invoiceUpdate.html"
     }   
    },3000)    
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
        fetch('http://localhost:7070/invoice/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.     
            //If Notice exists
            if(data.serialNo!=null)
            {
                serialNo.innerHTML = data.serialNo
                entryNo.innerHTML = data.entryNo,
                billNo.innerHTML = data.billNo,
                orderNo.innerHTML = data.orderNo,
                date.innerHTML = dateFormat(new Date(data.date)),
                subAgent.innerHTML = data.subAgent.toUpperCase(),
                customer.innerHTML = data.customer.toUpperCase(),
                supplier.innerHTML = data.supplier.toUpperCase(),
                transporter.innerHTML = data.transporter.toUpperCase(),
                destination.innerHTML = data.destination.toUpperCase(),
                cases.innerHTML = data.cases,
                lrNo.innerHTML = data.lrNo,
                lrDate.innerHTML = dateFormat(new Date(data.lrDate)),
                ca.innerHTML = data.ca,
                pcP.innerHTML = data.pcP,
                pc.innerHTML = data.pc,
                rdP.innerHTML = data.rdP,
                rd.innerHTML = data.rd,
                ddP.innerHTML = data.ddP,
                dd.innerHTML = data.dd,
                discP.innerHTML = data.discP,
                disc.innerHTML = data.disc,
                scP.innerHTML = data.scP,
                sc.innerHTML = data.sc,
                slP.innerHTML = data.slP,
                sl.innerHTML = data.sl,
                cgstP.innerHTML = data.cgstP,
                cgst.innerHTML = data.cgst,  
                sgstP.innerHTML = data.sgstP,
                sgst.innerHTML = data.sgst,
                igstP.innerHTML = data.igstP,
                igst.innerHTML = data.igst,
                netAmount.innerHTML = data.netAmount,
                remarks.innerHTML = data.remarks,                              
                showAllItems() 
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
    fetch('http://localhost:7070/invoiceItem/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {            
            items.style.display = 'inline-table';
            var table = document.getElementById('items')

            var rowCount = table.rows.length-1
        
            var row = table.insertRow(rowCount+1)
        
            row.className = "List"

            var cell0 = row.insertCell(0);
            var element1 = document.createElement("span");
            element1.type = "number";
            element1.disabled = true;
            element1.id = "id" + rowCount ;
            element1.innerHTML = data.InvoiceItem[j].id;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);

            var cell1 = row.insertCell(1);
            var element2 = document.createElement("span");
            element2.placeholder = "ITEM NAME";
            element2.innerHTML = data.InvoiceItem[j].item.toUpperCase()
            cell1.append(element2);    

            var cell2 = row.insertCell(2);
            var element3 = document.createElement("span");
            element3.placeholder = "HSN CODE";
            element3.innerHTML = data.InvoiceItem[j].hsnCode.toUpperCase()
            element3.style.textAlign = "center";
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3);
            var element4 = document.createElement("span");
            element4.placeholder = "NO. OF PIECES"
            element4.innerHTML = data.InvoiceItem[j].pcs
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4);
            var element5 = document.createElement("span");
            element5.placeholder = "ITEM CUT LENGTH"
            element5.innerHTML = data.InvoiceItem[j].cut
            cell4.append(element5);

            var cell5 = row.insertCell(5);
            var element6 = document.createElement("span");
            element6.placeholder = "METRES OF CLOTH";
            element6.innerHTML = data.InvoiceItem[j].mts
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6);
            var element7 = document.createElement("span");
            element7.placeholder = "RATE"
            element7.innerHTML = data.InvoiceItem[j].rate
            cell6.append(element7);

            var cell7 = row.insertCell(7);
            var element8 = document.createElement("span");    
            element8.innerHTML = data.InvoiceItem[j].unit
            cell7.append(element8);

            var cell8 = row.insertCell(8);
            var element9 = document.createElement("span");
            element9.placeholder = "AMOUNT"
            element9.innerHTML = data.InvoiceItem[j].amount
            cell8.append(element9);
        }
    })           
}