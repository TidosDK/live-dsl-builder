const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

const isProduction = process.env.NODE_ENV === "production";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/node_modules", express.static("node_modules"));

if (isProduction) {
  app.use("/assets", express.static(path.join(__dirname, "dist", "assets")));
}

app.get("/", (req, res) => {
  res.render("index", { isProduction: isProduction });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
