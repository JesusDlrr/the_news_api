require('dotenv').config({ path: '.env' })

const { sign, verify } = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_BYPASS = process.env.JWT_BYPASS;
const express = require("express");
const mysql = require("mysql")
const app = express();
const cors = require("cors");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "fake_news"
})

app.use(cors());
app.use(express.json())

app.post("/auth/key", (req, res) => {
    const jwt = sign({ guest_id: req.ip }, JWT_SECRET, {
        expiresIn: "1h"
    });

    res.send(jwt);
})

app.get("/news", (req, res) => {
    const jwt_crude = req.headers.authorization || "";
    const jwt = jwt_crude.split(" ").pop();

    try {
        if (jwt == JWT_BYPASS || verify(`${jwt}`, JWT_SECRET)) {
            const title_crude = req.query.title || "";
            const countries_crude = req.query.country || "";
            const title = "%" + title_crude + "%";
            const countries = countries_crude.split(",");
            let query = "";

            if (countries_crude != "") {
                query = "SELECT * FROM news WHERE title LIKE ? AND country IN (?)"
            } else {
                query = "SELECT * FROM news WHERE title LIKE ?"
            }

            db.query(query, [title, countries], (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    res.send(result);
                }
            });
        }

    } catch (error) {
        res.send("Authorization failed");
    }
})

app.get("/news/latest", (req, res) => {
    db.query("SELECT * FROM news", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result);
        }
    });
})

app.listen(3001, () => {
    console.log("Servidor iniciado")
})