const submitButton = document.getElementById('submitButton')
var supplierGroupName = document.getElementById('supplierGroup')
var dealsIn = document.getElementById('itemGroup')
var poc = document.getElementById('poc')
var emailId = document.getElementById('emailId')
var phoneNo = document.getElementById('phoneNo')
var mobileNo = document.getElementById('mobileNo')
var line1 = document.getElementById('line1')
var line2 = document.getElementById('line2')
var city = document.getElementById('city')
var state = document.getElementById('state')
var pinCode = document.getElementById('pinCode')
var cp = document.getElementById('cp')
var remarks = document.getElementById('remarks')

submitButton.addEventListener('click', (event) => {
    if( supplierGroupName.value == ""){}

    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/supplierGroup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                supplierGroup: supplierGroupName.value.trim().toUpperCase(),
                dealsIn : dealsIn.value.toUpperCase(),
                poc: poc.value.toUpperCase(),
                emailId: emailId.value,
                phoneNo : phoneNo.value,                
                mobileNo : mobileNo.value,
                line1: line1.value.toUpperCase(),
                line2: line2.value.toUpperCase(),
                city: city.value.toUpperCase(),
                state: state.value.toUpperCase(),
                pinCode: pinCode.value,  
                cp : cp.value,              
                remarks : remarks.value,
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
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })
    }

})

function showCities()
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

function checkCity()
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = city.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
                city.focus()
            }
        }
        else
        {
            document.getElementById('state').value = data.state.toUpperCase()
        }
    })
}

function showItemGroups()
{
    fetch('http://localhost:7070/itemGroup')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.ItemGroup[i].itemGroup + '">' + data.ItemGroup[i].itemGroup + '</option>'
        }
        document.getElementById('itemGroups').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

function checkItemGroup()
{
    fetch('http://localhost:7070/itemGroup/' + dealsIn.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(dealsIn.value == '')
            {
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = dealsIn.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                dealsIn.focus()
            }

        }
    })
}


window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)   
}

//REMOTE TABS

//ITEM-GROUP
document.getElementById('itemGroup').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/itemGroup/itemGroupNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})

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