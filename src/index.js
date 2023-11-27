const express = require('express');
const mongoose = require('mongoose');
const routes = require("./routes/index.routes");
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;

app.use("/api/users", routes);

app.listen(port, () => {
    mongoose.connect('mongodb+srv://gabrielcvfcvf:XkJGlWhOeapTutxa@api-desafio.slyzet9.mongodb.net/?retryWrites=true&w=majority');
    console.log(`Example app listening on port ${port}`);
});
