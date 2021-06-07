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

    if(event.keyCode==73)
    {
        window.location = "./invoice/invoiceHome.html"
    }

    if(event.keyCode==80)
    {
        window.location = "./payment/paymentHome.html"
    }

    if(event.keyCode==66)
    {
        window.location = "./brokerage/brokerageHome.html"
    }

    if(event.keyCode==71)
    {
        window.location = "./goodsReturn/goodsReturnHome.html"
    }

    if(event.keyCode==79)
    {
        window.location = "./orderForm/orderFormHome.html"
    }

    if(event.keyCode==78)
    {
        window.location = "./notice/noticeHome.html"
    }

    if(event.keyCode==77)
    {
        window.location = "./mail/mailHome.html"
    }

    if(event.altKey && event.keyCode==72)
    {
        window.location = "../home.html"
    }

    if(event.altKey && event.keyCode==82)
    {
        window.location = "../reports/reports.html"
    }

    if(event.altKey && event.keyCode==77)
    {
        window.location = "../master/master.html"
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
}

document.getElementById('home').tabIndex = -1;
document.getElementById('master').tabIndex = -1;
document.getElementById('reports').tabIndex = -1;
document.getElementById('transactions').tabIndex = -1;
document.getElementById('dashboard').tabIndex = -1;
document.getElementById('settings').tabIndex = -1;
document.getElementById('contactUs').tabIndex = -1;