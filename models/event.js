var mongoose = require('mongoose');

// Schema ================================================
var eventSchema = mongoose.Schema({
    user_email       : String,
    text             : String,
    color            : String,
    start_date       : Date,
    end_date         : Date
});

// Methods ======================
module.exports = mongoose.model('Event', eventSchema);