var req

//On Page Load
window.onload = ()=>{
    const bodyTag = document.getElementsByTagName("body")[0]
    const Theme = localStorage.getItem('theme')
    bodyTag.setAttribute('data-theme',Theme)
    items.style.display = 'none'
}

//When focus moves out of Notice Input
document.getElementById('serialNo').addEventListener('input', (event)=>
{
    upload(serialNo.value)
})

//When focus moves out of Serial No.
document.getElementById('serialNo').addEventListener('focusout',(event)=>{
    if(serialNo.value == "")
    {
        forme.reset()
        serialNo.setCustomValidity('Please input a Serial No.')
        serialNo.reportValidity()
    }
})


//Deleting orderForm on submit button click
document.getElementById('submitButton').addEventListener('click', (event) => {
    req = 0
    validateForm()
    if(req == 1)
    {
    }
    if(req==0)
    {
        event.preventDefault()
        //Update Notice
        fetch('http://localhost:7070/orderForm/basic/'+ serialNo.value, { method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            if(data.code == 200)
            {                
                var x = document.getElementById("snackbar");
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showMessage", "");location.reload()}, 2000);
            }
            else
            {
                var x = document.getElementById("snackbar");
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase()
                setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
            }
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.className = "showError";
            x.innerHTML = error.message
            setTimeout(function(){ x.className = x.className.replace("showError", "");location.reload() }, 2000);
        })

        //Delete HTTP Request to OrderForm Items Collection
        fetch('http://localhost:7070/orderItem/basic/'+serialNo.value,{ method: 'DELETE'})
    }  
})

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

//Function to format date
var d = new Date()
function dateFormat(d)
{
    var y = d.getFullYear()
    var m = d.getMonth()+1
    var dt = d.getDate()
    if(dt<10)
    {
        dt = "0" + dt
    }
    if(m<10)
    {
        m = "0" + m
    }
    return y + '-' + m + '-' + dt
}

//Function to reset form
function rl()
{
    location.reload()
}

//Function to upload data 
function upload(num)
{   
    items.style.display = 'none';
    deleteAllItems()
    if(num == "")
    {
    }
    else
    {        
        fetch('http://localhost:7070/orderForm/basic/'+ num)
        .then( response => response.json())
        .then(data => 
        {    
            //Fetches data from database and sends them to the form.     
            //If Notice exists
            if(data.serialNo!=null)
            {
                serialNo.value = data.serialNo
                date.value = dateFormat(new Date(data.date))
                customer.value = data.customer.toUpperCase()
                supplier.value = data.supplier.toUpperCase()
                orderNo.value = data.orderNo
                transporter.value = data.transporter
                cases.value = data.case
                destination.value = data.destination
                remarks.value = data.remarks                
                showAllItems() 
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showMessage";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showMessage", ""); }, 2000);
                localStorage.setItem('orderFormNo',serialNo.value)
            }     
            //If Notice doesn't exist'       
            else
            {
                serialNo.focus()
                //Notifies user through custom response message.
                var x = document.getElementById("snackbar");
                x.innerHTML = ""
                x.className = "showError";
                x.innerHTML = data.message.toUpperCase() 
                setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
                forme.reset()
                serialNo.value = num
                serialNo.onfocusout = () =>{serialNo.focus()}
            }    
        })
        .catch((error) =>
        {            
            //Error Notification
            var x = document.getElementById("snackbar");
            x.innerHTML = ""
            x.className = "showError";
            x.innerHTML = error.message.toUpperCase()
            setTimeout(function(){ x.className = x.className.replace("showError", ""); }, 2000);
            forme.reset();
            serialNo.value = num
            serialNo.onfocusout = () =>{serialNo.focus()}
        })
    }
}

function deleteAllItems()
{
    var table = document.getElementById("items");    
    var rowCount = table.rows.length;
    for( a = rowCount ; a>1 ; a-- )
    {
        table.deleteRow(a-1);
    }
}

