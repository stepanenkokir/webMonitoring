const express = require('express');
const config = require('config');
const path = require('path');

const app = express();

app.use(express.json({extended: true}));

app.use('/db',require('./routes/db.routes'))
app.use('/mlat',require('./routes/mlat.routes'))
app.use('/mosquite',require('./routes/mosquite.routes'))

//if (process.env.NODE_ENV === 'production'){
    console.log("Production Start!!");
    app.use('/',express.static(path.join(__dirname,'client', 'build')));

    app.get('*', (req,res) =>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
//} 

const PORT = config.get('port') || 5000;

async function start(){
    try{
        app.listen(PORT, () => console.log(`Server start nad listen on port ${PORT}`))
    }catch(e){
        console.log("Server error",e.message);
        process.exit(1);
    }
}

start();

