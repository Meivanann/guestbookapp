var mongoose      = require('mongoose');
//Set up database link 
var mongoDB = 'mongodb://superadmin:mukesh@3.129.218.61:27017/guestbookingdb?authSource=admin'
//var mongoDB = 'mongodb://localhost:27017/guestbookingdb';
mongoose.connect(mongoDB, { useNewUrlParser: true });
 //Get the default connection
var db = mongoose.connection;
 

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected DB Successfully")
});

module.exports = db; 
  