var req

//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 

    var check = sessionStorage.getItem('mailKey')
    if(check == null)
    {
        upload(1)
    }
    else
    {            
        document.getElementById('serialNo').value = check
        upload(check)
        sessionStorage.removeItem('mailKey')
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
        serialNo.setCustomValidity('Please input a Serial No.')
        serialNo.reportValidity()
    }
})


//Deleting mail on submit button click
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
        fetch('http://localhost:7070/mail/basic/'+ serialNo.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                date : date.value,
                sender : sender.value.toUpperCase(),
                receiver : receiver.value,
                io : io.value,
                content : content.value,
                post : post.value,
                tid : tid.value, 
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
                localStorage.setItem('mailNo',serialNo.value)
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

        //Delete HTTP Request to Mail Cheques Collection
        fetch('http://localhost:7070/mailCheque/basic/'+serialNo.value,{ method: 'DELETE'})
        .then(response =>response.json())
        .then(data =>
        {
            var table = document.getElementById('cheque')
            var rowCount = table.rows.length
            for(i=0;i<rowCount-1;i++)
            {
                fetch('http://localhost:7070/mailCheque',{
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body : JSON.stringify({
                        serialNo : serialNo.value,
                        cId : document.getElementById('cId'+i).value,
                        cNo : document.getElementById('cNo'+i).value,
                        cDate :document.getElementById('cDate'+i).value,
                        bank : document.getElementById('bank'+i).value,
                        cAmount : document.getElementById('cAmount'+i).value,
                    })
                })
            } 
        })
    }  
})

//Function for print operation
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('mailBack',1)
    window.location = "./mailPrint.html"
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
    deleteAllCheques()
    document.getElementById('cheque').style.display = 'none'
    if(num == "")
    {
    }
    else
    {        
        fetch('http://localhost:7070/mail/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.     
            //If Notice exists
            if(data.serialNo!=null)
            {
                date.disabled = false
                sender.disabled = false
                receiver.disabled = false
                io.disabled = false
                content.disabled = false
                post.disabled = false
                tid.disabled = false
                remarks.disabled = false
                printButton.disabled = false
                submitButton.disabled = false

                serialNo.value = data.serialNo
                date.value = dateFormat(new Date(data.date))
                sender.value = data.sender.toUpperCase()
                receiver.value = data.receiver.toUpperCase()
                io.value = data.io
                content.value = data.content
                post.value = data.post
                tid.value = data.tid
                remarks.value = data.remarks
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
                if(content.value == 'payment')
                {
                    document.getElementById('cheque').style.display = 'inline-table'
                    showCheques() 
                }
                localStorage.setItem('mailNo',serialNo.value)
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

function deleteAllCheques()
{
    var table = document.getElementById("cheque");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}

//Function to display all postal-services as a drop-down datalist
function showPosts()
{
    fetch('http://localhost:7070/post')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Post[i].post + '">' + data.Post[i].post + '</option>'
        }
        document.getElementById('posts').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

//Function to check if the postal-service input is valid
function checkPost()
{
    fetch('http://localhost:7070/post/' + post.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(post.value == '')
            {
            }
            else
            {
                post.setCustomValidity(post.value + " does not exist.")
                post.reportValidity()
            }

        }
    })
}

//Function to show all Banks in the form of a drop-down data list
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
        document.getElementById('banks').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

//Funtion to check if Bank input is from the datalist or not
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
                b.setCustomValidity(b.value + " does not exist.")
                b.reportValidity()
            }

        }
    })
}

