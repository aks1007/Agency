window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    if(!(localStorage.getItem('theme')))
    {
        localStorage.setItem('theme','classic')
    }
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
    agencyname.innerHTML = localStorage.getItem('companyName')
}

function shortCuts(event)
{
    var x = event.keyCode

    if(event.altKey && x==77 || x==77)
    {
        window.location = "./master/master.html"
    }

    if(event.altKey && x==82 || x==82)
    {
        window.location = "./reports/reports.html"
    }

    if(event.altKey && x==84 || x==84)
    {
        window.location = "./transactions/transactions.html"
    }

    if(x==68)
    {
        window.location = "./dashboard/dashboard.html"
    }

    if(event.altKey && x==83 || x==83)
    {
        window.location = "./settings/settings.html"
    }

    if(event.altKey && x==67 || x==67)
    {
        window.location = "./contactUS/contactUS.html"
    }
}

document.getElementById('exit').tabIndex = -1;