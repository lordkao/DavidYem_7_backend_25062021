const mysql = require('mysql2')
const bcrypt = require('bcrypt')
const uniqid = require('uniqid')


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

exports.signup = (req,res,next) => {
    const nom = req.body.nom
    const prenom = req.body.prenom
    const email = req.body.email
    const password = req.body.password

/*fonction qui permet la création d'un userId unique en utilisant les milliseconde de la date du moment*/
/*************************************************//*************************************************/
    function uniqueUserId(){
        let date = new Date()
        let time = date.getTime()
        let uniqueUserId = uniqid(time)
        console.log('test : '+uniqueUserId) 
        return uniqueUserId
    }

    if(nom == '' || prenom == '' || email == '' || password == ''){
        res.status(400).json({ erreur : 'il manque des informations !'})
    }
    else{
        /*Emploi de bcrypt pour hasher et saler le password*/
        /*************************************************/
        bcrypt.hash(password,10)
        .then(hash => {
            const user = {
                nom : nom,
                prenom : prenom,
                email : email,
                password : hash,
                userId : uniqueUserId()
            }
            console.log(user)
            console.log('mdp hashé : ' +hash)

            const db = dbConnect()
            /*Requête d'insertion vers la Database*/
            /*************************************************/
            db.query('INSERT INTO users (nom,prenom,email,password,userId) VALUES (?,?,?,?,?)',
            [user.nom,user.prenom,user.email,user.password,user.userId],
            function(err,data){
                if(err){
                    res.status(401).json(err)
                }
                else{
                    console.log(data)
                    res.status(201).json({ token:'lordkao'})
                }
            })
        })
        .catch( err => res.status(500).json({ err }))

    }
}

exports.login = (req,res,next) => {
    console.log(req.body)
    const email = req.body.email
    const password = req.body.password
    const data = [email]
    const db = dbConnect()
    db.query('SELECT * FROM Users WHERE email=?',data,function(err,results){
        if(err){
            return res.status(401).json({ erreur:err})
        }
        else if(results.length == 0){
            return res.status(401).json({ erreur:' Utilisateur non trouvé !'})
        }
        else if(results.length > 0){
            console.log(results[0])
            console.log(results[0].password)
            bcrypt.compare(password,results[0].password)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({ error: 'Mot de passe incorrect !'})
                }
                res.status(200).json({ 
                    userId:results[0].userId,
                    token:'lordkao'
                })
            })
            .catch( error => res.status(500).json({ error}))
        }
        
    })
    
}
