const submitButton = document.getElementById('submitButton')
const printButton = document.getElementById('printButton')
var serialNo = document.getElementById('serialNo')
var date = document.getElementById('date')
var subject = document.getElementById('subject')
var notice = document.getElementById('notice')
var to = document.getElementById('to')
var req

submitButton.addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        fetch('http://localhost:7070/notice', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                serialNo : serialNo.value,
                date : date.value,
                subject : subject.value.toUpperCase(),
                to : to.value,
                notice: notice.value
            })
        })
        .then(response => response.json())
        .then(data =>{
            if(data.code == 201)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
                localStorage.setItem('noticeNo',serialNo.value)
                printButton.disabled = false;
                printButton.focus()
            }
            else
            {                
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", ""); location.reload() }, 2000);
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() },  2000);
        })
    }

})

function setSerialNo()
{
    fetch('http://localhost:7070/notice/last')
    .then(response => response.json())
    .then(data =>    {
       if(data.count==1)
       {            
        var x = data.Notice[0].serialNo  
        document.getElementById('serialNo').value = x +1;
        document.getElementById('date').focus()
       } 
       if(data.count==0)
       {
        document.getElementById('serialNo').value = 1
        document.getElementById('date').focus()
       }
    }
    )
}


//Function to check if Bill No. is valid
function checkForNotice()
{
    if(document.getElementById('serialNo').value.trim() == "")
    {
        serialNo.setCustomValidity('Please input a Serial No.')
        serialNo.reportValidity()
    }
    else
    {
        //HTTP GET-ONE REQUEST TO ITEM COLLECTION
        fetch('http://localhost:7070/notice/basic/'+ document.getElementById('serialNo').value)
        .then( response => response.json())
        .then(data => 
        {               
            if(data.serialNo != null)
            {                
                serialNo.setCustomValidity('Serial No.' + serialNo.value + ' already exists.')
                serialNo.reportValidity('')
            } 
        })
    }    
}

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

document.getElementById('printButton').addEventListener("click", () =>
{
    localStorage.setItem('noticeBack',0)
    window.location = "./noticePrint.html"
})

function rl()
{
    location.reload()
}

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)  
    setSerialNo()     
    document.getElementById('date').valueAsDate = new Date();
}