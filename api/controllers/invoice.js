const transaction = require('../models/conn').transaction
const Invoice = transaction.model('Invoice')

//DISPLAYING ALL INVOICES
exports.getAllInvoices = (req, res, next) => {
    Invoice.find().sort({serialNo : 1}).lean()
    .select('serialNo entryNo billNo orderNo date subAgent customer supplier transporter destination cases lrNo lrDate ca pcP pc rdP rd ddP dd discP disc scP sc slP sl cgstP cgst sgstP sgst igstP igst netAmount remarks status grA paid')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Invoice : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    entryNo : doc.entryNo,
                    billNo : doc.billNo,
                    orderNo : doc.orderNo,
                    date : doc.date,
                    subAgent : doc.subAgent,
                    customer : doc.customer,
                    supplier : doc.supplier,
                    transporter : doc.transporter,
                    destination : doc.destination,
                    cases : doc.cases,
                    lrNo : doc.lrNo,
                    lrDate : doc.lrDate,
                    ca : doc.ca,
                    pcP : doc.pcP,
                    pc : doc.pc,
                    rdP : doc.rdP,
                    rd : doc.rd,
                    ddP : doc.ddP,
                    dd : doc.dd,
                    discP : doc.discP,
                    disc : doc.disc,
                    scP : doc.scP,
                    sc : doc.sc,
                    slP : doc.slP,
                    sl : doc.sl,
                    cgstP : doc.cgstP,
                    cgst : doc.cgst,
                    sgstP : doc.sgstP,
                    sgst : doc.sgst,
                    igstP : doc.igstP,
                    igst : doc.igst,
                    netAmount : doc.netAmount,
                    remarks : doc.remarks,
                    status : doc.status, 
                    grA : doc.grA,
                    paid : doc.paid 
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ 
            code : 500,
            error : err })
    })    
}



//CREATING A NEW INVOICE
exports.postOneInvoice = (req, res, next) => {
    const invoice = new Invoice({
        serialNo : req.body.serialNo,
        entryNo : req.body.entryNo,
        billNo : req.body.billNo,
        orderNo : req.body.orderNo,
        date : req.body.date,
        subAgent : req.body.subAgent,
        customer : req.body.customer,
        supplier : req.body.supplier,
        transporter : req.body.transporter,
        destination : req.body.destination,
        cases : req.body.cases,
        lrNo : req.body.lrNo,
        lrDate : req.body.lrDate,
        ca : req.body.ca,
        pcP : req.body.pcP,
        pc : req.body.pc,
        rdP : req.body.rdP,
        rd : req.body.rd,
        ddP : req.body.ddP,
        dd : req.body.dd,
        discP : req.body.discP,
        disc : req.body.disc,
        scP : req.body.scP,
        sc : req.body.sc,
        slP : req.body.slP,
        sl : req.body.sl,
        cgstP : req.body.cgstP,
        cgst : req.body.cgst,
        sgstP : req.body.sgstP,
        sgst : req.body.sgst,
        igstP : req.body.igstP,
        igst : req.body.igst,
        netAmount : req.body.netAmount,
        remarks : req.body.remarks,
        status : req.body.status,
        grA : 0,
        paid : 0,    
    })
    id = req.body.serialNo
    //Look for invoice
    Invoice.findOne({serialNo : id})
    .collation({ "locale": "en", "strength": 2 })
    .then((doc)=>
    {
        //If Invoice exists
        if(doc)
        {            
            res.status(409).json({
                code : 409,
                message : "Invoice No. " + id + " already exists."
            })
        }
        //If Invoice doesn't exist
        else
        {
            invoice.save()
            .then(()=> {
                res.status(201).json({
                    code : 201,
                    message: "Invoice No. " + id + ' recorded successfully',
                })
            })
            .catch( error => {
                //If error is encountered while sending data to Database
                 console.log(error) 
                 res.status(500).json({ 
                    code : 500, 
                    error: error.message })
            }) 
        }
    })
    .catch(error =>
    {
        //If any other error encountered
        console.log(error)
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
        console.log(res)
    })
}

