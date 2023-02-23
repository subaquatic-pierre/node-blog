const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverRide = require("method-override");
const mongoDB = "mongodb://127.0.0.1:27017/dive_sites";
const jquery = require("jquery");

mongoose.connect(mongoDB, { useNewUrlParser: true });

const SitesSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  depth: Number,
  level: String,
  distance: String,
});

const Sites = mongoose.model("Site", SitesSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));

//Routes
app.get("/", (req, res) => {
  res.redirect("/sites");
});

//INDEX

app.get("/sites", (req, res) => {
  Sites.find({}, (err, allSites) => {
    if (err) {
      res.redirect("/sites");
    } else {
      console.log("allSites", allSites);
      res.render("index", { allSites: allSites });
    }
  });
});

//NEW

app.get("/sites/new", (req, res) => {
  res.render("new");
});

//SHOW

app.get("/sites/:id", (req, res) => {
  Sites.findById(req.params.id, (err, foundSite) => {
    if (err) {
      res.redirect("/sites");
    } else {
      res.render("show", { site: foundSite });
    }
  });
});

//CREATE

app.post("/sites", (req, res) => {
  console.log(req.body.site);
  Sites.create(req.body.site, (err) => {
    if (err) {
      console.log("Error creating site", err);
      res.render("new", { error: "There was an error creating the site" });
    } else {
      res.redirect("/sites");
    }
  });
});

//EDIT

app.get("/sites/:id/edit", (req, res) => {
  Sites.findById(req.params.id, (err, foundSite) => {
    if (err) {
      res.redirect("/sites");
    } else {
      res.render("edit", { site: foundSite });
    }
  });
});

//UPDATE

app.put("/sites/:id", (req, res) => {
  Sites.findByIdAndUpdate(req.params.id, req.body.site, (err, createdSite) => {
    if (err) {
      res.redirect("/sites");
    } else {
      res.redirect("/sites/" + req.params.id);
    }
  });
});

//DESTROY

app.delete("/sites/:id", (req, res) => [
  Sites.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect("/sites");
    } else {
      res.redirect("/sites");
    }
  }),
]);

app.listen(3000, () => {
  console.log("Server started and listening on port 8002");
});
