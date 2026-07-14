const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/register", (req, res) => {

    const { name, mobile } = req.body;

    console.log("================================");
    console.log("New Registration");
    console.log("Name :", name);
    console.log("Mobile :", mobile);
    console.log("================================");

    res.json({
        success: true,
        message: "Registration received successfully.",
        data: {
            name,
            mobile
        }
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});