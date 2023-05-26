const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

// uncaught exception
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION 💥 Shuting dowm...');
  console.log(err.name, err.message, err);
  process.exit(1);
});

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  // .connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    // console.log(con.connection)
    console.log('connect DB successfull');
  });

const port = process.env.PORT || 3000;
console.log(port);

const server = app.listen(port, process.env.LOCAL_HOST, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION 💥 Shuting dowm...');
  server.close(() => {
    process.exit(1);
  });
});
