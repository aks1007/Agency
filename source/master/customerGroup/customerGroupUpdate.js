const { STATES } = require("mongoose")

const customerGroup = document.getElementById('customerGroup')

window.onload = () => {          
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('customerGroupKey')
    if(check)
    {            
    document.getElementById('customerGroup').value = check
    customerGroup.blur()
    sessionStorage.removeItem('customerGroupKey')
    }   
}

customerGroup.oninput = function showCustomerGroups()
{    
    newCustomerGroup.disabled = true
    itemGroup.disabled = true
    poc.disabled = true
    emailId.disabled = true
    phoneNo.disabled = true
    mobileNo.disabled = true
    line1.disabled = true
    line2.disabled = true
    city.disabled = true
    pinCode.disabled = true
    remarks.disabled = true
    submitButton.disabled = true
    fetch('http://localhost:7070/customerGroup')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.CustomerGroup[i].customerGroup + '">' + data.CustomerGroup[i].customerGroup + '</option>'
        }
        document.getElementById('customerGroups').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

customerGroup.onblur = function checkCustomerGroup()
{
    customerGroup.value = customerGroup.value.trim() 
    fetch('http://localhost:7070/customerGroup/basic/' + customerGroup.value )
    .then( response => response.json())
    .then(data => 
    {     
        console.log(data)  
        if(data.code !== 200)
        {
            if(customerGroup.value == '')
            {
                customerGroup.setCustomValidity('Please input Customer Group name')
                customerGroup.reportValidity()
            }
            else
            {
                customerGroup.setCustomValidity(customerGroup.value.toUpperCase() + ' not found.')
                customerGroup.reportValidity()
            }
        }

        else
        {
            newCustomerGroup.value = data.customerGroup    
            itemGroup.value = data.dealsIn
            poc.value = data.poc
            emailId.value = data.emailId
            phoneNo.value = data.phoneNo
            mobileNo.value = data.mobileNo
            line1.value = data.line1
            line2.value = data.line2
            city.value = data.city
            state.value = data.state
            pinCode.value = data.pinCode
            remarks.value = data.remarks


            newCustomerGroup.disabled = false 
            itemGroup.disabled = false
            poc.disabled = false
            emailId.disabled = false
            phoneNo.disabled = false
            mobileNo.disabled = false
            line1.disabled = false
            line2.disabled = false
            city.disabled = false
            pinCode.disabled = false
            remarks.disabled = false            
            submitButton.disabled = false

            newCustomerGroup.select()
        }
    })
}

itemGroup.oninput = function showItemGroups()
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

itemGroup.onblur = function checkItemGroup()
{
    fetch('http://localhost:7070/itemGroup/' + itemGroup.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(itemGroup.value == '')
            {
            }
            else
            {
                itemGroup.setCustomValidity(itemGroup.value.toUpperCase() + ' does not exist.')
                itemGroup.reportValidity()
            }

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
        fetch('http://localhost:7070/customerGroup/basic/' + customerGroup.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                customerGroup : newCustomerGroup.value.trim().toUpperCase(),
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
                newCustomerGroup.select()
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