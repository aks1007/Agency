//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
    upload(1)  
}

//When focus moves out of Notice Input
document.getElementById('serialNo').addEventListener('input', (event)=>{
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


//Deleting notice on submit button click
document.getElementById('submitButton').addEventListener('click', (event) => {

    if( serialNo.value == ""){}
    
    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/mail/basic/'+ serialNo.value, { method: 'DELETE'})
        .then(response => response.json())
        .then(data => 
        {
            console.log(data)
            if(data.code == 200)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");location.reload() }, 2000);
                document.getElementById("forme").reset()
            }
            else
            {
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
                document.getElementById("forme").reset()  
            }
        })
        .catch((error) =>
        {            
            //In case any error is encountered.
            var x = document.getElementById("snackbar");
            x.className = "showError";
            y =  error.message.toUpperCase()
            if(y = 'Request failed with status code 404')
            {
                x.innerHTML = "MAIL NO." + serialNo.value.toUpperCase() + " NOT FOUND!"
            }
            else
            {
                x.innerHTML = error.message.toUpperCase()
            }
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })

        //Delete HTTP Request to Mail Cheques Collection
        fetch('http://localhost:7070/mailCheque/basic/'+serialNo.value,{ method: 'DELETE'})
        .then(response =>response.json())
        .then(data =>
        {
            var table = document.getElementById("cheque");    
            var rowCount = table.rows.length;
            for( a = rowCount ; a>0 ; a-- )
            {
                table.deleteRow(a-1);
            }
        })
    }  
})

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
    forme.reset()
}

//Function to upload data 
function upload(num)
{    
    deleteCheque()
    if(num == "")
    {
    }
    //When Notice Input is not null, check if Notice is inside database.
    else
    {   
        document.getElementById('cheque').style.display = 'none'     
        fetch('http://localhost:7070/mail/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.     
            //If Notice exists
            if(data.serialNo!=null)
            {
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
                    fetch('http://localhost:7070/mailCheque/basic/' + serialNo.value)
                    .then(response => response.json())
                    .then(data =>
                    {
                        for(j = 0; j < data.count; j++)
                        {
                            
                            var table = document.getElementById('cheque')

                            var rowCount = table.rows.length

                            var row = table.insertRow(rowCount)

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
                            element2.disabled = true;
                            element2.id = "cNo" + rowCount ;
                            element2.value = data.MailCheque[j].cNo;
                            element2.required = true;
                            element2.autocomplete = "off";
                            cell1.append(element2);

                            var cell2 = row.insertCell(2);
                            var element3 = document.createElement("input");
                            element3.type = "date";
                            element3.disabled = true;
                            element3.id = "cDate" + rowCount ;
                            element3.required = true;
                            element3.value = dateFormat(new Date(data.MailCheque[j].cDate))
                            cell2.appendChild(element3);

                            var cell3 = row.insertCell(3);
                            var element4 = document.createElement("input");
                            element4.type = "text";                            
                            element4.disabled = true;
                            element4.id = "bank" + rowCount ;
                            element4.required = true;
                            element4.autocomplete = "off";
                            element4.value = data.MailCheque[j].bank
                            cell3.append(element4);

                            var cell4 = row.insertCell(4);
                            var element5 = document.createElement("input");
                            element5.type = "number";
                            element5.disabled = true;
                            element5.id = "cAmount" + rowCount ;
                            element5.value = data.MailCheque[j].cAmount;
                            element5.required = true;
                            cell4.appendChild(element5);
                        }
                    })
                }
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

function deleteCheque()
{
    var table = document.getElementById("cheque");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}