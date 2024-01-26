require('dotenv').config()

const express = require('express')
require('express-async-errors');    // Gestion des erreurs asynchrones
const app = express();

const connectToDatabase = require('./_configurations/db.configuration');
connectToDatabase();

const configureCors = require('./_configurations/cors.configuration');
configureCors(app)

app.use(express.json());

const route = require('./_routes/base.route')
app.use('/api', route)



app.listen(process.env.PORT, () => {
    console.log(`Web server running on port ${process.env.PORT}`);
});
