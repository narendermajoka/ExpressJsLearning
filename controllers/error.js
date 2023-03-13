exports.get404 = (req,res,next)=>{
    res
    .status(400)
    .render('404',{pageTitle: 'Page Not Found Title', path: '/404'});
    // .sendFile(path.join(__dirname,'views','page-not-found.html'));
};
  