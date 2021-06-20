const { post } = require('jquery')

const customer = document.getElementById('customer')

window.onload = () => {          
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('customerKey')
    if(check)
    {            
    document.getElementById('customer').value = check
    customer.blur()
    sessionStorage.removeItem('customerKey')
    }   
}

customer.oninput = function showCustomers()
{    
    newCustomer.disabled = true
    customerGroup.disabled = true
    itemGroup.disabled = true
    emailId.disabled = true
    phoneNo.disabled = true
    mobileNo.disabled = true
    line1.disabled = true
    line2.disabled = true
    city.disabled = true
    pinCode.disabled = true
    postal.disabled = true
    pan.disabled = true
    gstNo.disabled = true
    poc.disabled = true
    creditLimit.disabled = true
    creditDays.disabled = true
    remarks.disabled = true
    blip.disabled = true
    blackList.disabled = true
    submitButton.disabled = true
    fetch('http://localhost:7070/customer/')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Customer[i].customer + '">' + data.Customer[i].customer + '</option>'
        }
        document.getElementById('customers').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

customer.onblur = function checkCustomer()
{
    customer.value = customer.value.trim() 
    fetch('http://localhost:7070/customer/basic/' + customer.value )
    .then( response => response.json())
    .then(data => 
    {      
        if(data.code !== 200)
        {
            if(customer.value == '')
            {
                customer.setCustomValidity('Please input Customer name')
                customer.reportValidity()
            }
            else
            {
                customer.setCustomValidity(customer.value.toUpperCase() + ' not found.')
                customer.reportValidity()
            }
        }

        else
        {
            newCustomer.value = data.customer 
            customerGroup.value = data.customerGroup   
            itemGroup.value = data.dealsIn
            emailId.value = data.emailId
            phoneNo.value = data.phoneNo
            mobileNo.value = data.mobileNo
            line1.value = data.line1
            line2.value = data.line2
            city.value = data.city
            state.value = data.state
            pinCode.value = data.pinCode
            postal.value = data.post
            pan.value = data.pan
            gstNo.value = data.gstNo
            poc.value = data.poc
            creditLimit.value = data.creditLimit
            creditDays.value = data.creditDays
            remarks.value = data.remarks
            if(data.blip == true)
            {
                blip.checked = true
            }
            if(data.blackList == true)
            {
                blackList.checked = true
            }


            newCustomer.disabled = false
            customerGroup.disabled = false
            itemGroup.disabled = false
            emailId.disabled = false
            phoneNo.disabled = false
            mobileNo.disabled = false
            line1.disabled = false
            line2.disabled = false
            city.disabled = false
            pinCode.disabled = false
            postal.disabled = false
            pan.disabled = false
            gstNo.disabled = false
            poc.disabled = false
            creditLimit.disabled = false
            creditDays.disabled = false
            remarks.disabled = false
            blip.disabled = false
            blackList.disabled = false
            submitButton.disabled = false

            newCustomer.select()
        }
    })
}

customerGroup.oninput = function showCustomerGroups()
{
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
    fetch('http://localhost:7070/customerGroup/basic/' + customerGroup.value )
    .then( response => response.json())
    .then(data => 
    {
        console.log(data) 
        if(data.code !== 200)
        {
            if(customerGroup.value == '')
            {
            }
            else
            {
                customerGroup.setCustomValidity(customerGroup.value.toUpperCase() + ' does not exist.')
                customerGroup.reportValidity()
            }

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

postal.oninput = function showPosts()
{
    document.getElementById('state').value = ""
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

postal.onblur = function checkPost()
{
    fetch('http://localhost:7070/post/basic/' + postal.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(postal.value == '')
            {
                
            }
            else
            {
                postal.setCustomValidity(postal.value.toUpperCase() + ' does not exist.')
                postal.reportValidity()
            }
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
        fetch('http://localhost:7070/customer/basic/' + customer.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                customer: newCustomer.value.trim().toUpperCase(),
                customerGroup: customerGroup.value.toUpperCase(),                
                dealsIn : itemGroup.value.toUpperCase(),
                emailId: emailId.value,
                phoneNo : phoneNo.value,                
                mobileNo : mobileNo.value,
                line1: line1.value.toUpperCase(),
                line2: line2.value.toUpperCase(),
                city: city.value.toUpperCase(),
                state: state.value.toUpperCase(),
                pinCode: pinCode.value, 
                post : postal.value.toUpperCase(),
                pan: pan.value.toUpperCase(),
                gstNo: gstNo.value.toUpperCase(),
                poc: poc.value.toUpperCase(), 
                creditLimit: creditLimit.value,
                creditDays : creditDays.value,
                blip: blip.checked,
                blackList : blackList.checked,              
                remarks : remarks.value,
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
                newCustomer.select()
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

//CUSTOMER-GROUP
document.getElementById('customerGroup').addEventListener('keydown', (event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/customerGroup/customerGroupNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address)
    }
})

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

//POST
document.getElementById('postal').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/post/postNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})