function showCheques()
{
    document.getElementById('cheque').style.display = 'inline-table';
    fetch('http://localhost:7070/mailCheque/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {
            
            var table = document.getElementById('cheque')

            var rowCount = table.rows.length-1

            var row = table.insertRow(rowCount+1)

            row.className = "List"

            var cell0 = row.insertCell(0);
            var element1 = document.createElement("input");
            element1.type = "number";
            element1.disabled = true;
            element1.id = "cId" + rowCount ;
            element1.value = data.MailCheque[j].cId;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);

            var cell1 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.type = "number";
            element2.id = "cNo" + rowCount ;
            element2.value = data.MailCheque[j].cNo;
            element2.required = true;
            element2.autocomplete = "off";
            element2.setAttribute("onfocusout","lastRow(" + rowCount + ")")
            cell1.append(element2);

            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "date";
            element3.id = "cDate" + rowCount ;
            element3.required = true;
            element3.value = dateFormat(new Date(data.MailCheque[j].cDate))
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.type = "text";   
            element4.id = "bank" + rowCount ;
            element4.required = true;
            element4.autocomplete = "off";
            element4.value = data.MailCheque[j].bank
            element4.setAttribute("list", "banks")
            element4.setAttribute("onfocus", "showBanks()")
            element4.setAttribute("onfocusout","checkBank(bank" + rowCount + ")")
            var elementx = document.createElement("datalist");
            elementx.id = "banks";    
            cell3.append(element4,elementx);

            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "number";
            element5.id = "cAmount" + rowCount ;
            element5.value = data.MailCheque[j].cAmount;
            element5.required = true;
            element5.setAttribute("min",0)
            element5.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
            cell4.appendChild(element5);
        }
        var table = document.getElementById('cheque')
        var rowCount = table.rows.length    
        if(rowCount == 1)
        {
            addCheque() 
            document.getElementById('cNo0').focus()
        }
    })      
}

//Function to manipulate the display of cheque table based on Content input
function chequeDisplay(){
    if(content.value == 'documents')
    {
        var table = document.getElementById('cheque')
        var rowCount = table.rows.length        
        document.getElementById('cheque').style.display = 'none'
        for(i=1;i<rowCount;i++)
        { 
            deleteCheque() 
        }
    }
    else
    {
        showCheques()
    } 
}

//Function to add row to cheque table
function addCheque()
{  

    var table = document.getElementById('cheque')

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
    element2.required = true;
    element2.autocomplete = "off";
    element2.setAttribute("onfocusout","lastRow(" + rowCount + ")")
    cell1.append(element2);

    var cell2 = row.insertCell(2);
    var element3 = document.createElement("input");
    element3.type = "date";
    element3.id = "cDate" + rowCount ;
    element3.required = true;
    element3.valueAsDate = new Date()
    cell2.appendChild(element3);

    var cell3 = row.insertCell(3);
    var element4 = document.createElement("input");
    element4.type = "text";
    element4.id = "bank" + rowCount ;
    element4.placeholder = "BANK"
    element4.required = true;
    element4.setAttribute("list", "banks")
    element4.setAttribute("onfocus", "showBanks()")
    element4.setAttribute("onfocusout","checkBank(bank" + rowCount + ")")
    element4.autocomplete = "off";
    var elementx = document.createElement("datalist");
    elementx.id = "banks";    
    cell3.append(element4,elementx);

    var cell4 = row.insertCell(4);
    var element5 = document.createElement("input");
    element5.type = "number";
    element5.id = "cAmount" + rowCount ;
    element5.placeholder = "CHEQUE AMOUNT";
    element5.required = true;
    element5.setAttribute("min",0)    
    element5.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
    cell4.appendChild(element5);
}

//Function to delete rows from cheque table
function deleteCheque()
{
    var table = document.getElementById("cheque");    
    var rowCount = table.rows.length;
    if(rowCount>1)
    {
        table.deleteRow(rowCount-1);
    }
}

//Function to add new row to Cheque table when tab is pressed at Last Row's Cheque Amount
function nextRow(event, num)
{
    var nr =  event.keyCode

    if(event.shiftKey && nr==9)
    {

    }

    else if(nr == 9)
    {

        var table = document.getElementById('cheque')
        var rc = table.rows.length
        if(rc==num+2)
        {
            addCheque()
        }

    }
}

//Function to delete the last row if it's Cheque No. field is empty
function lastRow(num)
{
    var table = document.getElementById('cheque')
    var rc = table.rows.length
    var x = document.getElementById("cNo"+num)
    if(rc==num+2)
    {
        if(x.value == "" && num!=0)
        {
            deleteCheque()
            remarks.focus()
        }
    }
}

//POST
document.getElementById('post').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/post/postNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})

//FROM
document.getElementById('sender').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/location/locationNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})

//TO
document.getElementById('receiver').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/location/locationNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})