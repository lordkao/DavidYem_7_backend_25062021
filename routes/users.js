const express = require('express')
const router = express.Router()
const mysql = require('mysql2')

/*Création de la fonction de connection*/
/*************************************************/

function dbConnect(){
    const connection = mysql.createConnection({
    host : 'localhost',
    user : 'groupomania',
    password : 'client',
    database : 'groupomania'
    })  
    return connection
}
/*création de compte*/
router.post('/signup',(req,res,next) => {
    const nom = req.body.nom
    const prenom = req.body.prenom
    const email = req.body.email
    const password = req.body.password

    if(nom == '' || prenom == '' || email == '' || password == ''){
        res.status(400).json({ token :''})
    }
    else{

        res.status(201).json({ token : 'lordkao' })
    }
})

/*Connexion*/
router.post('/login',(req,res,next) => {

})
module.exports = router