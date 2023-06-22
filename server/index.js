require("dotenv").config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRouter= require('./src/routes/users')
const todosRouter= require('./src/routes/todos')

const app = express();

app.use(express.json());
app.use(cors());
app.get('/',(req, res)=> res.send({"Success": "Welcome to Node Express Server"}))
app.use('/auth', userRouter);
app.use('/todos', todosRouter);
const port = 3040
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("Mongodb connected");
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
}).catch((err) => {
    console.log({ err });
    process.exit(1);
});

