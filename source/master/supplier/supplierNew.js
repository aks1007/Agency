const submitButton = document.getElementById('submitButton')
var supplierName = document.getElementById('supplier')
var supplierGroup = document.getElementById('supplierGroup')
var dealsIn = document.getElementById('dealsIn')
var emailId = document.getElementById('emailId')
var phoneNo = document.getElementById('phoneNo')
var mobileNo = document.getElementById('mobileNo')
var line1 = document.getElementById('line1')
var line2 = document.getElementById('line2')
var city = document.getElementById('city')
var state = document.getElementById('state')
var pinCode = document.getElementById('pinCode')
var post = document.getElementById('post')
var pan = document.getElementById('pan')
var gstNo = document.getElementById('gstNo')
var poc = document.getElementById('poc')
var ddl = document.getElementById('ddl')
var rdpp = document.getElementById('rdpp')
var rdpm = document.getElementById('rdpm')
var cp = document.getElementById('cp')
var discount = document.getElementById('discount')
var blip = document.getElementById('blip')
var blackList = document.getElementById('blackList')
var remarks = document.getElementById('remarks')

submitButton.addEventListener('click', (event) => {

    //Checkboxes Validation
    if(blip.checked === true)
    {
        blip.value = true
    }

    if(blackList.checked == true)
    {
        blackList.value = true
    }

    if( supplierName.value == ""){}

    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/supplier/basic', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                supplier: supplierName.value.trim().toUpperCase(),
                supplierGroup: supplierGroup.value.toUpperCase(),                
                dealsIn : dealsIn.value.toUpperCase(),
                emailId: emailId.value,
                phoneNo : phoneNo.value,                
                mobileNo : mobileNo.value,
                line1: line1.value.toUpperCase(),
                line2: line2.value.toUpperCase(),
                city: city.value.toUpperCase(),
                state: state.value.toUpperCase(),
                pinCode: pinCode.value, 
                post : post.value.toUpperCase(),
                pan: pan.value.toUpperCase(),
                gstNo: gstNo.value.toUpperCase(),
                poc: poc.value.toUpperCase(),
                ddl : ddl.value,
                rdpp : rdpp.value,
                rdpm : rdpm.value,
                cp : cp.value,
                discount : discount.value,
                blip: blip.value,
                blackList : blackList.value,              
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

function showSupplierGroups()
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

function checkSupplierGroup()
{
    fetch('http://localhost:7070/supplierGroup/' + supplierGroup.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(supplierGroup.value == '')
            {
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = supplierGroup.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                supplierGroup.focus()
            }

        }
    })
}

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

function showPosts()
{
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

function checkPost()
{
    fetch('http://localhost:7070/post/' + post.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(post.value == '')
            {
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = post.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                post.focus()
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

//CUSTOMER-GROUP
document.getElementById('supplierGroup').addEventListener('keydown',(event,keyCode)=>{
    var x = event.keyCode

    if(x==112)
    {
        var address = 'source/remote/supplierGroup/supplierGroupNew.html'
        const ipcRenderer = require('electron').ipcRenderer
        ipcRenderer.send('remoteWindow', address )
    }
})

//ITEM-GROUP
document.getElementById('dealsIn').addEventListener('keydown',(event,keyCode)=>{
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
