const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Thing = require('./models/thing');

mongoose.connect('mongodb+srv://karlbecker:Computer1@cluster0.csscm.mongodb.net/mydb?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

// Il ya 4 middlewares

// Enregistre « Requête reçue ! » dans la console et passe l'exécution ;
// app.use((req, res, next) => {
//     console.log('Requête reçue !');
//     next();
// });

// // Ajoute un code d'état 201 à la réponse et passe l'exécution
// app.use((req, res, next) => {
//     res.status(201)
//     next();
// });


// // Envoie la réponse JSON et passe l'exécution
// app.use((req, res, next) => {
//     res.json({ message : 'Votre reqête a bien été reçue !'});
//     next();
// });

// // Enregistre « Réponse envoyée avec succès ! » dans la console.
// app.use((req, res) => {
//     console.log('Réponse envoyée avec succès')
// });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

// app.use('/api/stuff', (req, res, next) => {
//     const stuff = [
//       {
//         _id: 'oeihfzeoi',
//         title: 'Mon premier objet',
//         description: 'Les infos de mon premier objet',
//         imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
//         price: 4900,
//         userId: 'qsomihvqios',
//       },
//       {
//         _id: 'oeihfzeomoihi',
//         title: 'Mon deuxième objet',
//         description: 'Les infos de mon deuxième objet',
//         imageUrl: 'https://www.publicdomainpictures.net/pictures/10000/nahled/1-1216221458n7mg.jpg',
//         price: 2900,
//         userId: 'qsomihvqios',
//       },
//     ];
//     res.status(200).json(stuff);
// });

// app.post('/api/stuff', (req, res, next) => {
//     console.log(req.body);
//     res.status(201).json({
//       message: 'Objet créé !'
//     });
// });

// Enregistrement des Things dans la base de données
app.post('/api/stuff', (req, res, next) => {
    delete req.body._id;
    const thing = new Thing({
      ...req.body
    });
    console.log(req.body);
    console.log('Nouvel objet enregistré !');
    thing.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
});

// Mettez à jour un Thing existant
app.put('/api/stuff/:id', (req, res, next) => {
  Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => {
      console.log(req.body);
      console.log('Objet modifié !');

      res.status(200).json({ message: 'Objet modifié !'})
    })
    .catch(error => res.status(400).json({ error }));
});

// Suppression d'un Thing
app.delete('/api/stuff/:id', (req, res, next) => {
  console.log(req.params);
  console.log('Objet supprimé !');
  Thing.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
});

// Récupération d'un Thing spécifique
app.get('/api/stuff/:id', (req, res, next) => {
  
  Thing.findOne({ _id: req.params.id })
    .then(thing => {
      console.log(thing);
      console.log('Objet selectionné !');

      res.status(200).json(thing)
    })
    .catch(error => res.status(404).json({ error }));
});

// Récupération de la liste de Things en vente
app.use('/api/stuff', (req, res, next) => {
  Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
});

module.exports = app;