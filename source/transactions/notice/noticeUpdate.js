var serialNo = document.getElementById('serialNo')
var date = document.getElementById('date')
var subject = document.getElementById('subject')
var notice = document.getElementById('notice')
var req


//On window load
window.onload = () => {         
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 

    var check = sessionStorage.getItem('noticeKey')
    if(check == null)
    {
        upload(1)
    }
    else
    {            
        document.getElementById('serialNo').value = check
        upload(check)
        sessionStorage.removeItem('noticeKey')
    }  
}

//When Serial No. is input
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
    else
    {
        upload(serialNo.value)
    }
})

//When Submit Button is clicked
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
        fetch('http://localhost:7070/notice/basic/'+ serialNo.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                date : date.value,
                subject : subject.value.toUpperCase(),
                to : to.value,
                notice: notice.value
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            notice.focus()
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
    }
    
})

//When the print button gets clicked    
document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('noticeBack',1)
    window.location = "./noticePrint.html"
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

//Function to upload data 
function upload(num)
{
    if(num == "")
    {
    }
    //When Notice Input is not null, check if Notice is inside database.
    else
    {
        fetch('http://localhost:7070/notice/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.       
            console.log(data)
            //If Notice exists
            if(data.notice!=null)
            {
                date.disabled = false
                subject.disabled = false
                to.disabled = false
                notice.disabled = false

                serialNo.value = data.serialNo
                date.value = dateFormat(new Date(data.date))
                subject.value = data.subject.toUpperCase()
                to.value = data.to
                notice.value = data.notice
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);                
                localStorage.setItem('noticeNo',serialNo.value)
                printButton.disabled = false
                submitButton.disabled = false;
            }     
            //If Notice doesn't exist'       
            else
            {
                date.disabled = true
                subject.disabled = true
                to.disabled = true
                notice.disabled = true

                serialNo.focus()
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
                forme.reset()
                serialNo.value = num
                printButton.disabled = true
                submitButton.disabled = true
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
            printButton.disabled = true
            submitButton.disabled = true;
            serialNo.onfocusout = () =>{serialNo.focus()}
        })
    }
}