const ipcRenderer = require('electron').ipcRenderer

window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme) 
}

function shortCuts(event)
{

    if(event.altKey && event.keyCode==27)
    {
        window.location = "../reports.html"
    }

    if(event.keyCode==27)
    {
        window.location = "../reports.html"
    }

    if(event.altKey && event.keyCode==83)
    {
        window.location = "./sales/salesHome.html"
    }

    if(event.altKey && event.keyCode==80)
    {
        window.location = "./payment/paymentHome.html"
    }

    if(event.altKey && event.keyCode==66)
    {
        window.location = "./brokerage/brokerageHome.html"
    }

    if(event.altKey && event.keyCode==71)
    {
        window.location = "./goodsReturn/goodsReturnHome.html"
    }

    if(event.altKey && event.keyCode==79)
    {
        window.location = "./other/otherHome.html"
    }

    if(event.keyCode == 49)
    {
        openReport('source/reports/other/addressList.html')
    }

    if(event.keyCode == 50)
    {
        window.location = "dealingReport.html"
    }

    if(event.keyCode == 51)
    {
        openReport('source/reports/other/lrReport.html')
    }

    if(event.keyCode == 52)
    {
        window.location = "ledgerReport.html"
    }

    if(event.keyCode == 53)
    {
        window.location = "outstandingReport.html"
    }

    if(event.keyCode == 54)
    {
        window.location = "biltyReport.html"
    }

    if(event.keyCode == 55)
    {
        window.location = "postReceivedRegister.html"
    }

    if(event.keyCode == 56)
    {
        window.location = "tdsReceivableReport.html"
    }

    if(event.keyCode == 57)
    {
        window.location = "issueOrderRegister.html"
    }
}

var address
function openReport(address)
{
    ipcRenderer.send('reportWindow', address)
}

document.getElementById('addressList').onclick = () =>
{
    openReport('source/reports/other/addressList.html')
}    

document.getElementById('back').tabIndex = -1;
document.getElementById('sales').tabIndex = -1;
document.getElementById('payment').tabIndex = -1;
document.getElementById('brokerage').tabIndex = -1;
document.getElementById('goodsReturn').tabIndex = -1;
document.getElementById('other').tabIndex = -1;