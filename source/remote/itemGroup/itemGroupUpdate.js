window.onload = () => {  

        
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('itemGroupKey')
    if(check)
    {            
    document.getElementById('itemGroup').value = check
    itemGroup.blur()
    sessionStorage.removeItem('itemGroupKey')
    }   
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
    itemGroup.value = itemGroup.value.trim()
    fetch('http://localhost:7070/itemGroup/' + itemGroup.value )
    .then( response => response.json())
    .then(data => 
    {
        if(data.code !== 200)
        {
            if(itemGroup.value == '')
            {
                itemGroup.setCustomValidity('Please input Item Group name')
                itemGroup.reportValidity()
            }
            else
            {
                itemGroup.setCustomValidity(itemGroup.value.toUpperCase() + ' not found.')
                itemGroup.reportValidity()
            }
        }

        else
        {
            newItemGroup.value = data.itemGroup
            newItemGroup.disabled = false
            submitButton.disabled = false
            newItemGroup.select()
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

document.getElementById('submitButton').addEventListener('click', (event) => 
{    
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {    
        fetch('http://localhost:7070/itemGroup/'+ itemGroup.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                itemGroup : newItemGroup.value.trim().toUpperCase(),
            })
        })
        .then( response => response.json())
        .then(data => 
        {    
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
                newItemGroup.select()
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
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
