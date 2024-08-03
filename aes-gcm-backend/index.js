const express = require("express");
const app = express();
const port = 5000;
const cors = require("cors");
const { encrypt, decrypt } = require("./helper/commonHelper");
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  if (req.body && req.body.encrypted) {
    try {
      req.body = JSON.parse(decrypt(req.body));
    } catch (error) {
      console.error("Decryption failed:", error);
      return res.status(400).json({ error: "Invalid data" });
    }
  }
  next();
});

// Middleware to encrypt response bodies
app.use((req, res, next) => {
  const originalJson = res.json;

  res.json = function (body) {
    if (body) {
      try {
        const encryptedBody = encrypt(JSON.stringify(body));
        originalJson.call(this, encryptedBody);
      } catch (error) {
        console.error("Encryption failed:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    } else {
      originalJson.call(this, encryptedBody);
    }
  };

  next();
});

app.get("/", function (req, res) {
  const data = [
    {
      name: "Jaydeep Sarkar",
      age: 28,
    },
    {
      name: "Bakul Karmakar",
      age: 29,
    },
    {
      name: "Mukesh Kumar",
      age: 30,
    },
  ];

  res.json({
    data: data,
  });
});

app.post("/", function (req, res) {
  const payload = decrypt(req.body);

  res.json({
    data: {
      code: 200,
      message: "Successful",
    },
  });
});

app.listen(port, () => {
  console.log("App is running on port " + port);
});
