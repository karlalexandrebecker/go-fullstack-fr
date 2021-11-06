// Serveur Express nécessitant app.js avec contenu ou  page renvoyée sinon erreur 404

const http = require('http');
const app = require('./app');

app.set('port', process.env.PORT || 3000);
const server = http.createServer(app)

server.listen(process.env.PORT || 3000);

/*
fichier app.js
const express = require('express');

const app = express();

app.use((req, res) => {
   res.json({ message: 'Votre requête a bien été reçue !' }); 
});

module.exports = app;
*/