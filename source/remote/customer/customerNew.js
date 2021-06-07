const submitButton = document.getElementById('submitButton')
var customerName = document.getElementById('customer')
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

    if( customerName.value == ""){}

    else
    {
        fetch('http://localhost:7070/customer/basic', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                customer: customerName.value.toUpperCase(),
                customerGroup: customerGroup.value.toUpperCase(),                
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
                creditLimit: creditLimit.value,
                creditDays : creditDays.value,
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

function showCustomerGroups()
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

function checkCustomerGroup()
{
    fetch('http://localhost:7070/customerGroup/' + customerGroup.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(customerGroup.value == '')
            {
                
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = customerGroup.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                customerGroup.focus()
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
