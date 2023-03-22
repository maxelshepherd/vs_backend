const express = require('express')
const router = express.Router()
const Config = require('../models/config')

//Getting all configs
router.get('/', async (req, res) => {
    try{
        const limit = req.query.limit || 1000;
        const configs = await Config.find().sort({timestamp: -1}).limit(parseInt(limit));
        res.json(configs)
    }catch (err){
        res.status(500).json({ message: err.message})
    }
})

//Getting one
router.get('/:id', getConfig, (req, res) => {
    res.json(res.config)
})

//Creating one
router.post('/', async (req, res) => {
    const config = new Config({
        sid: req.body.sid, 
        data: req.body.data
    })

    try{
        const newConfig = await config.save()
        res.status(201).json(newConfig)
    }catch (err){
        res.status(400).json({message : err.message})
    }
})


//updating one
router.patch('/:id', getConfig, async (req, res) => {
    if (req.body.sid != null) {
        res.config.sid = req.body.sid
    }
    if (req.body.data != null) {
        res.config.data = req.body.data
    }
    try{
        const updatedConfig = await res.config.save()
        res.json(updatedConfig)
    }catch(err){
        res.status(400).json({message: err.message})
    }
})


//deleting one
router.delete('/:id', getConfig, async (req, res) => {
    try{
        await res.config.remove()
        res.json({message: 'Deleted Config'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getConfig(req , res, next){
    let config
    try {
        config = await Config.findById(req.params.id)
        if (config == null) {
            return res.status(404).json({message: 'Cannot find config' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.config = config
    next()
}

module.exports = router