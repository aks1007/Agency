const submitButton = document.getElementById('submitButton')
var cityName = document.getElementById('city')
var stateName = document.getElementById('state')
var STDcode = document.getElementById('stdCode')

submitButton.addEventListener('click', (event) => {
    if( cityName.value == ""){}

    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/location' , {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                city: cityName.value.toUpperCase(),
                state: stateName.value.toUpperCase(),
                stdCode: STDcode.value,
            })
        })
        .then(response => response.json())
        .then(data =>{
            if(data.code == 201)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");location.reload() }, 2000);
                document.getElementById("forme").reset()
                cityName.focus()
            }
            else
            {                
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
                document.getElementById("forme").reset()
                cityName.focus()
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })
    }

})

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   
}