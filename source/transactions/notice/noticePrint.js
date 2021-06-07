const ipcRenderer = require('electron').ipcRenderer

const serialNo = localStorage.getItem('noticeNo')
const date = document.getElementById('date')
const subject = document.getElementById('subject')
var to = document.getElementById('to')
const notice = document.getElementById('notice')

window.onload = () =>
{       
    //GENERATE PRINT FORM
    fetch('http://localhost:7070/notice/basic/'+ serialNo)
    .then( response => response.json())
    .then(data =>
    {          
        if(data.notice!=null)
        {
            companyName.innerHTML = localStorage.getItem("companyName")            
            subject.innerHTML = data.subject.toUpperCase()
            date.innerHTML = "DATE : " + dateFormat(new Date(data.date))
            to.innerHTML = data.to + ","
            notice.innerHTML = data.notice
        }             
    })
    .catch((error) =>
    { 
        console.log(error)    
    })

    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)  

    fileName = "Notice" + serialNo + ".pdf"
    var size = 'A5'
    var landscape = true
    setTimeout(function()
    {   
     ipcRenderer.send('print', fileName, size , landscape )
     var x = localStorage.getItem("noticeBack")
     if(x == 0) 
     {
        window.location = "./noticeNew.html"        
     } 
     if(x == 1)
     {
         window.location = "./noticeUpdate.html"
     }   
    },2000)    
}

var d = new Date()
function dateFormat(d)
{
    var y = d.getFullYear()
    var dt = d.getDate()
    if(dt<10)
    {
        dt = "0" + dt
    }
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    m = months[d.getMonth()];
    return dt + ' ' + m + ' ' + y
}

    




 


