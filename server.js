const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
const app = require('./app');

const DB = process.env.DB.replace('<PASSWORD>', process.env.DB_PASSWORD);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => {
        console.log('DB Connected!');
    });

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.errmsg);
    console.log('UNHANDLED REJECTION! 💥 Shutting down');
    server.close(() => {
        process.exit(1);
    });
});
