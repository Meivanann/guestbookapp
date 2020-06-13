var mysql      = require('mysql');

// var connection = mysql.createConnection({
//     host     : 'psatrans-db.caljkao8crbq.us-east-2.rds.amazonaws.com',
//     user     : 'admin',
//     password : 'Psatrans#2020',
//     database : 'psa',
//     multipleStatements : true
//   });

var connection = mysql.createConnection({
      host     : 'localhost',
      port     : '3308',
      user     : 'root',
      password : 'root',
      database : 'psa',
      multipleStatements : true
    });
  connection.connect(function(err){
    if(!err) {
        console.log("Database is connected");
    } else {
        console.log("Error while connecting with database");
    }
  });
  module.exports = connection; 
  