const mongoose = require('mongoose');

let mongoDB = null;

const connect = (callback) =>{
  mongoDB = mongoose.connection;

  mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  mongoDB.useDb(process.env.DATABASE);

  mongoDB.on('error', function callback() {
    console.log('Error when connecting to db ');
  });

  mongoDB.once('open', function callback() {
    console.log('Successfully connected to database ');
  });

  return callback(null, mongoDB);
};


const disconnect =() =>{
  if (!mongoDB) return true;
  mongoDB.close();
  mongoDB = null;
  return true;
};

module.exports = {connect, disconnect};
