window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)  
}

function shortCuts(event)
{
    // var event.keyCode = event.keyCode

    if(event.keyCode==27)
    {
        window.location = "../home.html"
    }

    if(event.keyCode==78)
    {
        window.location = "newCompany.html"
    }

    if(event.keyCode==83)
    {
        window.location = "switchCompany.html"
    }

    if(event.keyCode==70)
    {
        window.location = "fiscalYear.html"
    }

    if(event.keyCode==73)
    {
        window.location = "info.html"
    }

    if(event.keyCode==84)
    {
        window.location = "theme.html"
    }

    if(event.altKey && event.keyCode==72)
    {
        window.location = "../home.html"
    }

    if( event.altKey && event.keyCode==77)
    {
        window.location = "../master/master.html"
    }

    if(event.altKey && event.keyCode==82)
    {
        window.location = "../reports/reports.html"
    }

    if(event.altKey && event.keyCode==84)
    {
        window.location = "../transactions/transactions.html"
    }

    if(event.altKey && event.keyCode==68)
    {
        window.location = "../dashboard/dashboard.html"
    }

    if(event.altKey && event.keyCode==67)
    {
        window.location = "../contactUS/contactUs.html"
    }

}

document.getElementById('home').tabIndex = -1;
document.getElementById('master').tabIndex = -1;
document.getElementById('reports').tabIndex = -1;
document.getElementById('transactions').tabIndex = -1;
document.getElementById('dashboard').tabIndex = -1;
document.getElementById('settings').tabIndex = -1;
document.getElementById('contactUs').tabIndex = -1;

