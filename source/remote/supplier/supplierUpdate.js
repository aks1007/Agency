const { post } = require('jquery')
const { disconnect } = require('mongoose')

const supplier = document.getElementById('supplier')

window.onload = () => {          
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('supplierKey')
    if(check)
    {            
    document.getElementById('supplier').value = check
    supplier.blur()
    sessionStorage.removeItem('supplierKey')
    }   
}

supplier.oninput = function showSuppliers()
{    
    newSupplier.disabled = true
    supplierGroup.disabled = true
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
    ddl.disabled = true
    rdpp.disabled = true
    rdpm.disabled = true
    cp.disabled = true
    discount.disabled = true
    remarks.disabled = true
    blip.disabled = true
    blackList.disabled = true
    submitButton.disabled = true
    fetch('http://localhost:7070/supplier/basic')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Supplier[i].supplier + '">' + data.Supplier[i].supplier + '</option>'
        }
        document.getElementById('suppliers').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

supplier.onblur = function checkSupplier()
{
    supplier.value = supplier.value.trim() 
    fetch('http://localhost:7070/supplier/basic/' + supplier.value )
    .then( response => response.json())
    .then(data => 
    {      
        if(data.code !== 200)
        {
            if(supplier.value == '')
            {
                supplier.setCustomValidity('Please input Supplier name')
                supplier.reportValidity()
            }
            else
            {
                supplier.setCustomValidity(supplier.value.toUpperCase() + ' not found.')
                supplier.reportValidity()
            }
        }

        else
        {
            newSupplier.value = data.supplier 
            supplierGroup.value = data.supplierGroup   
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
            ddl.value = data.ddl
            rdpp.value = data.rdpp
            rdpm.value = data.rdpm
            cp.value = data.cp
            discount.value = data.discount
            remarks.value = data.remarks
            if(data.blip == true)
            {
                blip.checked = true
            }
            if(data.blackList == true)
            {
                blackList.checked = true
            }


            newSupplier.disabled = false
            supplierGroup.disabled = false
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
            ddl.disabled = false
            rdpp.disabled = false
            rdpm.disabled = false
            cp.disabled = false
            discount.disabled = false
            remarks.disabled = false
            blip.disabled = false
            blackList.disabled = false
            submitButton.disabled = false

            newSupplier.select()
        }
    })
}

supplierGroup.oninput = function showSupplierGroups()
{
    fetch('http://localhost:7070/supplierGroup')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.SupplierGroup[i].supplierGroup + '">' + data.SupplierGroup[i].supplierGroup + '</option>'
        }
        document.getElementById('supplierGroups').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

supplierGroup.onblur = function checkSupplierGroup()
{
    fetch('http://localhost:7070/supplierGroup/' + supplierGroup.value )
    .then( response => response.json())
    .then(data => 
    {
        console.log(data) 
        if(data.code !== 200)
        {
            if(supplierGroup.value == '')
            {
            }
            else
            {
                supplierGroup.setCustomValidity(supplierGroup.value.toUpperCase() + ' does not exist.')
                supplierGroup.reportValidity()
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
    fetch('http://localhost:7070/post/' + postal.value )
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
        fetch('http://localhost:7070/supplier/basic/' + supplier.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                supplier: newSupplier.value.trim().toUpperCase(),
                supplierGroup: supplierGroup.value.toUpperCase(),                
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
                ddl : ddl.value,
                rdpp : rdpp.value,
                rdpm : rdpm.value,
                cp : cp.value,
                discount : discount.value,
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
                newSupplier.select()
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

//SUPPLIER-GROUP
document.getElementById('supplierGroup').addEventListener('keydown', (event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/supplierGroup/supplierGroupNew.html'
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