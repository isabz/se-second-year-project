const express = require('express')
var mysql = require('mysql');
const fs = require('fs');
const app = express()

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

//###########################################################################################################
//KPIs: Citizen Scientists 

citsciPromise1 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (all time)' FROM photo",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

citsciPromise2 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (active)' FROM photo WHERE DATEDIFF(NOW(),uploaded) <= 365",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

citsciPromise3 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists classifying images (all time)' FROM animal",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

citsciPromise4 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (active)' FROM animal WHERE DATEDIFF(NOW(),timestamp) <= 365",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

app.get('/citsci', async (req, res) => {
  const promise1= citsciPromise1();
  const promise2= citsciPromise2();
  const promise3= citsciPromise3();
  const promise4= citsciPromise4();
  
  const promises =[promise1, promise2, promise3,promise4];
  
  try{
      const result = await Promise.all(promises);
      console.log(result)
      res.send(result)
  } catch(error){
      console.log(error)
  }
})
//###########################################################################################################


//###########################################################################################################
//KPIs: Image Sequences

imgseqPromise1 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days (all time)' FROM photo;",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

imgseqPromise2 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days (past 12 months)' FROM photo WHERE DATEDIFF(NOW(),uploaded) <= 365;",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

app.get('/imgseq', async (req, res) => {
  const promise1= imgseqPromise1();
  const promise2= imgseqPromise2();
  
  const promises =[promise1, promise2];
  
  try{
      const result = await Promise.all(promises);
      console.log(result)
      res.send(result)
  } catch(error){
      console.log(error)
  }
})
//###########################################################################################################


//###########################################################################################################
//KPIs: Classification

classPromise1 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(*) AS 'Number of classification events' FROM animal;",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

classPromise2 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(DISTINCT photo.sequence_id, animal.person_id) AS 'Number of animals (mammals/birds) identified' FROM animal, photo WHERE photo.photo_id = animal.photo_id;",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

classPromise3 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(*)  AS 'Number of sequences with complete classification' FROM (SELECT photo.sequence_id, COUNT(*) AS totals FROM animal, photo WHERE animal.photo_id = photo.photo_id GROUP BY photo.sequence_id) AS sequences WHERE sequences.totals >= 3;",  (error, results)=>{ //TODO
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

app.get('/class', async (req, res) => {
  const promise1= classPromise1();
  const promise2= classPromise2();
  const promise3= classPromise3();
  
  const promises =[promise1, promise2, promise3];
  
  try{
      const result = await Promise.all(promises);
      console.log(result)
      res.send(result)
  } catch(error){
      console.log(error)
  }
})
//###########################################################################################################

//KPIs: Quantity/quality/coverage of data in UK
qPromise1 = () =>{
  return new Promise((resolve, reject)=>{
      con.query("SELECT COUNT(*) AS 'Number of 10k cells for which we have some records' FROM (SELECT COUNT(*) FROM site GROUP BY grid_ref) AS grids;",  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

app.get('/ukdata', async (req, res) => {
  const promise1= qPromise1();
  
  const promises =[promise1];
  
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