//DISPLAYING ONE INVOICE
exports.getOneInvoice = (req, res, next) => 
{
    var id = req.params.serialNo
    Invoice.findOne({serialNo:id}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {
        //Executed if documnet exists
        if(doc){
            res.status(200).json({
                code : 200,
                message: "Invoice No. " + id + " Found!",
                serialNo : doc.serialNo,
                entryNo : doc.entryNo,
                billNo : doc.billNo,
                orderNo : doc.orderNo,
                date : doc.date,
                subAgent : doc.subAgent,
                customer : doc.customer,
                supplier : doc.supplier,
                transporter : doc.transporter,
                destination : doc.destination,
                cases : doc.cases,
                lrNo : doc.lrNo,
                lrDate : doc.lrDate,
                ca : doc.ca,
                pcP : doc.pcP,
                pc : doc.pc,
                rdP : doc.rdP,
                rd : doc.rd,
                ddP : doc.ddP,
                dd : doc.dd,
                discP : doc.discP,
                disc : doc.disc,
                scP : doc.scP,
                sc : doc.sc,
                slP : doc.slP,
                sl : doc.sl,
                cgstP : doc.cgstP,
                cgst : doc.cgst,
                sgstP : doc.sgstP,
                sgst : doc.sgst,
                igstP : doc.igstP,
                igst : doc.igst,
                netAmount : doc.netAmount,
                remarks : doc.remarks,
                status : doc.status, 
                grA : doc.grA,
                paid : doc.paid
            })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "Invoice No. " + id + " Not Found!"
            })
        }
    })
    .catch(error =>
    {
        //If any other error encountered
        console.log(error)
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
        console.log(res)
    })              
}              



//UPDATING ONE INVOICE
exports.putOneInvoice = (req, res, next) => 
{
    id = req.params.serialNo
    Invoice.updateOne({ serialNo: id }, { $set : req.body})
    .collation({ "locale": "en", "strength": 2 })
    .then(()=> {
        res.status(200).json({
            code : 200,
            message : "Invoice No. " + id + " has been updated successfully!",
        })
    })
    .catch( error => {
        console.log(error)
        res.status(409).json({ 
            code : 409,
            message: "Invoice No. " + id + " already exists."})
    })
}



//DELETING ONE INVOICE
exports.deleteOneInvoice = (req, res, next) =>
{
    const id = req.params.serialNo
    Invoice.deleteOne({ serialNo: id})
    .collation({ "locale": "en", "strength": 2 })            
    .then( doc =>{
        res.status(200).json({
            code : 200,
            message : "Invoice No. " + id + " has been deleted successfully",
        })    
    })
    //Catch any errors encountered during deleting Invoice from database
    .catch(error => 
    {
        res.status(404).json({ 
            code : 404,
            message : "Invoice No. " + id + "Not Found" }
        )
    })
}   


//GETTING LAST INVOICE NO.
exports.getLastInvoice = (req, res, next) => {
    Invoice.find().sort({serialNo : -1}).limit(1).lean()
    .select('serialNo')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Invoice : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ 
            code : 500,
            error : err })
    })    
}


