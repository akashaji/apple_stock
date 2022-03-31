const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 5000;
const data = require("./applestock");
mongoose.connect(
  "mongodb+srv://dev:553Tfy8ztGY7h1D1@cluster0.ndkug.mongodb.net/stock?retryWrites=true&w=majority"
);
app.get("/", (req, res) => {
  res.send(
    'api for apple stocks: /api/v1/apple. Also include date as parameter in "yyyy-mm-dd" format (eg. /api/v1/apple?date=2015-05-10)'
  );
});
const Data = mongoose.model("apple-data", {
  Date: String,
  Open: Number,
  High: Number,
  Low: Number,
  Close: Number,
  "Adj Close": Number,
  Volume: Number,
});
app.get("/api/v1/apple", (req, res) => {
  const date = req.query.date;
  if (!date) {
    res.send("No date, no stocks");
  }
  if (date) {
    if (!date.includes("-"))
      res.send("Date should be formatted like (yyy-mm-dd).");
    if (date.includes("-")) {
      const dateValuesArray = date.split("-");
      if (dateValuesArray.length < 3) res.send("That was tricky, but noooooo!");
      const dateValueFiltered = dateValuesArray.filter((dateValue) =>
        isNaN(dateValue * 1)
      );
      if (dateValueFiltered.length > 0) {
        res.send("Sorry buddy! thats not a valid date.");
      }
      if (dateValueFiltered.length === 0) {
        Data.findOne({ Date: date })
          .then((data) => {
            if (!data)
              res.send("No results on selected day, try a different date.");
            if (data)
              res.send({
                Date: data.Date,
                Open: data.Open,
                High: data.High,
                Low: data.Low,
                "Adj Close": data["Adj Close"],
                Volume: data.Volume,
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
