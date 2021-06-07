const moongose = require('mongoose')

//Connection Strings
const master = moongose.createConnection('mongodb://localhost/master',{ useNewUrlParser: true, useUnifiedTopology: true })
const transaction = moongose.createConnection('mongodb://localhost/transaction',{ useNewUrlParser: true, useUnifiedTopology: true })

//MASTER
master.model('Bank', require('./bank'))
master.model('Customer', require('./customer'))
master.model('CustomerGroup', require('./customerGroup'))
master.model('Item', require('./item'))
master.model('ItemGroup', require('./itemGroup'))
master.model('Location', require('./location'))
master.model('Market', require('./market'))
master.model('Post', require('./post'))
master.model('Supplier', require('./supplier'))
master.model('SupplierGroup', require('./supplierGroup'))
master.model('Transporter', require('./transporter'))

//TRANSACTIONS
transaction.model('Info', require('./info'))
transaction.model('Notice', require('./notice'))
transaction.model('Mail', require('./mail'))
transaction.model('MailCheque',require('./mailCheque'))
transaction.model('OrderForm',require('./orderForm'))
transaction.model('OrderItem', require('./orderItem'))
transaction.model('Invoice', require('./invoice'))
transaction.model('InvoiceItem', require('./invoiceItem'))
transaction.model('GoodsReturn', require('./goodsReturn'))
transaction.model('GoodsReturnBill',require('./goodsReturnBill'))
transaction.model('Payment', require('./payment'))
transaction.model('PaymentCheque', require('./paymentCheque'))
transaction.model('PaymentFt', require('./paymentFt'))
transaction.model('PaymentBill', require('./paymentBill'))
transaction.model('Brokerage', require('./brokerage'))
transaction.model('BrokerageVoucher', require('./brokerageVoucher'))

module.exports.master = master
module.exports.transaction = transaction