//GETTING ALL INVOICE FALLING WITHIN A DATE RANGE
exports.getRangeInvoices = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    Invoice.find({date : { $gte : new Date(from), $lt : new Date(to)}}).sort({billNo : 1}).lean()
    .select('serialNo entryNo billNo orderNo date subAgent customer supplier transporter destination cases lrNo lrDate ca pcP pc rdP rd ddP dd discP disc scP sc slP sl cgstP cgst sgstP sgst igstP igst netAmount remarks status')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Invoice : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    entryNo : doc.entryNo,
                    billNo : doc.billNo,
                    orderNo : doc.orderNo,
                    date : doc.date,
                    subAgent : doc.subAgent,
                    customer : doc.customer,
                    supplier : doc.supplier,
                    transporter : doc.transporter,
                    destination : doc.destination,
                    cases : doc.cases,
                    lrNo : doc.lrNo,
                    lrDate : doc.lrDate,
                    ca : doc.ca,
                    pcP : doc.pcP,
                    pc : doc.pc,
                    rdP : doc.rdP,
                    rd : doc.rd,
                    ddP : doc.ddP,
                    dd : doc.dd,
                    discP : doc.discP,
                    disc : doc.disc,
                    scP : doc.scP,
                    sc : doc.sc,
                    slP : doc.slP,
                    sl : doc.sl,
                    cgstP : doc.cgstP,
                    cgst : doc.cgst,
                    sgstP : doc.sgstP,
                    sgst : doc.sgst,
                    igstP : doc.igstP,
                    igst : doc.igst,
                    netAmount : doc.netAmount,
                    remarks : doc.remarks,
                    status : doc.status, 
                    grA : doc.grA,
                    paid : doc.paid
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ 
            code : 500,
            error : err })
    })    
}

//DISPLAYING ALL INVOICES FROM A SPECIFIC COMBINATION OF CUSTOMER AND SUPPLIER 
exports.getAllInvoicesFromCombo = (req, res) => {
    var customer = req.params.customer
    var supplier = req.params.supplier
    Invoice.find({customer: customer, supplier: supplier, status: 'PENDING'}).sort({billNo : 1}).lean()
    .select('serialNo entryNo billNo orderNo date subAgent customer supplier transporter destination cases lrNo lrDate ca pcP pc rdP rd ddP dd discP disc scP sc slP sl cgstP cgst sgstP sgst igstP igst netAmount remarks status')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Invoice : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    entryNo : doc.entryNo,
                    billNo : doc.billNo,
                    orderNo : doc.orderNo,
                    date : doc.date,
                    subAgent : doc.subAgent,
                    customer : doc.customer,
                    supplier : doc.supplier,
                    transporter : doc.transporter,
                    destination : doc.destination,
                    cases : doc.cases,
                    lrNo : doc.lrNo,
                    lrDate : doc.lrDate,
                    ca : doc.ca,
                    pcP : doc.pcP,
                    pc : doc.pc,
                    rdP : doc.rdP,
                    rd : doc.rd,
                    ddP : doc.ddP,
                    dd : doc.dd,
                    discP : doc.discP,
                    disc : doc.disc,
                    scP : doc.scP,
                    sc : doc.sc,
                    slP : doc.slP,
                    sl : doc.sl,
                    cgstP : doc.cgstP,
                    cgst : doc.cgst,
                    sgstP : doc.sgstP,
                    sgst : doc.sgst,
                    igstP : doc.igstP,
                    igst : doc.igst,
                    netAmount : doc.netAmount,
                    remarks : doc.remarks,
                    status : doc.status, 
                    grA : doc.grA,
                    paid : doc.paid  
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ 
            code : 500,
            error : err })
    })    
} 

//DISPLAYING ONE INVOICE FROM INVOICE NO. WHICH IS NOT SETTLED
exports.getOneInvoiceFromBill = (req, res, next) => 
{
    var id = req.params.billNo
    var customer = req.params.customer
    var supplier = req.params.supplier
    Invoice.findOne({billNo:id,customer: customer, supplier: supplier,status: 'PENDING'}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {        
        //Executed if document exists
        if(doc){
            res.status(200).json({
                code : 200,
                serialNo : doc.serialNo,
                entryNo : doc.entryNo,
                billNo : doc.billNo,
                orderNo : doc.orderNo,
                date : doc.date,
                subAgent : doc.subAgent,
                customer : doc.customer,
                supplier : doc.supplier,
                transporter : doc.transporter,
                destination : doc.destination,
                cases : doc.cases,
                lrNo : doc.lrNo,
                lrDate : doc.lrDate,
                ca : doc.ca,
                pcP : doc.pcP,
                pc : doc.pc,
                rdP : doc.rdP,
                rd : doc.rd,
                ddP : doc.ddP,
                dd : doc.dd,
                discP : doc.discP,
                disc : doc.disc,
                scP : doc.scP,
                sc : doc.sc,
                slP : doc.slP,
                sl : doc.sl,
                cgstP : doc.cgstP,
                cgst : doc.cgst,
                sgstP : doc.sgstP,
                sgst : doc.sgst,
                igstP : doc.igstP,
                igst : doc.igst,
                netAmount : doc.netAmount,
                remarks : doc.remarks,
                status : doc.status, 
                grA : doc.grA,
                paid : doc.paid 
            })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(400).json({
                code : 400,
                message: "Invoice No. " + id + " Not Found!"
            })
        }
    })
    .catch(error =>
    {
        //If any other error encountered
        console.log(error)
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
        console.log(res)
    })              
}      

