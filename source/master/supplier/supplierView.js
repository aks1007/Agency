const submitButton = document.getElementById('submitButton')
var supplier = document.getElementById('supplier')
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

var poc = document.getElementById('poc')
var remarks = document.getElementById('remarks')

document.getElementById('submitButton').addEventListener('click', (event) => 
{
    if( supplier.value == ""){}
    
    else
    {        
        event.preventDefault()
        fetch('http://localhost:7070/supplier/basic/'+ supplier.value )
        .then( response => response.json())
        .then(data => 
        {    
            document.getElementById("snackbar").className = ""
            //Fetches data from database and sends them to the form.       
            console.log(data)
            if(data.supplier!=null)
            {
                supplier.value = data.supplier.toUpperCase(),
                supplierGroup.value = data.supplierGroup.toUpperCase(),
                dealsIn.value = data.dealsIn.toUpperCase(),
                emailId.value = data.emailId,
                phoneNo.value = data.phoneNo,
                mobileNo.value = data.mobileNo,
                line1.value = data.line1.toUpperCase(),
                line2.value = data.line2.toUpperCase(),
                city.value = data.city.toUpperCase(),
                state.value = data.state.toUpperCase(),
                pinCode.value = data.pinCode,
                post.value = data.post.toUpperCase(),
                pan.value = data.pan.toUpperCase(),
                gstNo.value = data.gstNo.toUpperCase(),
                poc.value = data.poc.toUpperCase(),
                ddl.value = data.ddl,
                rdpp.value = data.rdpp,
                rdpm.value = data.rdpm,
                cp.value = data.cp,
                discount.value = data.discount,
                remarks.value = data.remarks
                if(data.blip == true)
                {
                    blip.checked = true
                }
                if(data.blackList == true)
                {
                    blackList.checked = true
                }
            }            
            if(data.code == 200)
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");}, 2000);
            }  
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
                supplier.select()
                supplier.value = ""
                supplierGroup.value = "",
                dealsIn.value = "",
                emailId.value = "",
                phoneNo.value = "",
                mobileNo.value = "",
                line1.value = "",
                line2.value = "",
                city.value = "",
                state.value = "",
                pinCode.value = "",
                post.value = "",
                pan.value = "",
                gstNo.value = "",
                poc.value = "",
                ddl.value = "",
                rdpp.value = "",
                rdpm.value = "",
                cp.value = "",
                discount.value = "",
                remarks.value = ""
                blip.checked = false,
                blackList.checked = false
            }  
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
            document.getElementById('forme').reset()
        })
    }  
})

function showSuppliers()
{
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

function checkSupplier()
{
    fetch('http://localhost:7070/supplier/basic/' + supplier.value )
    .then( response => response.json())
    .then(data => 
    {
        console.log(data)
        if(data.code !== 200)
        {
            if(supplier.value == '')
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "PLEASE INPUT A SUPPLIER FIRST"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                supplier.focus()
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = supplier.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                supplier.focus()
            }

        }
    })
}

function resetForm(){
    document.getElementById('forme').reset()
}

window.onload = ()=>{        
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
    
    var check = sessionStorage.getItem('supplierKey')
    if(check)
    {            
        document.getElementById('supplier').value = check
        document.getElementById('submitButton').click()
        document.getElementById('submitButton').focus()
        sessionStorage.removeItem('supplierKey')
    }
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