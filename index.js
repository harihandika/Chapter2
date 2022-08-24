const express = require('express')

const app = express()

const port = 3000

const isLogin = true
const db = require('./connection/db')
app.set('view engine', 'hbs')
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false })); 

// Home
app.get("/", (req, res) => {
  db.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM tb_projects ORDER BY id DESC', (err, result) => {
        if (err) throw err 
        let data = result.rows;
        let projects = data.map((item) => {
            return {
                ...item,
                duration : getDateDifference(new Date(item.star_date), new Date(item.end_date)),
                isLogin,
            }
        })
        // console.log(projects)
        res.render('index', {isLogin, projects});
    })

  })
});
  
// Project
  app.get('/project', (req, res) => {
    res.render('project');
  });
  
  app.post('/project', (req, res) => {
    const { title, starDate, endDate, content, technologies, image, nodejs,reactjs, nextjs, typescript } = req.body
    db.connect((err, client, done) => {
      if (err) throw err;
  
      const query = `INSERT INTO tb_projects(name, star_date, end_date, description, technologies, image)
      VALUES ( '${title}','${starDate}', '${endDate}', '${content}',ARRAY['${nodejs}','${reactjs}','${nextjs}','${typescript}'], '${image}');`;
  
      client.query(query, (err, result) => {
        if (err) throw err;
  
        res.redirect("/");
      });
      done();
    });
  });
  
  // contact
  app.get('/contact', (req, res) => {
    res.render('contact');
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
        }
        res.render('project-details', {data})
      })
    })
  });

  // edit
  app.get('/edit-project/:id', (req, res) => {
    let {id} = req.params;
    db.connect(function (err, client, done) {
      if (err) throw err;
  
      const query = `SELECT * FROM tb_projects WHERE id=${id};`;
  
      client.query(query, function (err, result) {
        if (err) throw err;
        // console.log(result.rows[0]);
        let edit = result.rows[0]; //data ditampung dalam variable edit
        edit.star_date = new Date(edit.star_date); // konversi tanggal supaya bisa tampil di halaman edit
        edit.end_date = new Date(edit.end_date); //sama kaya yang diatas cuma inimah tanggal akhir
  
        res.render("edit-project", { isLogin: isLogin, edit, id });//nanti cek id
    })
  })
});

app.post('/edit-project/:id', (req, res) =>{
  const { title, starDate, endDate, content, technologies, image, nodejs,reactjs, nextjs, typescript } = req.body;
  db.connect((err, client, done) => {
    let {id} = req.params;
    if (err) throw err;

    const query = `UPDATE tb_projects SET  name= '${title}', star_date='${starDate}', end_date='${endDate}', description='${content}', technologies=ARRAY['${nodejs}','${reactjs}','${nextjs}','${typescript}'], image='${image}' 
    WHERE id=${id};`;

    client.query(query, (err, result) => {
      if (err) throw err;

      res.redirect("/");
    });
    done();
  });
});

// delete
app.get("/delete-project/:id", (req, res) => {
  const id = req.params.id; //mengambil data parameter

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

function getFullTime(time){

  let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"]
  let date = time.getDate()
  let monthIndex = time.getMonth()
  let year = time.getFullYear()

  // let hours = time.getHours()
  // let minutes = time.getMinutes()

  // if(hours < 10){
  //     hours = "0" + hours
  // }else if(minutes < 10){
  //     minutes = "0" + minutes
  // }
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

  app.listen(port, () => console.log(`Server running on port ${port}`))
