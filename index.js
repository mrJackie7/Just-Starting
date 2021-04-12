// Use path module
const path = require('path')
// Use express module
const express = require('express')
// Use hbs view engine
const hbs = require('hbs')
// Use bodyParser middleware
const bodyParser = require('body-parser')
// Use mysql database
const mysql = require('mysql')

// Set app with express module
const app = express()

// Create connection to database
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud_db'
})

// Connecting to database
conn.connect((err) => {
  if(err) throw err;
  console.log('Connected to MySQL');
})

// Set view file
app.set('views', path.join(__dirname, 'views'))
// Set view engine to hbs
app.set('view engine', 'hbs')
// Set body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// Set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'))

// Route for homepage
app.get('/', (req, res) => {
  let sql = "SELECT * FROM product_tb"
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view', {
      results: results
    })
  })
})

// Route for post (insert) data, if success, redirect to homepage ('/') 
app.post('/save', (req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price}
  let sql = "INSERT INTO product_tb SET ?"
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/')
  })
})

// Route for update data, if success, redirect to homepage ('/') 
app.post('/update', (req, res) => {
  let sql = `UPDATE product_tb SET product_name='${req.body.product_name}', product_price='${req.body.product_price}' WHERE product_id=${req.body.id}`
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/')
  })
})

app.post('/delete', (req, res) => {
  let sql = `DELETE FROM product_tb WHERE product_id=${req.body.product_id}`
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/')
  })
})

// Server listening at port 8085
app.listen(8085, () => {
  console.log('Server is running at port 8085')
  console.log('http://localhost:8085/')
})