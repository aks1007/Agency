window.onload = () => {          
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('marketKey')
    if(check)
    {            
    document.getElementById('market').value = check
    checkMarket()
    sessionStorage.removeItem('marketKey')
    }   
}

function showMarkets()
{
    fetch('http://localhost:7070/market')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Market[i].market + '">' + data.Market[i].market + '</option>'
        }
        document.getElementById('markets').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

function checkMarket()
{
    fetch('http://localhost:7070/market/' + market.value )
    .then( response => response.json())
    .then(data => 
    {
        if(data.code !== 200)
        {
            if(market.value == '')
            {
                market.setCustomValidity('Please input Market name')
                market.reportValidity()
            }
            else
            {
                market.setCustomValidity(market.value.toUpperCase() + ' not found.')
                market.reportValidity()
            }
        }

        else
        {
            newMarket.value = data.market
            newMarket.disabled = false
            submitButton.disabled = false
            newMarket.select()
        }
    })
}

window.onload = () => {          
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('marketKey')
    if(check)
    {            
    document.getElementById('market').value = check
    market.blur()
    sessionStorage.removeItem('marketKey')
    }   
}

market.oninput = function showMarkets()
{
    fetch('http://localhost:7070/market')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Market[i].market + '">' + data.Market[i].market + '</option>'
        }
        document.getElementById('markets').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

market.onblur = function checkMarket()
{
    market.value = market.value.trim()
    fetch('http://localhost:7070/market/' + market.value )
    .then( response => response.json())
    .then(data => 
    {
        if(data.code !== 200)
        {
            if(market.value == '')
            {
                market.setCustomValidity('Please input Market name')
                market.reportValidity()
            }
            else
            {
                market.setCustomValidity(market.value.toUpperCase() + ' not found.')
                market.reportValidity()
            }
        }

        else
        {
            newMarket.value = data.market
            newMarket.disabled = false
            submitButton.disabled = false
            newMarket.select()
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

document.getElementById('submitButton').addEventListener('click', (event) => 
{
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {        
        event.preventDefault()
        fetch('http://localhost:7070/market/' + market.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                market : newMarket.value.trim().toUpperCase(),
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
                newMarket.select()
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