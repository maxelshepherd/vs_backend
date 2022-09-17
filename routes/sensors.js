const express = require('express')
const router = express.Router()
const Sensor = require('../models/sensor')

//Getting all sensors
router.get('/', async (req, res) => {
    try{
        const sensors = await Sensor.find()
        res.json(sensors)
    }catch (err){
        res.status(500).json({ message: err.message})
    }
})

//Getting one
router.get('/:id', getSensor, (req, res) => {
    res.json(res.sensor)
})

//Creating one
router.post('/', async (req, res) => {
    const sensor = new Sensor({
        name: req.body.name, 
        data: req.body.data
    })

    try{
        const newSensor = await sensor.save()
        res.status(201).json(newSensor)
    }catch (err){
        res.status(400).json({message : err.message})
    }
})


//updating one
router.patch('/:id', getSensor, async (req, res) => {
    if (req.body.id != null) {
        res.sensor.id = req.body.id
    }
    try{
        const updatedSensor = await res.sensor.save()
        res.json(updatedSensor)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})


//deleting one
router.delete('/:id', getSensor, async (req, res) => {
    try{
        await res.sensor.remove()
        res.json({message: 'Deleted Sensor'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getSensor(req , res, next){
    let sensor
    try {
        sensor = await Sensor.findById(req.params.id)
        if (sensor == null) {
            return res.status(404).json({message: 'Cannot find sensor' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.sensor = sensor
    next()
}

module.exports = router