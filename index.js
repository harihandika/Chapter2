const express = require('express')

const app = express()

const port = 3000

const isLogin = true
const db = require('./connection/db')
app.set('view engine', 'hbs')
app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false })); 

app.get("/", (req, res) => {
  db.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM tb_projects', (err, result) => {
        if (err) throw err 
        let data = result.rows
        console.log(result.rows)
        let projects = data.map((item) => {
            return {
                ...item,
                duration : getProjectDuration(new Date(item.end_date), new Date(item.star_date)),
                isLogin,
            }
        })

        res.render('index', {isLogin, projects})
    })

  })
});
  
  app.get('/project', (req, res) => {
    res.render('project');
  });
  
  app.post('/project', (req, res) => {
    res.redirect('/')
  });
  
  
  app.get('/contact', (req, res) => {
    res.render('contact');
  });
  
  app.get('/project-details/:index', (req, res) => {
    res.render('project-details')
  });

  app.get('/edit-project/:index', (req, res) => {
    res.render('edit-project')
});

app.post('/edit-project/:index', (req, res) =>{
});

app.get('/delete-project/:index', (req, res) => {
  res.redirect('/')
});

function getFullTime(time){

  let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"]
  let date = time.getDate()
  let monthIndex = time.getMonth()
  let year = time.getFullYear()

  let hours = time.getHours()
  let minutes = time.getMinutes()

  if(hours < 10){
      hours = "0" + hours
  }else if(minutes < 10){
      minutes = "0" + minutes
  }
  let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`
  return fullTime
}

function getProjectDuration(endDate, startDate) {
  let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"]
  let distance = endDate - startDate

  let miliseconds = 1000
  let secondInMinute = 60
  let minuteInHour = 60
  let secondInHour = secondInMinute * minuteInHour // 3600
  let hourInDay = 24
  let dayInMonth = 30
  let monthInYear = 12

  let monthDistance = distance / (miliseconds * secondInHour * hourInDay * dayInMonth)
  let dayDistance = distance / (miliseconds * secondInHour * hourInDay)

  if (monthDistance >= 12) {
      return `${Math.floor(monthDistance / monthInYear)}` + ` Year`
  } else if(dayDistance >= 30){
      return `${Math.floor(dayDistance/dayInMonth)}` + ' Month'
  }else{
      return `${Math.floor(dayDistance)}` + ' day'
  }

}

  app.listen(port, () => console.log(`Server running on port ${port}`))
