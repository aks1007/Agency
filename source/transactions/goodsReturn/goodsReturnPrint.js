const ipcRenderer = require('electron').ipcRenderer

window.onload = () =>
{       
    serialNo.value = localStorage.getItem('goodsReturnNo')
    document.getElementById('companyName').innerHTML = localStorage.getItem('companyName')
    document.getElementById('address').innerHTML = localStorage.getItem('address')
    document.getElementById('phoneNo').innerHTML = "PH NO : " + localStorage.getItem('phoneNo')
    telephoneNo.innerHTML = "TEL : " + localStorage.getItem('telephoneNo')
    document.getElementById('gstin').innerHTML = "GSTIN : " + localStorage.getItem('gstin')
    pan.innerHTML = "PAN : " + localStorage.getItem('pan')
    console.log(localStorage.getItem('companyName'))
    //GENERATE PRINT FORM
    upload(serialNo.value) 

    fileName = "GoodsReturn" + serialNo.value + ".pdf"
    var size = 'A5'
    var landscape = true
    setTimeout(function()
    {   
        ipcRenderer.send('print', fileName, size , landscape)
        var x = localStorage.getItem("goodsReturnBack")
        if(x == 0) 
        {
            window.location = "./goodsReturnNew.html"        
        } 
        if(x == 1)
        {
            window.location = "./goodsReturnUpdate.html"
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
        fetch('http://localhost:7070/goodsReturn/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.     
            //If Notice exists
            if(data.serialNo!=null)
            {
                serialNo.innerHTML = data.serialNo
                date.innerHTML = dateFormat(new Date(data.date))
                customer.innerHTML = data.customer.toUpperCase()
                supplier.innerHTML = data.supplier.toUpperCase()
                cNo.innerHTML = data.cNo
                dNo.innerHTML = data.dNo
                agrNo.innerHTML = data.agrNo
                tta.innerHTML = data.tta
                tax.innerHTML = data.tax
                tgra.innerHTML = data.tgra
                remarks.innerHTML = data.remarks                
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
    fetch('http://localhost:7070/goodsReturnBill/basic/' + serialNo.value)
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
            element1.innerHTML = data.GoodsReturnBill[j].id;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);
        
            var cell1 = row.insertCell(1);
            var element2 = document.createElement("span");
            element2.innerHTML = data.GoodsReturnBill[j].billNo
            cell1.appendChild(element2);
            
            var cell2 = row.insertCell(2);
            var element3 = document.createElement("span");
            element3.style.textAlign = "center";
            element3.value = data.GoodsReturnBill[j].na
            cell2.appendChild(element3);
        
            var cell3 = row.insertCell(3);
            var element4 = document.createElement("span");
            element4.style.textAlign = "center";
            element4.innerHTML =  data.GoodsReturnBill[j].ba
            cell3.appendChild(element4);
        
            var cell4 = row.insertCell(4);
            var element5 = document.createElement("span");
            element5.innerHTML = data.GoodsReturnBill[j].ta
            cell4.appendChild(element5);
        
            var cell5 = row.insertCell(5);
            var element6 = document.createElement("span");
            element6.innerHTML = data.GoodsReturnBill[j].gstP
            cell5.append(element6);
        
            var cell6 = row.insertCell(6);
            var element7 = document.createElement("span");
            element7.innerHTML = data.GoodsReturnBill[j].gstA
            cell6.appendChild(element7);
        
            var cell7 = row.insertCell(7);
            var element8 = document.createElement("span");
            element8.innerHTML = data.GoodsReturnBill[j].grA
            cell7.append(element8);
        
            var cell8 = row.insertCell(8);
            var element9 = document.createElement("span");
            element9.innerHTML = data.GoodsReturnBill[j].lrNo
            cell8.append(element9);
        
            var cell9 = row.insertCell(9);
            var element20 = document.createElement("span");
            element20.innerHTML = dateFormat(new Date(data.GoodsReturnBill[j].lrDate))
            cell9.append(element20);
        
            var cell10 = row.insertCell(10);
            var element21 = document.createElement("span")
            element21.innerHTML = data.GoodsReturnBill[j].transporter
            cell10.appendChild(element21);
        
            var cell11 = row.insertCell(11);
            var element22 = document.createElement("span");
            element22.innerHTML = data.GoodsReturnBill[j].status
            cell11.append(element22);
        }
    })           
}