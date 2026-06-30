const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = require("./config/db.js");

db.query('SELECT 1')
    .then(() => console.log("succesfull"))
    .catch((err)=> console.log("failed" , err.message))

const PORT = process.env.PORT || 5000;

app.use('/api/auth' , require('./routes/authRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/orders' , require('./routes/orderRoutes.js'));

app.get('/',(req,res) => {
    res.send("server is running");
})

app.listen(PORT , () => {
    console.log(`server is running on ${PORT}`);
})
