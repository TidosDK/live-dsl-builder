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

app.get("/", (req, res) => res.render("index", { isProduction }));
app.get("/full", (req, res) => res.render("endpoints/full", { isProduction }));
app.get("/metadsl", (req, res) =>
  res.render("endpoints/metadsl", { isProduction }),
);
app.get("/applicationdsl", (req, res) =>
  res.render("endpoints/applicationdsl", { isProduction }),
);
app.get("/visualization", (req, res) =>
  res.render("endpoints/visualization", { isProduction }),
);

const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

const shutdown = () => {
  console.log("\nReceived kill signal, shutting down gracefully...");

  server.close(() => {
    console.log("Closed out remaining connections.");
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

// Listen for CTRL+C
process.on("SIGINT", shutdown);

// Listen for 'docker stop'
process.on("SIGTERM", shutdown);
