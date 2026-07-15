const express = require("express");
const { Pool } = require("pg");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Create table automatically
async function initializeDatabase() {

    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                mobile TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Database Ready");

    } catch (err) {

        console.error(err);

    }

}

initializeDatabase();

app.post("/register", async (req, res) => {

    try {

        const { name, mobile } = req.body;

        await pool.query(
            "INSERT INTO registrations(name,mobile) VALUES($1,$2)",
            [name, mobile]
        );

        console.log("Saved:", name, mobile);

        res.json({
            success: true,
            message: "Registration saved successfully."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Database Error"
        });

    }

});

app.get("/vendorsdb", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT * FROM registrations ORDER BY id DESC"
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Server running on port", PORT);

});
