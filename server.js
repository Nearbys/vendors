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

async function initializeDatabase(){

    try{

        await pool.query(`

        CREATE TABLE IF NOT EXISTS businesses(

            id SERIAL PRIMARY KEY,

            business_name VARCHAR(150) NOT NULL,

            latitude DECIMAL(10,7) NOT NULL,

            longitude DECIMAL(10,7) NOT NULL,

            category VARCHAR(50) NOT NULL,

            delivery_type VARCHAR(20) NOT NULL,

            delivery_fee INTEGER DEFAULT 0,

            email VARCHAR(150) UNIQUE NOT NULL,

            whatsapp VARCHAR(30) UNIQUE NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );

        `);

        console.log("Database Ready");

    }
    catch(err){

        console.log(err);

    }

}

initializeDatabase();

app.post("/register", async(req,res)=>{

    try{

        let{

            businessName,
            latitude,
            longitude,
            category,
            deliveryType,
            deliveryFee,
            email,
            whatsapp

        }=req.body;

        businessName=(businessName || "").trim();

        email=(email || "").trim().toLowerCase();

        whatsapp=(whatsapp || "").trim();

        // Remove spaces, brackets and hyphens

        whatsapp=whatsapp.replace(/[\s\-()]/g,"");

        // Email Validation

        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){

            return res.status(400).json({

                message:"Invalid email address."

            });

        }

        // International WhatsApp Validation

        if(!whatsapp.startsWith("+")){

            return res.status(400).json({

                message:"WhatsApp number must include the country code."

            });

        }

        const phoneRegex=/^\+[1-9]\d{6,14}$/;

        if(!phoneRegex.test(whatsapp)){

            return res.status(400).json({

                message:"Invalid WhatsApp number."

            });

        }

        // Duplicate Email

        const emailExists=await pool.query(

            "SELECT id FROM businesses WHERE email=$1",

            [email]

        );

        if(emailExists.rows.length>0){

            return res.status(400).json({

                message:"Email is already registered."

            });

        }

        // Duplicate WhatsApp

        const phoneExists=await pool.query(

            "SELECT id FROM businesses WHERE whatsapp=$1",

            [whatsapp]

        );

        if(phoneExists.rows.length>0){

            return res.status(400).json({

                message:"WhatsApp number is already registered."

            });

        }

        if(deliveryType==="Free"){

            deliveryFee=0;

        }

        await pool.query(

        `

        INSERT INTO businesses(

            business_name,

            latitude,

            longitude,

            category,

            delivery_type,

            delivery_fee,

            email,

            whatsapp

        )

        VALUES($1,$2,$3,$4,$5,$6,$7,$8)

        `,

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

            success:true,

            message:"Business registered successfully."

        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Database Error"

        });

    }

});

app.get("/businesses", async(req,res)=>{

    try{

        const result=await pool.query(

            "SELECT * FROM businesses ORDER BY id DESC"

        );

        res.json(result.rows);

    }
    catch(err){

        res.status(500).json({

            message:"Database Error"

        });

    }

});

// Optional Home Page Test

app.get("/health",(req,res)=>{

    res.json({

        status:"Running"

    });

});

const PORT=process.env.PORT || 3000;

app.listen(PORT,()=>{

    console.log("================================");
    console.log("Nearbys Server Started");
    console.log("Listening on Port",PORT);
    console.log("================================");

});
