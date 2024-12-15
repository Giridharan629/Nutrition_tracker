const mongoose = require("mongoose");

const foodSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    quantity: {
      type: String,
    },
    calories: {
      type: Number,
    },
    protein: {
      type: Number,
    },
    carbohydrates: {
      type: Number,
    },
    fats: {
      type: Number,
    },
    image_url: {
      type: String,
    },
    quantity_type: {
      type: String,
    }
  },
  { timestamps: true }
);



const foodModel = mongoose.model("foods", foodSchema);

module.exports = foodModel;
