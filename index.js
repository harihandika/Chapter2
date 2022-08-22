const express = require('express')

const app = express()

const port = 3000
let projects = [
  // {
  //   title : "Hari",
  //   content : "yaww",
  // }
]

const isLogin = true

app.set('view engine', 'hbs')

app.use('/public', express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false })); 

app.get("/", (req, res) => {

  let data = projects.map((item) => {
    return {
        ...item,
        isLogin,
    }
  })
    res.render('index',{ isLogin, project: data});
  });
  
  app.get('/project', (req, res) => {
    res.render('project');
  });
  
  app.post('/project', (req, res) => {
    // const data = req.body
    console.log(req.body)
    let title = req.body.title
    let content = req.body.content
    let starDate = req.body.starDate
    let endDate = req.body.endDate
    let duration = getProjectDuration(new Date(req.body.endDate), new Date(req.body.starDate))
    let checkHtml = req.body.checkHtml
    let checkNode = req.body.checkNode
    let checkCss = req.body.checkCss
    let checkReact = req.body.checkReact
    let project = {
      title,
      content,
      starDate,
      endDate,
      duration,
      checkHtml,
      checkNode,
      checkCss,
      checkReact,
      postAt: getFullTime(new Date()),
  }

  projects.push(project) 
    res.redirect('/')
  });
  
  
  app.get('/contact', (req, res) => {
    res.render('contact');
  });
  
  app.get('/project-details/:index', (req, res) => {
    let index = req.params.index
    console.log(index)
    let data = projects[index]
    data = {
        title: data.title,
        content: data.content,
        starDate : data.starDate,
        endDate: data.endDate,
        duration: getProjectDuration(new Date(data.endDate), new Date(data.starDate)),
        checkHtml : data.checkHtml,
        checkNode : data.checkNode,
        checkCss : data.checkCss,
        checkReact :data.checkReact,
    }
    res.render('project-details',{data})
  })

  app.get('/edit-project/:index', (req, res) => {
    let index = req.params.index

    let data = {
        title: projects[index].title,
        content: projects[index].content,
        starDate: projects[index].starDate,
        endDate: projects[index].endDate,
        duration: getProjectDuration(new Date(projects[index].endDate), new Date(projects[index].starDate)),
        checkHtml: projects[index].checkHtml,
        checkNode: projects[index].checkNode,
        checkCss: projects[index].checkCss,
        checkReact: projects[index].checkReact,
    }

    res.render('edit-project', {index, data})
})

app.post('/edit-project/:index', (req, res) =>{

    let index = req.params.index

    projects[index].title = req.body.title
    projects[index].content = req.body.content
    projects[index].starDate = req.body.starDate
    projects[index].endDate = req.body.endDate
    projects[index].duration = getProjectDuration(new Date(req.body.endDate), new Date(req.body.starDate))
    res.redirect('/')
    projects[index].checkHtml = req.body.checkHtml
    projects[index].checkNode = req.body.checkNode
    projects[index].checkCss = req.body.checkCss
    projects[index].checkReact = req.body.checkReact
})

app.get('/delete-project/:index', (req, res) => {
  // console.log(request.params);
  let index = req.params.index
  // console.log(index);
  projects.splice(index, 1)

  res.redirect('/')
})

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