function showAllItems()
{
    fetch('http://localhost:7070/orderItem/basic/' + serialNo.value)
    .then(response => response.json())
    .then(data =>
    {
        for(j = 0; j < data.count; j++)
        {            
            items.style.display = 'inline-table';
            var table = document.getElementById('items')

            var rowCount = table.rows.length-1
        
            var row = table.insertRow(rowCount+1)
        
            row.className = "List"

            var cell0 = row.insertCell(0);
            var element1 = document.createElement("input");
            element1.type = "number";
            element1.disabled = true;
            element1.id = "id" + rowCount ;
            element1.value = data.OrderItem[j].id;
            element1.style.textAlign = "center";
            cell0.appendChild(element1);

            var cell1 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.disabled = true;
            element2.type = "text";
            element2.id = "item" + rowCount ;
            element2.placeholder = "ITEM NAME";
            element2.required = true;
            element2.value = data.OrderItem[j].item
            element2.autocomplete = "off";
            element2.setAttribute("list", "itemList")
            element2.setAttribute("onfocus", "showItems()")
            element2.setAttribute("onfocusout","lastRow(" + rowCount + ");"+"checkItem(item" + rowCount + "," + rowCount + ")")
            element2.autocomplete = "off";
            var elementx = document.createElement("datalist");
            elementx.id = "itemList"; 
            cell1.append(element2, elementx);    

            var cell2 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.disabled = true;
            element3.type = "text";
            element3.id = "hsnCode" + rowCount ;
            element3.placeholder = "HSN CODE";
            element3.value = data.OrderItem[j].hsnCode
            element3.style.textAlign = "center";
            cell2.appendChild(element3);

            var cell3 = row.insertCell(3);
            var element4 = document.createElement("input");
            element4.disabled = true;
            element4.type = "number";
            element4.id = "pcs" + rowCount ;
            element4.required = true;
            element4.placeholder = "NO. OF PIECES"
            element4.value = data.OrderItem[j].pcs
            element4.setAttribute("min",0)
            cell3.appendChild(element4);

            var cell4 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.disabled = true;
            element5.type = "numbers";
            element5.id = "cut" + rowCount ;
            element5.placeholder = "ITEM CUT LENGTH"
            element5.required = true;
            element5.value = data.OrderItem[j].cut
            element5.setAttribute("min",0)
            element5.autocomplete = "off";
            cell4.append(element5);

            var cell5 = row.insertCell(5);
            var element6 = document.createElement("input");
            element6.disabled = true;
            element6.type = "number";
            element6.id = "mts" + rowCount ;
            element6.placeholder = "METRES OF CLOTH";
            element6.required = true;
            element6.value = data.OrderItem[j].mts
            element6.setAttribute("min",0)
            cell5.appendChild(element6);

            var cell6 = row.insertCell(6);
            var element7 = document.createElement("input");
            element7.disabled = true;
            element7.type = "number";
            element7.id = "rate" + rowCount ;
            element7.placeholder = "RATE"
            element7.required = true;
            element7.value = data.OrderItem[j].rate
            element7.setAttribute("min",0)
            element7.autocomplete = "off";
            cell6.append(element7);

            var cell7 = row.insertCell(7);
            var element8 = document.createElement("select");
            element8.disabled = true;
            element8.style.width = "100%";
            element8.id = "unit" + rowCount ;
            element8.required = true;
            element8.autocomplete = "off";
            element8.setAttribute("onkeydown","nextRow(event," + rowCount + ")")
            var op1 = document.createElement("option")
            var op2 = document.createElement("option")
            op1.text = "METER";
            op2.text = "PIECE";
            op1.value = "METER";
            op2.value = "PIECE";
            element8.add(op1);
            element8.add(op2);            
            element8.value = data.OrderItem[j].unit
            cell7.append(element8);

            var cell8 = row.insertCell(8);
            var element9 = document.createElement("input");
            element9.disabled = true;
            element9.type = "number";
            element9.id = "amount" + rowCount ;
            element9.placeholder = "AMOUNT"
            element9.disabled = true;
            element9.required = true;
            element9.value = data.OrderItem[j].amount
            cell8.append(element9);

            element6.onfocus = () => {
                var x = element4.value * element5.value
                if(x != NaN) 
                {
                    element6.value = x
                }        
            }

            element8.onblur = () => 
            {
                var x = element8.value
                if(x == 'METER')
                {
                    element9.value = element6.value * element7.value
                }
                if(x == 'PIECE')
                {
                    element9.value = element4.value * element7.value
                }
            } 
        }
    })           
}