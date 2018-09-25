const router = require('express').Router()
const scheduleOnChat = require('../helpers/mongoose')

router.get('/schedule', async ({query}, res) => {
            try{
                let schedule = await scheduleOnChat.getChat('JADWAL', query.userId, null)
                res.status(200).json({result: schedule})
            }catch (error){
                res.status(400).json(error)
            }
        })
        
router.get('/failed', async ({query}, res) => {
    try{
        let schedule = await scheduleOnChat.getChat('FAILED', query.userId, null)
        res.status(200).json({result: schedule})
    }catch (error){
        res.status(400).json(error)
    }
})

router.get('/accept', async ({query}, res) => {
    try{
        let schedule = await scheduleOnChat.getChat('OKE', query.userId, null)
        res.status(200).json({result: schedule})
    }catch (error){
        res.status(400).json(error)
    }
})

router.get('/pending', async ({query}, res) => {
    try{
        let schedule = await scheduleOnChat.getChat('TUNDA', query.userId, null)
        res.status(200).json({result: schedule})
    }catch (error){
        res.status(400).json(error)
    }
})
module.exports = router