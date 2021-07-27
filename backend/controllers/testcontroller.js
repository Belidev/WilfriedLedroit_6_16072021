router.post('/like/:id', function(req, res,next){
    blogModel.update({_id:req.params.id},{$push:{likes:req.user.id}}, function(err, data){
            if(err){res.json(err)}
            else{console.log('liked by'+ req.user.name)
       }
     });
      });