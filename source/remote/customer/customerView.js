const submitButton = document.getElementById('submitButton')
var customer = document.getElementById('customer')
var customerGroup = document.getElementById('customerGroup')
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
var creditLimit = document.getElementById('creditLimit')
var creditDays = document.getElementById('creditDays')
var blip = document.getElementById('blip')
var blackList = document.getElementById('blackList')
var remarks = document.getElementById('remarks')

var poc = document.getElementById('poc')
var remarks = document.getElementById('remarks')

document.getElementById('submitButton').addEventListener('click', (event) => 
{
    if( customer.value == ""){}
    
    else
    {        
        event.preventDefault()
        fetch('http://localhost:7070/customer/basic/'+ customer.value )
        .then( response => response.json())
        .then(data => 
        {    
            document.getElementById("snackbar").className = ""
            //Fetches data from database and sends them to the form.       
            console.log(data)
            if(data.customer!=null)
            {
                customer.value = data.customer.toUpperCase(),
                customerGroup.value = data.customerGroup.toUpperCase(),
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
                creditLimit.value = data.creditLimit,
                creditDays.value = data.creditDays,
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

function showCustomers()
{
    fetch('http://localhost:7070/customer/basic')
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

function checkCustomer()
{
    fetch('http://localhost:7070/customer/basic/' + customer.value )
    .then( response => response.json())
    .then(data => 
    {
        console.log(data)
        if(data.code !== 200)
        {
            if(customer.value == '')
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "PLEASE INPUT A CUSTOMER FIRST"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                customer.focus()
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = customer.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                customer.focus()
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

    var check = sessionStorage.getItem('customerKey')
    if(check)
    {            
        document.getElementById('customer').value = check
        document.getElementById('submitButton').click()
        document.getElementById('submitButton').focus()
        sessionStorage.removeItem('customerKey')
    }
}