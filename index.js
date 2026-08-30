import express from "express";
import cors from "cors";

const app = express();

const PORT = 3000;

app.use(cors());

app.get("/hello", (req, res) => {
  return res.status(200).send({ status: "success", message: "Hello world!" });
});

app.listen(PORT, () => {
  console.log("Listening...");
});
