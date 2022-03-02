var mysql = require('mysql');
const fs = require('fs');

//############################################

//write command line interface here just in case
const args = process.argv.slice(2);
if (args.length == 4){
    var con = mysql.createConnection({
        host: args[0],
        user: args[1],
        password: args[2],
        database: args[3]
      });
} else {
    var con = mysql.createConnection({
        host: "kpi.czhwfl9qqmr4.eu-west-2.rds.amazonaws.com",
        user: "admin",
        password: "group12db",
        database: "kpi"
      });
}

con.connect(function(err) {
if (err) throw err;
console.log("Connected to KPI database!");
});
//#############################################

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


//then get all the data and write it to file
async function getData(queries,filename) {

    const promises =[];
    for (const p of queries){
        const newp = queryPromise(p)
        promises.push(newp)
    }
    
    //write results to file
    try{
        const result = await Promise.all(promises);
        console.log(result)
        towrite = JSON.stringify(result)
        fs.writeFileSync(filename,towrite)
        console.log("Wrote to " + filename + "!")
    } catch(error){
        console.log(error)
    }
}

//#############################################

//KPIs: Citizen Scientists 

citscipromises = [
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (all time)' FROM Photo",
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists providing images (active)' FROM Photo WHERE DATEDIFF(NOW(),uploaded) <= 365",
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists classifying images (all time)' FROM Animal",
"SELECT COUNT(DISTINCT(person_id)) AS 'Number of Citizen Scientists classifying images (active)' FROM Animal WHERE DATEDIFF(NOW(),timestamp) <= 365",
"SELECT year(uploaded) AS 'Year',COUNT(DISTINCT(person_id)) AS 'Number of active users uploading' FROM Photo GROUP BY year(uploaded)",
"SELECT year(timestamp) AS 'Year',COUNT(DISTINCT(person_id)) AS 'Number of active users classifying' FROM Animal GROUP BY year(timestamp)"
]

//KPIs: Image Sequences

imgseqpromises = [
"SELECT COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days (all time)' FROM Photo;",
"SELECT COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days (past 12 months)' FROM Photo WHERE DATEDIFF(NOW(),uploaded) <= 365;",
"SELECT year(timestamp) as 'Year',count(*) as 'Total number of uploads' FROM kpi.Upload GROUP BY year(timestamp)",
"SELECT year(uploaded) AS 'Year', COUNT(DISTINCT(DATE(uploaded))) AS 'Number of camera days' FROM Photo GROUP BY year(uploaded)"
]

//KPIs: Classification

classpromises = [
    "SELECT COUNT(*) AS 'Number of classification events' FROM Animal;",
    "SELECT COUNT(DISTINCT Photo.sequence_id, Animal.person_id) AS 'Number of animals (mammals/birds) identified' FROM Animal, Photo WHERE Photo.photo_id = Animal.photo_id;",
    "SELECT COUNT(*)  AS 'Number of sequences with complete classification' FROM (SELECT Photo.sequence_id, COUNT(*) AS totals FROM Animal, Photo WHERE Animal.photo_id = Photo.photo_id GROUP BY Photo.sequence_id) AS sequences WHERE sequences.totals >= 3;",
    "SELECT year(timestamp) AS 'Year' ,COUNT(*) AS 'Number of classification events' FROM Animal GROUP BY year(timestamp)"
]

//KPIs: Quantity/quality/coverage of data in UK
qpromises = ["SELECT COUNT(*) AS 'Number of 10k cells for which we have some records' FROM (SELECT COUNT(*) FROM Site GROUP BY grid_ref) AS grids;"
]

//KPIs:

//KPIs:

//#############################################

getData(citscipromises,"citsci.json");
getData(imgseqpromises,"imgseq.json");
getData(classpromises,"class.json");
getData(qpromises,"datacoverage.json");