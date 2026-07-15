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

async function initializeDatabase() {

    await pool.query(`

    CREATE TABLE IF NOT EXISTS businesses (

        id SERIAL PRIMARY KEY,

        business_name VARCHAR(150) NOT NULL,

        latitude DECIMAL(10,7),

        longitude DECIMAL(10,7),

        category VARCHAR(50),

        delivery_type VARCHAR(20),

        delivery_fee INTEGER DEFAULT 0,

        email VARCHAR(150) UNIQUE,

        whatsapp VARCHAR(30) UNIQUE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );

    `);

    console.log("Database Ready");

}

initializeDatabase();

app.post("/register", async (req,res)=>{

    try{

        const{

            businessName,
            latitude,
            longitude,
            category,
            deliveryType,
            deliveryFee,
            email,
            whatsapp

        }=req.body;

        const emailExists=await pool.query(

            "SELECT id FROM businesses WHERE email=$1",

            [email]

        );

        if(emailExists.rows.length>0){

            return res.status(400).json({

                message:"Email is already registered."

            });

        }

        const phoneExists=await pool.query(

            "SELECT id FROM businesses WHERE whatsapp=$1",

            [whatsapp]

        );

        if(phoneExists.rows.length>0){

            return res.status(400).json({

                message:"WhatsApp number is already registered."

            });

        }

        await pool.query(

        `INSERT INTO businesses

        (

        business_name,
        latitude,
        longitude,
        category,
        delivery_type,
        delivery_fee,
        email,
        whatsapp

        )

        VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,

        [

            businessName,
            latitude,
            longitude,
            category,
            deliveryType,
            deliveryFee,
            email,
            whatsapp

        ]

        );

        res.json({

            message:"Business registered successfully."

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Database Error"

        });

    }

});

app.get("/businesses", async(req,res)=>{

    const result=await pool.query(

    "SELECT * FROM businesses ORDER BY id DESC"

    );

    res.json(result.rows);

});

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{

    console.log("Server Started");

});
