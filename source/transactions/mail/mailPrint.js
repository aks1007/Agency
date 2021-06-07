const ipcRenderer = require('electron').ipcRenderer

window.onload = () =>
{       
    mailNo.value = localStorage.getItem('mailNo')
    console.log(mailNo.value)
    document.getElementById('companyName').innerHTML = localStorage.getItem('companyName')
    document.getElementById('address').innerHTML = localStorage.getItem('address')
    document.getElementById('phoneNo').innerHTML = "PH NO : " + localStorage.getItem('phoneNo')
    telephoneNo.innerHTML = "TEL : " + localStorage.getItem('telephoneNo')
    document.getElementById('gstin').innerHTML = "GSTIN : " + localStorage.getItem('gstin')
    pan.innerHTML = "PAN : " + localStorage.getItem('pan')
    //GENERATE PRINT FORM
    upload(mailNo.value)

    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)  

    fileName = "Mail" + mailNo.value + ".pdf"
    var size = 'A4'
    var landscape = false
    setTimeout(function()
    {   
     ipcRenderer.send('print', fileName, size , landscape )
     var x = localStorage.getItem("mailBack")
     if(x == 0) 
     {
        window.location = "./mailNew.html"        
     } 
     if(x == 1)
     {
         window.location = "./mailUpdate.html"
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
    fetch('http://localhost:7070/mail/basic/'+ num)
    .then( response => response.json())
    .then(data => 
    {
        mailNo.innerHTML = data.serialNo
        date.innerHTML = dateFormat(new Date(data.date))
        sender.innerHTML = data.sender.toUpperCase()
        receiver.innerHTML = data.receiver.toUpperCase()
        io.innerHTML = data.io.toUpperCase()
        content.innerHTML = data.content.toUpperCase()
        post.innerHTML = data.post
        tid.innerHTML = data.tid
        remarks.innerHTML = data.remarks
        if(content.innerHTML == 'PAYMENT')
        {
            document.getElementById('cheque').style.display = 'inline-table'
            fetch('http://localhost:7070/mailCheque/basic/' + num)
            .then(response => response.json())
            .then(data =>
            {
                console.log(data)
                for(j = 0; j < data.count; j++)
                {
                    
                    var table = document.getElementById('cheque')

                    var rowCount = table.rows.length

                    var row = table.insertRow(rowCount)

                    row.className = "List"

                    var cell0 = row.insertCell(0);
                    var element1 = document.createElement("span");
                    element1.innerHTML = data.MailCheque[j].cId;
                    element1.style.textAlign = "center";
                    cell0.appendChild(element1);

                    var cell1 = row.insertCell(1);
                    var element2 = document.createElement("span");
                    element2.innerHTML = data.MailCheque[j].cNo;
                    element2.style.textAlign = "center";
                    cell1.append(element2);

                    var cell2 = row.insertCell(2);
                    var element3 = document.createElement("span");
                    element3.innerHTML = dateFormat(new Date(data.MailCheque[j].cDate))
                    element3.style.textAlign = "center";
                    cell2.appendChild(element3);

                    var cell3 = row.insertCell(3);
                    var element4 = document.createElement("span");
                    element4.innerHTML = data.MailCheque[j].bank
                    element4.style.textAlign = "center";
                    cell3.append(element4);

                    var cell4 = row.insertCell(4);
                    var element5 = document.createElement("span");
                    element5.innerHTML = data.MailCheque[j].cAmount;
                    element5.style.textAlign = "center";
                    cell4.appendChild(element5);
                }
            })
        } 
    })      
}