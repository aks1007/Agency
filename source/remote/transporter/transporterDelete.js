const transporter = document.getElementById('transporter')

document.getElementById('submitButton').addEventListener('click', (event) => {

    if( transporter.value == ""){}
    
    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/transporter/'+ transporter.value , { method: 'DELETE'})
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
                x.innerHTML = transporter.value.toUpperCase() + " NOT FOUND!"
            }
            else
            {
                x.innerHTML = error.message.toUpperCase()
            }
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })
    }  
})

function showTransporters()
{
    fetch('http://localhost:7070/transporter')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Transporter[i].transporter + '">' + data.Transporter[i].transporter + '</option>'
        }
        document.getElementById('transporters').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

function checkTransporter()
{
    fetch('http://localhost:7070/transporter/' + transporter.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(transporter.value == '')
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "PLEASE INPUT A TRANSPORTER FIRST"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                transporter.focus()
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = transporter.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                transporter.focus()
            }

        }
    })
}

function resetForm(){
    document.getElementById('forme').reset()
}

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   
}