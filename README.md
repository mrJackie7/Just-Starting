# Simple CRUD with Node.JS and MySQL
12 April 2021

## About This Project

Project ini adalah sebuah project pembelajaran mandiri yang gue lakuin buat pelajarin gimana sih cara kerja Node.JS ini, bagaimana dia bisa terkoneksi dengan MySQL, dan lain sebagainya. Ide ini sebetulnya berasal dari tutorial dari MFirki di [blognya](https://mfikri.com/), *so make sure to visit him :-).*

Gw akan link [tutorialnya](https://mfikri.com/en/blog/nodejs-mysql-crud) disini, jadi silahkan diccoba, ya :-)

## Penjelasan isi dari project ini

### Penjelasan Singkat
project sederhana ini menggunakan Node.JS dengan bantuan pustaka Express.js sebagai back-end antara view dengan database. Dia juga menggunakan pustaka lain seperti Body-Parser sebagai middleware untuk nge-handle request dan response data, Handlebars (.hbs) sebagai view engine data dari Node.JS, dan MySQl supaya dari NodeJS bisa konek ke database menggunakan MySQL (berbeda dari PHP dan framework PHP lainnya, Node.JS yang bisa langsung konek ke MySQL). Untuk UI-nya digunakan Bootstrap v.4.6.0 (ga mw pake yg versi beta5.0.0 karena masih beta version) dan jQuery v.3.6.0.

Untuk bisa liat module apa aja yg bisa gw pake, bisa di check di package.json (ga gw .gitignore) dan kalo mw liat yang buat UI-nya, bisa diintip juga ke folder views. Ohh iya gw juga include file sqldari database yg gw gunain ini, jadi silahkan dicheck, ya ;-).

### Penjelasan Singkat Kodingan dari index.js

> Kalo ada penjelasannya yang kurang atau salah, mohon maaf ya sama mohon dibantu untuk melengkapi, ya namanya juga masih belajar, *hehe :-p*

=> Konek ke database

Hampir sama kayak kalian konek ke MySQL via PHP, cuma kita mesti set dulu module MySQL-nya ke index.js lalu kita bisa inisiasi koneksi ke MySQL

```konek-ke-MySQL
const mysql = require('mysql')

// Create connection to database
const conn = mysql.createConnection({
  host: 'localhost',
  user: ' *your_database_username* ',
  password: ' *your_database_pass* ',
  database: 'crud_db'
})

// Attempting to connect to database. If there is an error occured, throw an error, and stop it's execution.
conn.connect((err) => {
  if(err) throw err;
  console.log('Connected to MySQL');
})
```

=> Set-up Express, viewing template, body parser dan port localhost untuk uji coba
Selanjutnya kita siapkan web framework kita pake Express.JS. Berdasarkan [website](https://expressjs.com/) resminya, Express.JS adalah sebuah framework yang cepat, *un-opinionated*, dan minimalis untuk aplikasi Node.js. 

Untuk kita bisa set-up Express, kita include dulu modulenya ke index.js, lalu kita set const app ke express.

```set-up express
// Use express module
const express = require('express')

// Set app with express module
const app = express()
```

Setelah itu kita bisa set apa saja module yang akan si app ini pakai.

```Set up other module
// Use path module
const path = require('path')
// Use hbs view engine
const hbs = require('hbs')
// Use bodyParser middleware
const bodyParser = require('body-parser')

// Set view file berdasarkan directory folder views/
app.set('views', path.join(__dirname, 'views'))
// Set view engine to hbs
app.set('view engine', 'hbs')
// Set body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
// Set public folder as static folder for static file
app.use('/assets', express.static(__dirname + '/public'))
```

Lalu kita set port ujicoba kita.
```set up server
// Server listening at port 8085
app.listen(8085, () => {
  console.log('Server is running at port 8085')
  console.log('http://localhost:8085/')
})
```

=> Request dan response handling

`SELECT query`

Untuk Query SELECT data, kodingannya adalah sebagai berikut:
```kode select data
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
```

Artinya adalah si app akan melakukan request (req) query untuk sql bisa melakukan select data ke database tabel product_tb. jika ada error (err), throw error tersebut, menghentikan operasinya, jika tidak ada error, hasil data respon (res) akan dirender berupa results ke view template di folder views (path.join(__dirname, '/views/product_view.hbs')). Maksud dari '/' adalah kita mengroute-kan folder views yang suda kita set sebagai halaman homepage, jadi data bisa langsung dirender disitu.

`INSERT query`

Untuk Query INSERT data, kodingannya adalah sebagai berikut:
```kode insert data
// Route for post (insert) data, if success, redirect to homepage ('/') 
app.post('/save', (req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price}
  let sql = "INSERT INTO product_tb SET ?"
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/')
  })
})
```

Artinya adalah si app akan melakukan request (req) query untuk sql bisa melakukan insert data yang dikirimkan view form si view_product.hbs ke database tabel product_tb. jika ada error (err), throw error tersebut, menghentikan operasinya, jika tidak ada error, hasil data respon (res) akan dikirimkan ke data tabel product_tb untuk di post, di insert dan jika berhasil, kita akan di redirect ke homepage '/'.

`UPDATE dan DELETE query`

Untuk Query UPDATE dan DELETE data, basicnya hampir sama seperti kita melakukan query-ing INSERT, tapi untuk menjelaskannya, berikut adalah 2 kode untuk UPDATE dan DELETE data:

*UPDATE:

```kode update data
// Route for update data, if success, redirect to homepage ('/') 
app.post('/update', (req, res) => {
  let sql = `UPDATE product_tb SET product_name='${req.body.product_name}', product_price='${req.body.product_price}' WHERE product_id=${req.body.id}`
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/')
  })
})
```

*DELETE:

```kode delete data
app.post('/delete', (req, res) => {
  let sql = `DELETE FROM product_tb WHERE product_id=${req.body.product_id}`
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/')
  })
})
```

Arti dari kedua kode itu adalah si app akan melakukan request (req) query untuk sql bisa melakukan update atau delete data yang dikirimkan view form si view_product.hbs ke database tabel product_tb berdasarkan product_id. Untuk query update, data akan diubah berdasarkan inputan dari user. Jika kedua query tersebut ada error (err), throw error tersebut, menghentikan operasinya, jika tidak ada error, hasil data respon (res) akan dikirimkan ke data tabel product_tb untuk di post, dan berdasarkan query yang dijalankan, akan mengubah isi dari si table product_tb, kita akan di redirect ke homepage '/'.