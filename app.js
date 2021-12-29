const express = require('express')
var mysql = require('mysql');
const fs = require('fs');
const app = express()

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "kpi"
});

con.connect(function(err) {
if (err) throw err;
console.log("Connected to KPI database!");
});

//begin queries

//example query:
// app.get('/', (req, res) => {

//   //writing to file with a query
//   fs.writeFileSync('data.json', '')
//   var toSend = [];
//   con.query("SELECT * FROM animal LIMIT 3", function (err, result, fields) {
//     if (err) throw err;
//     console.log(result);
//     toSend = JSON.stringify(result)
//     fs.appendFileSync('data.json', toSend + "\n");
//     });

//   //reading from file
//   fs.readFile('data.json', 'utf8' , (err, data) => {
//     if (err) {
//       console.error(err)
//       return
//     }
//     output = data.split("\n");
//     //output contains each JSON block in an array, the last one is empty
//     res.send('Hello World! ' + output)
//   })

// })

app.get('/', (req, res) => {

  //writing to file with a query
  fs.writeFileSync('data.json', '')
  var toSend = [];
  con.query("SELECT * FROM animal LIMIT 3", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    toSend = JSON.stringify(result)
    fs.appendFileSync('data.json', toSend + "\n");
    });

  //reading from file
  fs.readFile('data.json', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    output = data.split("\n");
    //output contains each JSON block in an array, the last one is empty
    res.send('Hello World! ' + output)
  })

})

//KPI: 

//KPI:

//KPI:

//KPI:

//KPI:

//KPI:


module.exports = app;