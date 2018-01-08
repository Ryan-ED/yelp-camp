var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    //Comment author stores user info. Refer to camp model
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);