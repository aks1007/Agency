const item = document.getElementById('item')

window.onload = () => {          
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)

    var check = sessionStorage.getItem('itemKey')
    if(check)
    {            
    document.getElementById('item').value = check
    item.blur()
    sessionStorage.removeItem('itemKey')
    }   
}

item.oninput = function showItems()
{    
    newItem.disabled = true
    hsnCode.disabled = true
    itemGroup.disabled = true
    itemCut.disabled = true
    rpm.disabled = true
    rpp.disabled = true
    submitButton.disabled = true
    fetch('http://localhost:7070/item')
    .then( response => response.json())
    .then(data =>
    {
        var limit = data.count
        var options = ''
        for(i=0;i<limit;i++)
        {
            options += '<option value="' + data.Item[i].item + '">' + data.Item[i].item + '</option>'
        }
        document.getElementById('items').innerHTML=options
    })
    .catch(error =>{
        error.message
    })   
}

item.onblur = function checkItem()
{
    item.value = item.value.trim() 
    fetch('http://localhost:7070/item/' + item.value )
    .then( response => response.json())
    .then(data => 
    {     
        console.log(data)  
        if(data.code !== 200)
        {
            if(item.value == '')
            {
                item.setCustomValidity('Please input Item name')
                item.reportValidity()
            }
            else
            {
                item.setCustomValidity(item.value.toUpperCase() + ' not found.')
                item.reportValidity()
            }
        }

        else
        {
            newItem.value = data.item
            hsnCode.value = data.hsnCode
            itemGroup.value = data.itemGroup
            itemCut.value = data.itemCut
            rpm.value = data.rpm
            rpp.value = data.rpp
            newItem.disabled = false
            hsnCode.disabled = false
            itemGroup.disabled = false
            itemCut.disabled = false
            rpm.disabled = false
            rpp.disabled = false
            submitButton.disabled = false
            newItem.select()
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
        fetch('http://localhost:7070/item/' + item.value, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                item : newItem.value.trim().toUpperCase(),
                hsnCode : hsnCode.value,
                itemGroup : itemGroup.value.trim().toUpperCase(),
                itemCut : itemCut.value,
                rpm : rpm.value,
                rpp : rpp.value
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
                newItem.select()
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

