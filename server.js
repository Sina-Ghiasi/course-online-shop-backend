import express from "express";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hi !");
});

app.listen(port, () => console.log(`Server is running on port ${port}.`));
