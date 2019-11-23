const moongose = require('mongoose'),
    Schema = moongoose.Schema;

var CookieSchema = new Schema({
    
        name: String,
        brand: String,
        flavor: String,
        price: Number,
        type: String

});

  module.exports = mongoose.model("Cookie", CookieSchema);