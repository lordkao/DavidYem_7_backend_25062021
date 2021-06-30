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

exports.getAllPublications = (req,res,next) => {
    const db = dbConnect()

    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.id AS id,Publications.userId AS userId,Publications.message AS message,TIME(Publications.date) AS date,Publications.urlImage AS url FROM Users INNER JOIN publications ON Users.userId = Publications.userId ORDER BY date DESC')

    .then((responses) => {
        return res.status(200).json(responses[0])
    })
    .catch((err) => {
        return res.status(500).json(err)
    })
    .then(() => db.end())
}
exports.createPublication = (req,res,next) => {
    console.log(req.file.filename)
    const userId = req.body.userId
    const message = req.body.message
    const date = new Date()
    const publication = [userId,message,date,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`]
    const db = dbConnect()
    db.promise().query('INSERT INTO publications(userId,message,date,urlImage) VALUES (?,?,?,?)',publication)
    .then(() => { res.status(201).json({ message : 'Publication créée avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())
}
exports.updatePublication = (req,res,next) => {
    console.log(req.body)
    const userId = req.body.userId
    const message = req.body.message
    const date = new Date()
    const publication = [req.params.id,userId,message,date,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`]
    const db = dbConnect()
    db.promise().query('UPDATE publications(userId,message,date,urlImage) WHERE id=? VALUES (?,?,?,?)',publication)
    .then(() => { res.status(201).json({ message : 'Publication modifiée avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())
}
exports.deletePublication = (req,res,next) => {
    console.log(req.params.id)
    const publication = [req.params.id]
    const db = dbConnect()
    db.promise().query('DELETE FROM publications WHERE id=? ',publication)
    .then(() => { res.status(200).json({ message : 'Publication supprimée avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())
}