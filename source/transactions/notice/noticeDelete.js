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
    else
    {
        upload(serialNo.value)
    }
})


//Deleting notice on submit button click
document.getElementById('submitButton').addEventListener('click', (event) => {

    if( serialNo.value == ""){}
    
    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/notice/basic/'+ serialNo.value, { method: 'DELETE'})
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
                x.innerHTML = "NOTICE NO." + serialNo.value.toUpperCase() + " NOT FOUND!"
            }
            else
            {
                x.innerHTML = error.message.toUpperCase()
            }
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
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