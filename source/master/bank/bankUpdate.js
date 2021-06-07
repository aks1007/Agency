const bank = document.getElementById('bank')

window.onload = () => {  

        
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('bankKey')
    if(check)
    {            
    document.getElementById('bank').value = check
    bank.blur()
    sessionStorage.removeItem('bankKey')
    }   
}

bank.oninput = function showBanks()
{    
    newBank.disabled = true
    submitButton.disabled = true
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

bank.onblur = function checkBank()
{
    fetch('http://localhost:7070/bank/' + bank.value )
    .then( response => response.json())
    .then(data => 
    {       
        if(data.code !== 200)
        {
            if(bank.value == '')
            {
                bank.setCustomValidity('Please input Bank name')
                bank.reportValidity()
            }
            else
            {
                bank.setCustomValidity(bank.value.toUpperCase() + ' not found.')
                bank.reportValidity()
            }
        }

        else
        {
            newBank.value = data.bank
            newBank.disabled = false
            submitButton.disabled = false
            newBank.select()
        }
    })
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

document.getElementById('submitButton').addEventListener('click',(event)=>
{
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        fetch('http://localhost:7070/bank/' + bank.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                bank : newBank.value.toUpperCase(),
            })
        })
        .then(response => response.json())
        .then(data =>{   
            if(data.code == 200)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); location.reload()}, 2000);
            }  
            if(data.code == 409)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                newBank.select()
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
            }         
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", ""); location.reload()}, 2000);
        })
    }

})