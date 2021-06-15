window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
}

function shortCuts(event)
{

    if(event.keyCode==27)
    {
        window.location = "../home.html"
    }

    if(event.keyCode == 67)
    {
        window.location = "./customer/customerHome.html"
    }

    if(event.keyCode == 83)
    {
        window.location = "./supplier/supplierHome.html"
    }

    if(event.keyCode == 73)
    {
        window.location = "./item/itemHome.html"
    }

    if(event.ctrlKey && event.keyCode == 67)
    {
        window.location = "./customerGroup/basic/customerGroupHome.html"
    }

    if(event.ctrlKey && event.keyCode == 83)
    {
        window.location = "./supplierGroup/basic/supplierGroupHome.html"
    }

    if(event.ctrlKey && event.keyCode == 73)
    {
        window.location = "./itemGroup/itemGroupHome.html"
    }

    if(event.keyCode == 77)
    {
        window.location = "./market/marketHome.html"
    }

    if(event.keyCode == 66)
    {
        window.location = "./bank/bankHome.html"
    }

    if(event.keyCode == 84)
    {
        window.location = "./transporter/transporterHome.html"
    }

    if(event.keyCode == 76)
    {
        window.location = "./location/locationHome.html"
    }

    if(event.keyCode == 80)
    {
        window.location = "./post/postHome.html"
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

    if(event.altKey && event.keyCode==83)
    {
        window.location = "../settings/settings.html"
    }

    if(event.altKey && event.keyCode==67)
    {
        window.location = "../contactUS/contactUs.html"
    }

    if(event.altKey && event.keyCode==72)
    {
        window.location = "../home.html"
    }
}

document.getElementById('home').tabIndex = -1;
document.getElementById('master').tabIndex = -1;
document.getElementById('reports').tabIndex = -1;
document.getElementById('transactions').tabIndex = -1;
document.getElementById('dashboard').tabIndex = -1;
document.getElementById('settings').tabIndex = -1;
document.getElementById('contactUs').tabIndex = -1;