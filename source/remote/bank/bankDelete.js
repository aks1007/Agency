const bank = document.getElementById('bank')

document.getElementById('submitButton').addEventListener('click', (event) => {

    if( bank.value == ""){}
    
    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/bank/'+ bank.value , {method : 'DELETE'})
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
                x.innerHTML = bank.value.toUpperCase() + " NOT FOUND!"
            }
            else
            {
                x.innerHTML = error.message.toUpperCase()
            }
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })
    }  
})

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

function checkBank()
{
    fetch('http://localhost:7070/bank/' + bank.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(bank.value == '')
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "PLEASE INPUT A BANK FIRST"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                bank.focus()
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = bank.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                bank.focus()
            }

        }
    })
}

function resetForm() {
    document.getElementById('forme').reset()
}

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   
}

