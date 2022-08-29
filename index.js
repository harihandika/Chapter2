const express = require('express');
const db = require('./connection/db');
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('express-flash');
const upload = require("./middlewares/fileUpload");
const app = express();
const port = 3000;

app.set('view engine', 'hbs');
app.use('/public', express.static(__dirname + '/public'));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.urlencoded({ extended: false })); 
app.use(flash());
app.use(session({
    secret: 'bebas',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 3 * 60 * 60 * 1000 // 3JAM
    }
}));

db.connect(function (err, _, done) {
  if (err) throw err;
  console.log("Database Connection Succes");
});

// Home
app.get("/", (req, res) => {
  db.connect((err, client, done) => {
    if (err) throw err
    let query = "";
    
    if (req.session.isLogin == true) {
      query = `SELECT tb_projects.id, tb_user.name as author,tb_projects.name, star_date, end_date, description, technologies, image, post_at
      FROM tb_projects 
      LEFT JOIN tb_user 
      ON tb_projects.author_id = tb_user.id 
      WHERE tb_projects.author_id = '${req.session.user.id}' 
      ORDER BY tb_projects.id DESC`;
    } else {
      query = `SELECT tb_projects.id, tb_user.name as author,tb_projects.name, star_date, end_date, description, technologies, image, post_at
      FROM tb_projects 
      LEFT JOIN tb_user 
      ON tb_projects.author_id = tb_user.id 
      ORDER BY tb_projects.id DESC`;
    }
    client.query(query, (err, result) => {
        if (err) throw err 
        let data = result.rows;
        let projects = data.map((item) => {
            return {
                ...item,
                duration : getDateDifference(new Date(item.star_date), new Date(item.end_date)),
                isLogin: req.session.isLogin,
                post_at: getDistanceTime(item.post_at),
            }
        })
        // console.log(projects)
        res.render('index', {isLogin: req.session.isLogin, user: req.session.user, projects,});
    })
    done();
  })
});
  
