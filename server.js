require("dotenv").config();
const express = require("express");
const database = require("./db.js");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("App initiated");
});

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const generateShortCode = () => {
  let shortCode = "";
  for (let i = 1; i <= 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }
  return shortCode;
};

app.post("/api/shorten", (req, res) => {
  const url = req.body.url;
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return res.status(400).json({
        message: "URL is required or invalid",
      });
    }
  } catch {
    return res.status(400).json({
      message: "URL is required or invalid",
    });
  }

  function attemptInsert(attempt = 1) {
    let generatedCode = generateShortCode();

    database.query(
      "INSERT INTO urls (original_url, short_code) VALUES(?, ?)",
      [url, generatedCode],
      (error) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            if (attempt < 5) {
              generateShortCode();
              attemptInsert(attempt + 1);
            } else {
              res.status(500).json({
                message: "Server Error. Could not save data.",
              });
              console.log(error);
            }
          } else {
            res.status(500).json({
              message: "Server Error. Could not save data.",
            });
            console.log(error);
          }
        } else {
          res.status(201).json({
            message: `URL ${url} shortened successfully. `,
            shortUrl: `http://localhost:3000/${generatedCode}`,
          });
        }
      },
    );
  }
  attemptInsert();
});

app.get("/:shortCode", (req, res) => {
  const code = req.params.shortCode;
  database.query(
    "SELECT original_url FROM urls WHERE short_code = ?",
    [code],
    (error, result) => {
      if (error) {
        res.status(500).json({ message: "Server error." });
        return;
      } else if (result.length === 0) {
        res.status(404).json({
          message: "No URL found.",
        });
      } else {
        const getUrl = result[0].original_url;
        res.redirect(getUrl);
      }
    },
  );
});

app.listen(process.env.PORT, () => {
  console.log("App running on port 3000");
});
