const { STATES } = require("mongoose")

const post = document.getElementById('post')

window.onload = () => {          
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('postKey')
    if(check)
    {            
    document.getElementById('post').value = check
    post.blur()
    sessionStorage.removeItem('postKey')
    }   
}

post.oninput = function showPosts()
{    
    newPost.disabled = true
    emailId.disabled = true
    phoneNo.disabled = true
    remarks.disabled = true
    line1.disabled = true
    line2.disabled = true
    city.disabled = true
    pinCode.disabled = true
    submitButton.disabled = true
    fetch('http://localhost:7070/post')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Post[i].post + '">' + data.Post[i].post + '</option>'
        }
        document.getElementById('posts').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

post.onblur = function checkPost()
{
    post.value = post.value.trim() 
    fetch('http://localhost:7070/post/' + post.value )
    .then( response => response.json())
    .then(data => 
    {     
        console.log(data)  
        if(data.code !== 200)
        {
            if(post.value == '')
            {
                post.setCustomValidity('Please input Post name')
                post.reportValidity()
            }
            else
            {
                post.setCustomValidity(post.value.toUpperCase() + ' not found.')
                post.reportValidity()
            }
        }

        else
        {
            newPost.value = data.post
            emailId.value = data.emailId
            phoneNo.value = data.phoneNo
            remarks.value = data.remarks
            line1.value = data.line1
            line2.value = data.line2
            city.value = data.city
            state.value = data.state
            pinCode.value = data.pinCode
            newPost.disabled = false
            newPost.disabled = false
            emailId.disabled = false
            phoneNo.disabled = false
            remarks.disabled = false
            line1.disabled = false
            line2.disabled = false
            city.disabled = false
            pinCode.disabled = false
            submitButton.disabled = false
            newPost.select()
        }
    })
}

city.oninput = function showCities()
{
    document.getElementById('state').value = ""
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
                
            }
            else
            {
                city.setCustomValidity(city.value.toUpperCase() + ' does not exist.')
                city.reportValidity()
            }
        }
        else
        {
            document.getElementById('state').value = data.state.toUpperCase()
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
        fetch('http://localhost:7070/post/' + post.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                post : newPost.value.trim().toUpperCase(),
                emailId: emailId.value,
                phoneNo : phoneNo.value,
                remarks : remarks.value,
                line1: line1.value.toUpperCase(),
                line2: line2.value.toUpperCase(),
                city: city.value.toUpperCase(),
                state: state.value.toUpperCase(),
                pinCode: pinCode.value,
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
                newPost.select()
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

//REMOTE TABS

//LOCATION
document.getElementById('city').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/location/locationNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})