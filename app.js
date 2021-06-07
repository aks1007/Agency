const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()


//Importing Routes
//MASTER
const customerRoutes = require('./api/routes/customer')
const supplierRoutes = require('./api/routes/supplier')
const itemRoutes = require('./api/routes/item')
const customerGroupRoutes = require('./api/routes/customerGroup')
const supplierGroupRoutes = require('./api/routes/supplierGroup')
const itemGroupRoutes = require('./api/routes/itemGroup')
const marketRoutes = require('./api/routes/market')
const bankRoutes = require('./api/routes/bank')
const transporterRoutes = require('./api/routes/transporter')
const locationRoutes = require('./api/routes/location')
const postRoutes = require('./api/routes/post')
//TRANSACTIONS
const infoRoutes = require('./api/routes/info')
const noticeRoutes = require('./api/routes/notice')
const mailRoutes = require('./api/routes/mail')
const mailChequeRoutes = require('./api/routes/mailCheque')
const orderFormRoutes = require('./api/routes/orderForm')
const orderItemRoutes = require('./api/routes/orderItem')
const invoiceRoutes = require('./api/routes/invoice')
const invoiceItemRoutes = require('./api/routes/invoiceItem')
const goodsReturnRoutes = require('./api/routes/goodsReturn')
const goodsReturnBillRoutes = require('./api/routes/goodsReturnBill')
const paymentRoutes = require('./api/routes/payment')
const paymentChequeRoutes = require('./api/routes/paymentCheque')
const paymentFtRoutes = require('./api/routes/paymentFt')
const paymentBillRoutes = require('./api/routes/paymentBill')
const brokerageRoutes = require('./api/routes/brokerage')
const brokerageVoucherRoutes = require('./api/routes/brokerageVoucher')

//Promise Implementation
mongoose.Promise = global.Promise

//Parsing Request/Response Data to JSON
app.use(express.json())

//CORS Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

//Routes
//MASTER
app.use('/customer', customerRoutes)
app.use('/supplier', supplierRoutes)
app.use('/item', itemRoutes)
app.use('/customerGroup', customerGroupRoutes)
app.use('/supplierGroup', supplierGroupRoutes)
app.use('/itemGroup', itemGroupRoutes)
app.use('/market', marketRoutes)
app.use('/bank', bankRoutes)
app.use('/location', locationRoutes)
app.use('/transporter', transporterRoutes)
app.use('/post', postRoutes)
//TRANSACTIONS
app.use('/info',infoRoutes)
app.use('/notice', noticeRoutes)
app.use('/mail', mailRoutes)
app.use('/mailCheque', mailChequeRoutes)
app.use('/orderForm', orderFormRoutes)
app.use('/orderItem', orderItemRoutes)
app.use('/invoice', invoiceRoutes)
app.use('/invoiceItem', invoiceItemRoutes)
app.use('/goodsReturn', goodsReturnRoutes)
app.use('/goodsReturnBill', goodsReturnBillRoutes)
app.use('/payment', paymentRoutes)
app.use('/paymentCheque', paymentChequeRoutes)
app.use('/paymentFt', paymentFtRoutes)
app.use('/paymentBill', paymentBillRoutes)
app.use('/brokerage', brokerageRoutes)
app.use('/brokerageVoucher', brokerageVoucherRoutes)

//Error-Handling Middleware
app.use((req, res, next) =>{
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error,req, res, next) =>{
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    })
})

//Export via Express
module.exports = app
