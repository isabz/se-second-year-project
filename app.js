const express = require('express')
var mysql = require('mysql');
const fs = require('fs');
const app = express();
app.use(express.static('client'));
//const path = require('path');

//############################################
//create connection and connect:
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
//#############################################

//begin queries

app.get('/', (req, res) => {
  //res.send('Hello World! ')
  res.redirect('/citsci');
})

//here is the promise to use for all queries
queryPromise = (query) =>{
    return new Promise((resolve, reject)=>{
        con.query(query,  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

//KPIs: Citizen Scientists 

citscipromises = [
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (all time)' FROM photo",
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (active)' FROM photo WHERE DATEDIFF(NOW(),uploaded) <= 365",
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists classifying images (all time)' FROM animal",
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (active)' FROM animal WHERE DATEDIFF(NOW(),timestamp) <= 365",
"SELECT year(uploaded) AS 'Year',COUNT(DISTINCT(person_id)) AS 'Number of active users uploading' FROM photo GROUP BY year(uploaded)",
"SELECT year(timestamp) AS 'Year',COUNT(DISTINCT(person_id)) AS 'Number of active users classifying' FROM animal GROUP BY year(timestamp)"
]

app.get('/citsci', async (req, res) => {
    const promises =[];
    for (const p of citscipromises){
        const newp = queryPromise(p)
        promises.push(newp)
        console.log(promises)
    }
    
    try{
        const result = await Promise.all(promises);
        console.log(result)
        res.send(result)
    } catch(error){
        console.log(error)
    }
  })


//KPIs: Image Sequences

imgseqpromises = [
"SELECT COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days (all time)' FROM photo;",
"SELECT COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days (past 12 months)' FROM photo WHERE DATEDIFF(NOW(),uploaded) <= 365;",
"SELECT year(timestamp) as 'Year of capture',count(*) as 'Total number of uploads' FROM kpi.upload GROUP BY year(timestamp)",
"SELECT year(uploaded) AS 'Year', COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days' FROM photo GROUP BY year(uploaded)"
]

app.get('/imgseq', async (req, res) => {
    const promises =[];
    for (const p of imgseqpromises){
        const newp = queryPromise(p)
        promises.push(newp)
        console.log(promises)
    }
    
    try{
        const result = await Promise.all(promises);
        console.log(result)
        res.send(result)
    } catch(error){
        console.log(error)
    }
  })


//KPIs: Classification

classpromises = [
"SELECT COUNT(*) AS 'Number of classification events' FROM animal;",
"SELECT COUNT(DISTINCT photo.sequence_id, animal.person_id) AS 'Number of animals (mammals/birds) identified' FROM animal, photo WHERE photo.photo_id = animal.photo_id;",
"SELECT COUNT(*)  AS 'Number of sequences with complete classification' FROM (SELECT photo.sequence_id, COUNT(*) AS totals FROM animal, photo WHERE animal.photo_id = photo.photo_id GROUP BY photo.sequence_id) AS sequences WHERE sequences.totals >= 3;",
"SELECT year(timestamp),COUNT(*) AS 'Number of classification events' FROM animal GROUP BY year(timestamp)"
]

app.get('/class', async (req, res) => {
    const promises =[];
    for (const p of classpromises){
        const newp = queryPromise(p)
        promises.push(newp)
        console.log(promises)
    }
    
    try{
        const result = await Promise.all(promises);
        console.log(result)
        res.send(result)
    } catch(error){
        console.log(error)
    }
  })


//KPIs: Quantity/quality/coverage of data in UK
qpromises = ["SELECT COUNT(*) AS 'Number of 10k cells for which we have some records' FROM (SELECT COUNT(*) FROM site GROUP BY grid_ref) AS grids;"
//number of cells by year maybe
]

app.get('/ukdata', async (req, res) => {
    const promises =[];
    for (const p of qpromises){
        const newp = queryPromise(p)
        promises.push(newp)
        console.log(promises)
    }
    
    try{
        const result = await Promise.all(promises);
        console.log(result)
        res.send(result)
    } catch(error){
        console.log(error)
    }
  })

//KPIs:

//KPIs:


module.exports = app;