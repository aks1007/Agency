const post = document.getElementById('post')

document.getElementById('submitButton').addEventListener('click', (event) => {

    if( post.value == ""){}
    
    else
    {
        event.preventDefault()
        fetch('http://localhost:7070/post/'+ post.value , { method: 'DELETE'})
        .then(response => response.json())
        .then(data => 
        {
            console.log(data)
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
                x.innerHTML = post.value.toUpperCase() + " NOT FOUND!"
            }
            else
            {
                x.innerHTML = error.message.toUpperCase()
            }
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })
    }  
})

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
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = "PLEASE INPUT A POST FIRST"
                setTimeout(function(){ x.className = x.className.replace("showError", "");}, 2000);
                post.focus()
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