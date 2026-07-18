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

            email VARCHAR(150) UNIQUE NOT NULL,

            password VARCHAR(100) NOT NULL,

            whatsapp VARCHAR(30) UNIQUE NOT NULL,

            profile_image TEXT,

            cover_image TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        );

        `);

        // Add new columns if the table already existed
        await pool.query(`
            ALTER TABLE businesses
            ADD COLUMN IF NOT EXISTS profile_image TEXT;
        `);

        await pool.query(`
            ALTER TABLE businesses
            ADD COLUMN IF NOT EXISTS cover_image TEXT;
        `);

        await pool.query(`
            ALTER TABLE businesses
            ADD COLUMN IF NOT EXISTS description TEXT;
        `);

        await pool.query(`
            ALTER TABLE businesses
            ADD COLUMN IF NOT EXISTS password VARCHAR(100);
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
            email,
            password,
            whatsapp,
            profileImage,
            coverImage

        }=req.body;

        businessName=(businessName || "").trim();

        email=(email || "").trim().toLowerCase();

        password=(password || "").trim();

        if(password===""){

        return res.status(400).json({
        message:"Password is required."
        });

        }

        whatsapp=(whatsapp || "").trim();

        profileImage=profileImage || "";

        coverImage=coverImage || "";

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

        await pool.query(

        `

        INSERT INTO businesses(

            business_name,

            latitude,

            longitude,

            category,

            email,

            password,

            whatsapp,

            profile_image,

            cover_image

        )

        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)

        `,

        [

            businessName,

            latitude,

            longitude,

            category,

            email,

            password,

            whatsapp,

            profileImage,

            coverImage

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

            `SELECT
                id,
                business_name,
                latitude,
                longitude,
                category,
                email,
                password,
                whatsapp,
                profile_image,
                cover_image,
                created_at
             FROM businesses
             ORDER BY id DESC`

        );

        res.json(result.rows);

    }
    catch(err){

        console.log(err);

        res.status(500).json({

            message:"Database Error"

        });

    }

    }); 

    app.post("/vendor-login", async (req, res) => {

    try{

        let { email, password } = req.body;

        email = (email || "").trim().toLowerCase();
        password = (password || "").trim();

        if(email === "" || password === ""){

            return res.status(400).json({
                success:false,
                message:"Please enter email and password."
            });

        }

        const result = await pool.query(

            `SELECT
                id,
                business_name,
                category,
                description,
                email,
                whatsapp,
                profile_image,
                cover_image,
                password
             FROM businesses
             WHERE email=$1`,

            [email]

        );

        if(result.rows.length === 0){

            return res.status(401).json({
                success:false,
                message:"Email not registered."
            });

        }

        const vendor = result.rows[0];

        if(vendor.password !== password){

            return res.status(401).json({
                success:false,
                message:"Incorrect password."
            });

        }

        delete vendor.password;

        res.json({

            success:true,

            vendor

        });

    }
    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,
            message:"Server Error"

        });

    }
    
});





app.post("/update-cover", async (req, res) => {

    try{

        const { email, coverImage } = req.body;

        if(!email || !coverImage){

            return res.status(400).json({

                success:false,

                message:"Missing data."

            });

        }

        await pool.query(

            `UPDATE businesses
             SET cover_image=$1
             WHERE email=$2`,

            [

                coverImage,

                email

            ]

        );

        res.json({

            success:true,

            message:"Cover updated."

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







app.post("/update-profile", async (req, res) => {

    try{

        const { email, profileImage } = req.body;

        if(!email || !profileImage){

            return res.status(400).json({

                success:false,

                message:"Missing data."

            });

        }

        await pool.query(

            `UPDATE businesses
             SET profile_image=$1
             WHERE email=$2`,

            [

                profileImage,

                email

            ]

        );

        res.json({

            success:true,

            message:"Profile updated."

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








app.post("/update-business-name", async (req, res) => {

    try{

        let{

            email,

            businessName

        }=req.body;

        email=(email || "").trim().toLowerCase();

        businessName=(businessName || "").trim();

        if(businessName===""){

            return res.status(400).json({

                success:false,

                message:"Business name required."

            });

        }

        await pool.query(

            `UPDATE businesses
             SET business_name=$1
             WHERE email=$2`,

            [

                businessName,

                email

            ]

        );

        res.json({

            success:true,

            message:"Business name updated."

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

app.post("/update-description", async (req, res) => {

    const { email, description } = req.body;

    try {

        await pool.query(
            `UPDATE businesses
             SET description=$1
             WHERE email=$2`,
            [description, email]
        );

        res.json({
            success: true,
            message: "Description updated."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Unable to update description."
        });

    }

});






// Health Check
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
