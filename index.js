var express = require('express'); // Import de la bibliothèque Express
var app = express(); // Instanciation d'une application Express


// Middleware pour gérer les appels AJAX
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route de test
app.get('/test/*', function(req, res) {
  let msg = req.url.substr(6); // Récupérer la partie après '/test/'
  res.json({"msg": msg});
});

// Gestion d'un compteur global
let compteur = 0;

// Route pour récupérer la valeur du compteur
app.get('/cpt/query', function(req, res) {
  res.json({"compteur": compteur});
});

// Route pour incrémenter le compteur
app.get('/cpt/inc', function(req, res) {
  let increment = parseInt(req.query.v);
  if (!isNaN(increment)) {
    compteur += increment;
    res.json({"code": 0});
  } else if (req.query.v === undefined) {
    compteur += 1;
    res.json({"code": 0});
  } else {
    res.json({"code": -1});
  }
});

// Gestion des messages des avatars
let avatars = {
  "Alice": "avatar1.webp",
  "Bob": "avatar2.webp",
  "Charlie": "avatar3.webp",
  "Default": "avatarDefault.webp"
};

// Gestion des messages
let allMsgs = [
  { pseudo: "Alice", message: "Hello World", date: "2025-03-16T08:30:00Z", avatar: avatars["Alice"] },
  { pseudo: "Bob", message: "foobar", date: "2025-03-16T08:35:00Z", avatar: avatars["Bob"] },
  { pseudo: "Charlie", message: "CentraleSupelec Forever", date: "2025-03-16T08:40:00Z", avatar: avatars["Charlie"] }
];


// Liste des avatars disponibles
const availableAvatars = [
  "avatar1.webp",
  "avatar2.webp",
  "avatar3.webp",
  "avatar4.webp",
  "avatar5.webp",
  "avatarDefault.webp"
];

// Récupérer un message par son numéro
app.get('/msg/get/:num', function(req, res) {
  let num = parseInt(req.params.num);
  if (!isNaN(num) && num >= 0 && num < allMsgs.length) {
    res.json({"code": 1, "msg": allMsgs[num]});
  } else {
    res.json({"code": 0});
  }
});

// Récupérer tous les messages
app.get('/msg/getAll', function(req, res) {
  res.json(allMsgs);
});

// Récupérer le nombre de messages
app.get('/msg/nber', function(req, res) {
  res.json(allMsgs.length);
});

// Ajouter un message avec un pseudo et avatar (spécifié dans les paramètres)
app.get('/msg/post/:pseudo/:message', function(req, res) {
  let pseudo = unescape(req.params.pseudo);
  let message = unescape(req.params.message);
  let newAvatar = req.query.avatar;  // L'avatar à mettre à jour dans la query

  // Si un nouvel avatar est fourni dans la query, on le met à jour
  if (newAvatar && availableAvatars.includes(newAvatar)) {
    // Mettre à jour l'avatar de l'utilisateur dans la liste des avatars
    avatars[pseudo] = newAvatar;

    // Mettre à jour l'avatar dans tous les anciens messages de cet utilisateur
    allMsgs.forEach(msg => {
      if (msg.pseudo === pseudo) {
        msg.avatar = newAvatar; // Mettre à jour l'avatar du message
      }
    });
  } else if (!newAvatar) {
    // Si aucun avatar n'est fourni, on garde celui existant ou on met un avatar par défaut
    newAvatar = avatars[pseudo] || avatars["Default"];
  }

  // Créer un nouveau message avec l'avatar mis à jour
  let newMessage = {
    pseudo: pseudo,
    message: message,
    date: new Date().toISOString(),
    avatar: newAvatar
  };

  // Ajouter le message à la liste des messages
  allMsgs.push(newMessage);

  // Répondre avec le message ajouté
  res.json(newMessage);
});

// Supprimer un message
app.get('/msg/del/:num', function(req, res) {
  let num = parseInt(req.params.num);
  if (!isNaN(num) && num >= 0 && num < allMsgs.length) {
    allMsgs.splice(num, 1);
    res.json({"code": 1});
  } else {
    res.json({"code": 0});
  }
});

// Lancement du serveur
app.listen(8080, () => {
  console.log("App listening on port 8080...");
});
