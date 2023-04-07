require('dotenv').config()
var morgan = require('morgan')


const express = require('express')
const app = express()
app.use(morgan('combined'))

app.get('/', (req, res) => {res.json({message : 'Welcome to Virtual Shepard API!' + __dirname})})
//or using direct file URI
app.get('/download', function(req, res){
    var file = __dirname + '/log.txt';
    res.download(file);
  });

const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.on('open', () => console.log('Connected to Database'))

app.use(express.json())

const sensorsRouter = require('./routes/sensors')
const configsRouter = require('./routes/configs')

app.use('/api/sensors', sensorsRouter)
app.use('/api/configs', configsRouter)

app.listen(process.env.PORT, () => console.log('Server Started'))


