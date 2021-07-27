const Sauce = require('../models/sauces')
const fs = require('fs')

/** Controllers for creation, modification,deletion and liking/disliking of sauces **/

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  if(req.body.like ==1){ //dans le cas ou l'utilisateur like la sauce
    Sauce.updateOne({_id: req.params.id}, {$inc:{likes:1}, $push:{usersLiked:req.body.userId },_id:req.params.id } )// on ajoute un like au paramètre "likes" du modèle sauce. On push l'id de l'utilisateur vers l'array "usersLiked"
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  }else if(req.body.like ==-1){// si l'utilisateur dislike sauce
    Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes:1}, $push:{usersDisliked:req.body.userId },_id:req.params.id } ) //On ajoute un like au pramètre "dislikes" du modèle sauce. On push l'id de l'utilisateur vers l'array "usersDisliked"
    .then(sauces=> res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
  }else if(req.body.like ==0){ 
    Sauce.findOne({_id: req.params.id}) //si l'utilisateur annule un like/dislike précédent.
    .then(sauces=> {
      if(sauces.usersLiked.find(user=> user===req.body.userId)){//en cas de like précédent
        Sauce.updateOne({_id: req.params.id}, {$inc:{likes:-1}, $pull:{usersLiked:req.body.userId },_id:req.params.id } ) // on retire son ID de l'array "usersliked", on ajoute -1 à "likes" dans le modèle sauce
        .then(sauces=> res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
      }
      if(sauces.usersDisliked.find(user=> user===req.body.userId)){//en cas de dislike précédent
        Sauce.updateOne({_id: req.params.id}, {$inc:{dislikes:-1}, $pull:{usersDisliked:req.body.userId },_id:req.params.id } ) // on retire son ID de l'array "usersdisliked", on ajoute -1 à "dislikes" dans le modèle sauce
        .then(sauces=> res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
      }
    })
    .catch(error=>console.log(error));
  }
};
