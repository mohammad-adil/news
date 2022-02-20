const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    newsTitle: {
      type: String,
      default: "",
      trim: true,
    },
    newsDescription: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: "",
    },
    technology: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = News = mongoose.model("News", newsSchema);