// Project
  app.get('/project', (req, res) => {
    if (!req.session.user) {
      req.flash("danger", "Silahkan Login Terlebih Dahulu...!!!");
      return res.redirect("/login");
    }
    res.render("project", {
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  });
  
  app.post('/project', upload.single("image"), (req, res) => {
    const { title, starDate, endDate, content, nodejs,reactjs, nextjs, typescript } = req.body
    const authorId = req.session.user.id;
    const image = req.file.filename;
    db.connect((err, client, done) => {
      if (err) throw err;
  
      const query = `INSERT INTO tb_projects(name, star_date, end_date, description, technologies, image, author_id)
      VALUES ( '${title}','${starDate}', '${endDate}', '${content}',ARRAY['${nodejs}','${reactjs}','${nextjs}','${typescript}'], '${image}', ${authorId}); `;
  
      client.query(query, (err, result) => {
        if (err) throw err;
        req.flash("successs", "Project Added ");
        res.redirect("/");
      });
      done();
    });
  });
  
  // contact
  app.get('/contact', (req, res) => {
    if (!req.session.user) {
      req.flash("danger", "Silahkan Login Terlebih Dahulu...!!!");
      return res.redirect("/login");
    }
    res.render("contact", {
      isLogin: req.session.isLogin,
      user: req.session.user,
    });
  });
  
  // project-detail
  app.get('/project-details/:id', (req, res) => {
    let {id} = req.params;
    db.connect((err, client, done) => {
      if (err) throw err;

      client.query( `SELECT * FROM tb_projects WHERE id=${id};`,
      (err, result) => {
        if (err) throw err;
        let data = result.rows[0] ;
        data = {
          ...data,
          duration : getDateDifference(new Date(data.star_date), new Date(data.end_date)),
          nodejs : data.technologies[0],
          reactjs : data.technologies[1],
          nextjs : data.technologies[2],
          typescript : data.technologies[3],
          star_date : getFullTime(data.star_date),
          end_date : getFullTime(data.end_date),
          author : data.author,
        }
        data.isLogin = req.session.isLogin,
        data.user = req.session.user,
        console.log(data)
        res.render('project-details', {data})
      })
    })
  });

  // edit
  app.get('/edit-project/:id', (req, res) => {
    if (!req.session.user) {
      req.flash("danger", "Silahkan Login Terlebih Dahulu...!!!");
      return res.redirect("/login");
    }
    let {id} = req.params;
    db.connect(function (err, client, done) {
      if (err) throw err;
  
      const query = `SELECT * FROM tb_projects WHERE id=${id};`;
  
      client.query(query, function (err, result) {
        if (err) throw err;
        // console.log(result.rows[0]);
        let edit = result.rows[0]; //data ditampung dalam variable edit
        edit.star_date = changeTime(edit.star_date); // konversi tanggal supaya bisa tampil di halaman edit
        edit.end_date = changeTime(edit.end_date); //sama kaya yang diatas cuma inimah tanggal akhir
        if(edit.technologies[0] == 'undefined') {
          edit.nodejs = false
        }else {
          edit.nodejs = true
        }
        if(edit.technologies[1] == 'undefined') {
          edit.reactjs = false
        }else {
          edit.reactjs = true
        }
        if(edit.technologies[2] == 'undefined') {
          edit.nextjs = false
        }else {
          edit.nextjs = true
        }
        if(edit.technologies[3] == 'undefined') {
          edit.typescript = false
        }else {
          edit.typescript = true
        }
        console.log(edit)
        res.render("edit-project", { isLogin: req.session.isLogin, user: req.session.user,
        edit, id: id });//nanti cek id
    })
  })
});

app.post('/edit-project/:id', upload.single("image"), (req, res) =>{
  const { title, starDate, endDate, content,nodejs,reactjs, nextjs, typescript } = req.body;
  // const authorId = req.session.user.id;
  const image = req.file.filename;
  db.connect((err, client, done) => {
    let {id} = req.params;
    if (err) throw err;

    const query = `UPDATE tb_projects SET  name= '${title}', star_date='${starDate}', end_date='${endDate}', description='${content}', technologies=ARRAY['${nodejs}','${reactjs}','${nextjs}','${typescript}'], image='${image}'
    WHERE id=${id};`;

    client.query(query, (err, result) => {
      if (err) throw err;
      console.log(req.body)
      req.flash("updated", "Data Updated");
      res.redirect("/");
    });
    done();
  });
});

// delete
app.get("/delete-project/:id", (req, res) => {
  if (!req.session.user) {
    req.flash("danger", "Silahkan Login Terlebih Dahulu...!!!");
    return res.redirect("/login");
  }
  const {id} = req.params; //mengambil data parameter
  db.connect((err, client, done) => {
    if (err) throw err;
    const query = `DELETE FROM tb_projects WHERE id=${id};`; //query menghapus data berdasar
    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect("/");
    });
    done();
  });
});

//register
app.get("/register", (req, res) =>  {
  res.render("register");
});

app.post("/register", (req, res) => {
  const {name, email, password} = req.body; //menampung variable inputpassword 
  const hashedpassword = bcrypt.hashSync(password, 10); // enkripsi password (10 saltRound = 10 hash/ second)
  if (name == "") {
    req.flash("warning", "Please input name");
    return res.redirect("/register");
  }
  if (email == "") {
    req.flash("warning", "Please input email");
    return res.redirect("/register");
  }
  if (password == "") {
    req.flash("warning", "Please input Password");
    return res.redirect("/register");
  }
  db.connect((err, client, done) => {
    if (err) throw err;

    const query = `SELECT * FROM tb_user WHERE email = '${email}'`; //check email exist in DB

    client.query(query, (err, result) => {
      if (err) throw err;

      const data = result.rows;
      // console.log(data);
      if (data.length > 0) {
        req.flash("danger", " Email has already exist..!");
        return res.redirect("/register");
      } else {
        db.connect(function (err, client, done) {
          if (err) throw err;

          const query = `INSERT INTO tb_user(name,email,password)
          VALUES ('${name}','${email}','${hashedpassword}')`;

          client.query(query, function (err, result) {
            if (err) throw err;

            res.redirect("/login");
          });
        });
      }
    });
  });
});

//login
app.get("/login", (req, res) =>  {
  res.render("login");
});

