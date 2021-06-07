const { STATES } = require("mongoose")

const city = document.getElementById('city')

window.onload = () => {  

        
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('locationKey')
    if(check)
    {            
    document.getElementById('city').value = check
    city.blur()
    sessionStorage.removeItem('locationKey')
    }   
}

city.oninput = function showCities()
{    
    newCity.disabled = true
    state.disabled = true
    stdCode.disabled = true
    submitButton.disabled = true
    fetch('http://localhost:7070/location')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Location[i].city + '">' + data.Location[i].city + '</option>'
        }
        document.getElementById('cities').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

city.onblur = function checkCity()
{
    fetch('http://localhost:7070/location/' + city.value )
    .then( response => response.json())
    .then(data => 
    {       
        if(data.code !== 200)
        {
            if(city.value == '')
            {
                city.setCustomValidity('Please input City name')
                city.reportValidity()
            }
            else
            {
                city.setCustomValidity(city.value.toUpperCase() + ' not found.')
                city.reportValidity()
            }
        }

        else
        {
            newCity.value = data.city
            state.value = data.state
            stdCode.value = data.stdCode
            newCity.disabled = false
            state.disabled = false
            stdCode.disabled = false
            submitButton.disabled = false
            newCity.select()
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
        fetch('http://localhost:7070/location/' + city.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                city : newCity.value.trim().toUpperCase(),
                state : state.value.trim().toUpperCase(),
                stdCode : stdCode.value.trim().toUpperCase()
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
                newCity.select()
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