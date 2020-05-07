const mongoose = require('mongoose');
module.exports = () => {
    mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));

    mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to db');

    });

    mongoose.connection.on('error', (err) => {
        console.log(err.message);
    });
}