app.post("/login",  (req, res) => {
  const {email,password} = req.body;
  if (email == "") {
    req.flash("warning", "Please input Email");
    return res.redirect("/login");
  }
  if (password == "") {
    req.flash("warning", "Please input Password");
    return res.redirect("/login");
  }
  db.connect( (err, client, done) => {
    if (err) throw err;

    const query = `SELECT * FROM tb_user WHERE email = '${email}'`; //check email exist in DB

    client.query(query,  (err, result) => {
      if (err) throw err;

      const data = result.rows;

      if (data.length == 0) {
        //pengecekan apabila email belum terdaftar
        req.flash("danger", " Email not Found..! Register Please!!..");
        return res.redirect("/login");
      }
      const isMatch = bcrypt.compareSync(password, data[0].password); //pencocokan password antara input password dengan hasil pencarian db
      // console.log(isMatch);
      if (isMatch == false) {
        req.flash("danger", "Sorry...!! Password not Match..!");
        return res.redirect("/login");
      }
      //memasukkan data ke session
      req.session.isLogin = true;
      req.session.user = {
        //mengetahui siapa yang sedang login
        id: data[0].id,
        email: data[0].email,
        name: data[0].name,
      };
      console.log(data)
      req.flash("successlogin", "Login succes");
      res.redirect("/");
    });
    done();
  });
});

app.get("/logout", (req, res) =>  {
  req.session.destroy(); //sesion akan dihapus
  res.redirect("/login");
});

function getFullTime(time){

  let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"]
  let date = time.getDate()
  let monthIndex = time.getMonth()
  let year = time.getFullYear()
  let fullTime = `${date} ${month[monthIndex]} ${year} `
  return fullTime
}

function getDateDifference(startDate, endDate) {
  //Durasi tanggal
  if (startDate > endDate) {
    console.error("Start date must be before end date");
    return null;
  }
  let startYear = startDate.getFullYear();
  let startMonth = startDate.getMonth();
  let startDay = startDate.getDate();
  let endYear = endDate.getFullYear();
  let endMonth = endDate.getMonth();
  let endDay = endDate.getDate();

  let february =
    (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;

  let daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let startDateNotPassedInEndYear =
    endMonth < startMonth || (endMonth == startMonth && endDay < startDay);

  let years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);

  let months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;

  let days =
    startDay <= endDay
      ? endDay - startDay
      : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;

  return { years: years, months: months, days: days };
}

function changeTime(waktu) {
  //memunculkan start date dan end date di form edit/update
  let newTime = new Date(waktu);
  const date = newTime.getDate();
  const monthIndex = newTime.getMonth() + 1;
  const year = newTime.getFullYear();

  if (monthIndex < 10) {
    monthformat = "0" + monthIndex;
  } else {
    monthformat = monthIndex;
  }

  if (date < 10) {
    dateformat = "0" + date;
  } else {
    dateformat = date;
  }
  const fullTime = `${year}-${monthformat}-${dateformat}`;
  return fullTime;
}

function getDistanceTime(waktu) {
  //memunculkan postingnya kapan
  let timeNow = new Date();
  let timePost = waktu;
  let distance = timeNow - timePost; // hasilnya milisecond
  // console.log(distance);

  let milisecond = 1000; // 1 detik 1000 milisecond
  let secondInHours = 3600; // 1 jam sama dengan 3600 detik
  let hoursInDay = 24; // 1 hari 24 jam

  let distanceDay = Math.floor(
    distance / (milisecond * secondInHours * hoursInDay)
  );
  let distanceHours = Math.floor(distance / (milisecond * 60 * 60));
  let distanceMinutes = Math.floor(distance / (milisecond * 60));
  let distanceSeconds = Math.floor(distance / milisecond);

  if (distanceDay > 0) {
    return `${distanceDay} days ago`;
  } else if (distanceHours > 0) {
    return `${distanceHours} hours ago`;
  } else if (distanceMinutes > 0) {
    return `${distanceMinutes} minutes ago`;
  } else {
    return `${distanceSeconds} seconds ago`;
  }
}

  app.listen(port, () => console.log(`Server running on port ${port}`))
