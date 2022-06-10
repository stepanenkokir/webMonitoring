const {Router} = require('express');
const router = Router();
const db = require('../models');
const { Op } = require("sequelize");
const { sequelize } = require('../models');
const config = require('config');
const md5 = require('md5')
const jwt = require('jsonwebtoken');

//аутентификация
router.post('/login', async (req, res) =>{
    try {           
        // отправляем ответ - правильный логин/пароль или нет
       // const posData = await db.positions.findAll({attributes: ['id','Name','Bl','Dl'], where:{Enabled:2}});    
       
       let myName=req.body.login;
       let myPass = md5(md5(req.body.password));
       
       const user = await db.User.findOne({attributes:['id','name','type'], where:{name:myName, password: myPass}});

        if (!user){
            console.log("User не найден!!");
            return res.status(400).json({message:'Пользователь не найден'});
        }            
        
        const token = jwt.sign(
            {   userId: user.type , userName: myName},
            config.get('jwtSecret'),
            { expiresIn: '1h'}
        ) 
        res.json({token, userId: user.type, name: myName});

    } catch (error) {
        console.log("AI AI Ai", error)
        res.status(500).json({message: 'Ошибка чтения базы (нет доступа к БД). Попробуйте позже.'});
    } 
 })


module.exports = router;