const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('uncaught Exception! Shuting down');

  process.exit(1);
});

dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const port = 5000 || process.env.PORT;

const sever = app.listen(port, () => {
  console.log('listening to' + port);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('unhandle dRejectionc! Shuting down');

  sever.close(() => {
    process.exit(1);
  });
});
