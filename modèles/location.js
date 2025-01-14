const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
        city: {
          type: String,
          required: true,
        },
        district: {
          type: String,
          required: true,
        }
})

const Location= mongoose.model("Location",locationSchema)