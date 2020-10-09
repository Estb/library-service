const mongoose = require('mongoose');

let mongoDB = null;

const connect =async (callback) =>{
  await mongoose.connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }, (err, ok)=>{
    if (ok) {
      mongoose.connection.useDb(process.env.DATABASE);
      mongoDB = ok.connection;
    }
    return callback(null, mongoDB);
  });

  mongoose.connection.on('error', (err)=>{
    console.log('Error when connecting to db ');
  });

  mongoose.connection.once('open', function callback() {
    console.log('Successfully connected to database ');
  });
};


const disconnect =() =>{
  if (!mongoDB) return true;
  mongoDB.close();
  mongoDB = null;
  return true;
};

module.exports = {connect, disconnect};
