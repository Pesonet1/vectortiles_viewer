const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const PORT = 3001;

app.use(cors({
  origin: [
    "http://localhost:3000"
  ],
  methods: ["GET"],
}));

app.use("/fonts", express.static(path.join(__dirname, "fonts")));

app.listen(PORT, () => {
  console.log(`Static file server listening on port ${PORT}`);
});
