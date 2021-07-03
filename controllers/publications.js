const database = require('../app.js')
const fs = require('fs')

/*Création de la fonction de connection*/
/*************************************************/

exports.getAllPublications = (req,res,next) => {
    const db = database.connect()

    db.promise().query('SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.id AS id,Publications.userId AS userId,Publications.message AS message,TIME(Publications.date) AS date,Publications.urlImage AS url FROM Users INNER JOIN publications ON Users.userId = Publications.userId ORDER BY Publications.date DESC LIMIT 10')

    .then((responses) => {
        return res.status(200).json(responses[0])
    })
    .catch((err) => {
        return res.status(500).json(err)
    })
    .then(() => db.end())
}
exports.getMorePublications = (req,res,next) => {
    const offset = req.params.numberOfPublications
    console.log(offset)
    const requete = `SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.message AS message,Publications.urlImage AS url,Publications.userId AS userId,DATE_FORMAT(Publications.date,GET_FORMAT(DATETIME,\'EUR\')) AS date,Publications.id AS id FROM Users INNER JOIN Publications ON Users.userId = Publications.userId ORDER BY Publications.date DESC LIMIT 10 OFFSET ${offset}`
    console.log(requete)
    const db = database.connect()
    db.promise().query(requete)
    .then((response) => {
        res.status(200).json(response[0])
    })
    .catch((err) => res.status(500).json(err))
    /*'SELECT Users.nom AS nom,Users.prenom AS prenom,Publications.message AS message,Publications.urlImage AS url,Publications.userId AS userId,DATE_FORMAT(Publications.date,GET_FORMAT(DATETIME,\'EUR\')) AS date,Publications.id AS id FROM Users INNER JOIN Publications ON Users.userId = Publications.userId ORDER BY Publications.date DESC LIMIT 10 OFFSET 10' */
    /*res.status(200).json({ message:'Nous avons bien reçue votre demande ! Merci de patienter...'})*/
}
exports.createPublication = (req,res,next) => {
    console.log(req.body)
    const userId = req.body.userId
    const message = req.body.message
    const date = new Date()
    const publication = req.file ? [userId,message,date,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`] : [userId,message,date]
    /*const db = dbConnect()
    db.promise().query('INSERT INTO publications(userId,message,date,urlImage) VALUES (?,?,?,?)',publication)
    .then(() => { res.status(201).json({ message : 'Publication créée avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())*/
    
    if(req.file){
        const db = database.connect()
        db.promise().query('INSERT INTO publications(userId,message,date,urlImage) VALUES (?,?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication créée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())    
    }
    else{
        const db = database.connect()
        db.promise().query('INSERT INTO publications(userId,message,date) VALUES (?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication créée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())
    }
}
exports.updatePublication = (req,res,next) => {
    console.log(req.body)
    const userId = req.body.userId
    const message = req.body.message
    const date = new Date()
    const publication = req.file ? [req.params.id,userId,message,date,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`] : [req.params.id,userId,message,date]
    if(req.file){
        const db = database.connect()
        db.promise().query('UPDATE publications(userId,message,date,urlImage) WHERE id=? VALUES (?,?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication modifiée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())    
    }
    else{
        const db = database.connect()
        db.promise().query('UPDATE publications(userId,message,date) WHERE id=? VALUES (?,?,?)',publication)
        .then(() => { res.status(201).json({ message : 'Publication modifiée avec succès !'})})
        .catch((err) => { res.status(500).json({ err })})
        .then(() => db.end())
    }
    /*const db = dbConnect()
    db.promise().query('UPDATE publications(userId,message,date,urlImage) WHERE id=? VALUES (?,?,?,?)',publication)
    .then(() => { res.status(201).json({ message : 'Publication modifiée avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())*/
}
exports.deletePublication = (req,res,next) => {
    console.log(req.params.id)
    const id = [req.params.id]
    const db = database.connect()
        /*Requête de modification vers la Database*/
        /*************************************************/
        db.promise().query('SELECT urlImage FROM Publications WHERE Id=?',id)
        .then((response) => {
            console.log(response[0])
            const urlImage = response[0][0].urlImage
            console.log(urlImage)
            if(urlImage !== null){            
                const filename = urlImage.split('/images/')[1]
                fs.unlink(`images/${filename}`,() => {
                    db.promise().query('DELETE FROM publications WHERE id=? ',id)
                    .then((response) => {
                        console.log(response[0])
                        res.status(200).json({ message: 'Publication supprimée avec succès !'})
                    })
                    .catch((err) => {
                        return res.status(500).json(err)
                    })
                    db.end()
                })
            }
            else{
                db.promise().query('DELETE FROM publications WHERE id=? ',id)
                    .then((response) => {
                        console.log(response[0])
                        res.status(200).json({ message: 'Publication supprimée avec succès !'})
                    })
                    .catch((err) => {
                        return res.status(500).json(err)
                    })
                    db.end()
            }
        })
        .catch((err) => res.status(500).json(err))
    


    /*db.promise().query('DELETE FROM publications WHERE id=? ',id)
    .then(() => { res.status(200).json({ message : 'Publication supprimée avec succès !'})})
    .catch((err) => { res.status(500).json({ err })})
    .then(() => db.end())*/
}
/*[req.params.id,userId,message,date,`${req.protocol}://${req.get('host')}/images/${req.file.filename}`]*/