const express = require('express')

const app = express()

const port = 3000

const isLogin = true

app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));  //kasih tau bisa nerima data karena default true


app.get("/", (req, res) => {
    res.render('index',{ isLogin });
  });
  
  app.get('/project', (req, res) => {
    res.render('project');
  });
  
  app.post('/project', (req, res) => {
    console.log(req.body);
  
    res.redirect('/');
  });
  
  app.get('/contact', (req, res) => {
    res.render('contact');
  });
  
  app.get('/project-details/:id', (req, res) => {
    const { id } = req.params
    console.log(id)
    res.render('project-details')
  })

  // app.get("/project-details/:id", function (req, res) {
  //   let id = req.params.id;
  //   res.render("project-details", {
  //     project: {
  //       id,
  //       title: "Pelatihan Bootcamp Dumbways",
  //       content: "lore lore lore RIP love wkwk",
  //     },
  //   });
  // });


  app.listen(port, () => console.log(`Server running on port ${port}`))

// https://discord.gg/9g2ar9nP