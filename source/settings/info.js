const submitButton = document.getElementById('submitButton')
var companyName = document.getElementById('companyName')
var phoneNo = document.getElementById('phoneNo')
var email = document.getElementById('email')
var gstin = document.getElementById('gstin')
var address = document.getElementById('address')
var req

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

submitButton.addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()

        fetch('http://localhost:7070/info/1')
        .then(response => response.json())
        .then(data =>{
            console.log(data)
            if(data.code == 404)
            {
                fetch('http://localhost:7070/info', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        sNo : 1,
                        companyName: companyName.value.trim().toUpperCase(),
                        phoneNo : phoneNo.value,
                        telephoneNo : telephoneNo.value,
                        email : email.value.toLowerCase(),
                        gstin : gstin.value.trim().toUpperCase(),
                        pan : pan.value,
                        address : address.value
                    })
                })
                .then(response => response.json())
                .then(data =>{               
                    var x = document.getElementById("snackbar");
                    x.className = "showMessage";
                    x.innerHTML = data.message.toUpperCase()
                    setTimeout(function(){ x.className = x.className.replace("showMessage", ""); location.reload() }, 2000);
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
            if(data.code == 200)
            {
                fetch('http://localhost:7070/info/1', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        sNo : 1,
                        companyName: companyName.value.trim().toUpperCase(),
                        phoneNo : phoneNo.value,
                        telephoneNo : telephoneNo.value,
                        email : email.value.toLowerCase(),
                        gstin : gstin.value.trim().toUpperCase(),
                        pan : pan.value.trim().toUpperCase(),
                        address : address.value
                    })
                })
                .then(response => response.json())
                .then(data =>{               
                    var x = document.getElementById("snackbar");
                    x.className = "showMessage";
                    x.innerHTML = data.message.toUpperCase()
                    setTimeout(function(){ x.className = x.className.replace("showMessage", ""); location.reload()}, 2000);
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
    }
    localStorage.setItem('companyName', companyName.value.toUpperCase())
    localStorage.setItem('gstin', gstin.value.toUpperCase())
    localStorage.setItem('pan',pan.value.toUpperCase())
    localStorage.setItem('phoneNo', phoneNo.value)
    localStorage.setItem('telephoneNo', telephoneNo.value)
    localStorage.setItem('email', email.value.toLowerCase())
    localStorage.setItem('address',address.value.toUpperCase())
})

function shortCuts(event)
{
    var x = event.keyCode

    if(x==27)
    {
        window.location = "./settings.html"
    }
}

window.onload = function()
{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    fetch('http://localhost:7070/info/1')
    .then(response => response.json())
    .then(data =>
    {
       if(data.sNo)
       {
           companyName.value = data.companyName,
           phoneNo.value = data.phoneNo,
           telephoneNo.value = data.telephoneNo,
           gstin.value = data.gstin,
           pan.value = data.pan,
           email.value = data.email
           address.value = data.address
       } 
    }) 
}

back.tabIndex = -1