//DISPLAYING ONE INVOICE FROM INVOICE NO. IRRESPECTIVE OF IT'S STATUS
exports.getAnyInvoiceFromBill = (req, res, next) => 
{
    var id = req.params.billNo
    var customer = req.params.customer
    var supplier = req.params.supplier
    Invoice.findOne({billNo:id,customer: customer, supplier: supplier}).lean()
    .collation({ "locale": "en", "strength": 2 })
    .then( doc =>
    {        
        //Executed if document exists
        if(doc){
            res.status(200).json({
                code : 200,
                serialNo : doc.serialNo,
                entryNo : doc.entryNo,
                billNo : doc.billNo,
                orderNo : doc.orderNo,
                date : doc.date,
                subAgent : doc.subAgent,
                customer : doc.customer,
                supplier : doc.supplier,
                transporter : doc.transporter,
                destination : doc.destination,
                cases : doc.cases,
                lrNo : doc.lrNo,
                lrDate : doc.lrDate,
                ca : doc.ca,
                pcP : doc.pcP,
                pc : doc.pc,
                rdP : doc.rdP,
                rd : doc.rd,
                ddP : doc.ddP,
                dd : doc.dd,
                discP : doc.discP,
                disc : doc.disc,
                scP : doc.scP,
                sc : doc.sc,
                slP : doc.slP,
                sl : doc.sl,
                cgstP : doc.cgstP,
                cgst : doc.cgst,
                sgstP : doc.sgstP,
                sgst : doc.sgst,
                igstP : doc.igstP,
                igst : doc.igst,
                netAmount : doc.netAmount,
                remarks : doc.remarks,
                status : doc.status, 
                grA : doc.grA,
                paid : doc.paid 
            })
        } 
        //Executed if document doesn't exist  
        else
        {
            return res.status(404).json({
                code : 404,
                message: "Invoice No. " + id + " Not Found!"
            })
        }
    })
    .catch(error =>
    {
        //If any other error encountered
        console.log(error)
        res.status(500).json({ 
            code : 500,
            message : error.message
        })
        console.log(res)
    })              
}   


//GETTING ALL INVOICE's LR DETAILS FALLING WITHIN A DATE RANGE
exports.getRangeLR = (req, res) => {
    var from = req.params.from
    var to = req.params.to
    var q = {date : { $gte : new Date(from), $lt : new Date(to)}}
    var query = {...req.body, ...q}
    Invoice.find(query).sort({billNo : 1}).lean()
    .select('serialNo billNo date customer supplier transporter destination cases lrNo lrDate ca netAmount')
    .collation({ "locale": "en", "strength": 2 })
    .then( docs => {
        const response = {
            count: docs.length,
            Invoice : docs.map( doc =>{
                return {
                    serialNo : doc.serialNo,
                    billNo : doc.billNo,
                    date : doc.date,
                    customer : doc.customer,
                    supplier : doc.supplier,
                    transporter : doc.transporter,
                    destination : doc.destination,
                    cases : doc.cases,
                    lrNo : doc.lrNo,
                    lrDate : doc.lrDate,
                    ca : doc.ca,
                    netAmount : doc.netAmount,
                }
            })
        }
        res.status(200).json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ 
            code : 500,
            error : err })
    })    
}