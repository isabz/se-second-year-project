var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "kpi"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");
    con.query("SELECT * FROM animal LIMIT 3", function (err, result) {
        if (err) throw err;
        result = JSON.stringify(result);
        console.log("Result: " + result);
      });
  });