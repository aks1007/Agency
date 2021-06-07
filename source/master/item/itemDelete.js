const item = document.getElementById('item')

document.getElementById('submitButton').addEventListener('click', (event) => {

    if( item.value == ""){}
    
    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/item/'+ item.value , { method: 'DELETE'})
        .then(response => response.json())
        .then(data => 
        {
            if(data.code == 200)
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
            //In case any error is encountered.
            var x = document.getElementById("snackbar");
            x.className = "showError";
            y =  error.message.toUpperCase()
            if(y = 'Request failed with status code 404')
            {
                x.innerHTML = item.value.toUpperCase() + " NOT FOUND!"
            }
            else
            {
                x.innerHTML = error.message.toUpperCase()
            }
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })
    }  
})

function showItems()
{
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

function checkItem()
{
    fetch('http://localhost:7070/item/' + item.value )
    .then( response => response.json())
    .then(data => 
    {
        
        if(data.code !== 200)
        {
            if(item.value == '')
            {
                    //Notifies user through custom response message.
                    var x = document.getElementById("snackbar");
                    x.className = "showError";
                    x.innerHTML = "PLEASE INPUT AN ITEM FIRST"
                    setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                    item.focus()
            }
            else
            {
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = item.value +  " DOES NOT EXIST!"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                item.focus()
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
}

