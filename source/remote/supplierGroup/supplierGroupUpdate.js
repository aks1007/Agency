const submitButton = document.getElementById('submitButton')
var supplierGroup = document.getElementById('supplierGroup')
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

document.getElementById('submitButton').addEventListener('click', (event) => 
{
    if( supplierGroup.value == ""){}
    
    else
    {        
        event.preventDefault()
        fetch('http://localhost:7070/supplierGroup/'+ supplierGroup.value )
        .then( response => response.json())
        .then(data => 
        {    
            document.getElementById("snackbar").className = ""
            //Fetches data from database and sends them to the form.       
            console.log(data)
            if(data.supplierGroup!=null)
            {
                supplierGroup.value = data.supplierGroup.toUpperCase(),
                dealsIn.value = data.dealsIn.toUpperCase(),
                poc.value = data.poc.toUpperCase(),
                emailId.value = data.emailId,
                phoneNo.value = data.phoneNo,
                mobileNo.value = data.mobileNo
                line1.value = data.line1.toUpperCase(),
                line2.value = data.line2.toUpperCase(),
                city.value = data.city.toUpperCase(),
                state.value = data.state.toUpperCase(),
                pinCode.value = data.pinCode,
                cp.value = data.cp,
                remarks.value = data.remarks
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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "PLEASE INPUT A CUSTOMER GROUP FIRST"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                supplierGroup.focus()
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

function resetForm(){
    document.getElementById('forme').reset()
}

window.onload = ()=>{        
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
    
    var check = sessionStorage.getItem('supplierGroupKey')
    if(check)
    {            
        document.getElementById('supplierGroup').value = check
        document.getElementById('submitButton').click()
        document.getElementById('submitButton').focus()
        sessionStorage.removeItem('supplierGroupKey')
    }
}