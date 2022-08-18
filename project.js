let projects = []

let month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec"
]

function addProject(event) {
    event.preventDefault()

    let inputName = document.getElementById("inputProjectName").value
    let inputContent = document.getElementById("inputDescription").value
    let inputImage = document.getElementById("inputImage").files[0]
    let startDate= document.getElementById("inputStartDate").value
    let endDate= document.getElementById("inputEndDate").value
    let html = document.getElementById("checkHtml").checked
    let css = document.getElementById("checkCss").checked
    let nodeJs = document.getElementById("checkNode").checked
    let reactJs = document.getElementById("checkReact").checked
    

    inputImage = URL.createObjectURL(inputImage)


    let project = {
        title: inputName,
        startDateVariable:startDate,
        endDateVariable:endDate,
        content: inputContent,
        // icons: cardIcons,
        image: inputImage,
        html:html,
        css:css,
        nodeJs:nodeJs,
        reactJs:reactJs,
    }

    projects.push(project)

    console.table(projects)
    renderCard()
}

function getProjectDuration(endDateVariable, startDateVariable) {

    const distance = endDateVariable - startDateVariable

    const miliseconds = 1000
    const secondInMinute = 60
    const minuteInHour = 60
    const secondInHour = secondInMinute * minuteInHour // 3600
    const hourInDay = 24
    const dayInMonth = 30
    const monthInYear = 12

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

function renderCard() {

    let containerProject = document.getElementById("contents")
    containerProject.innerHTML = '';


    for (let i = 0; i < projects.length; i++) {

        const startDateVariable = new Date(projects[i].startDateVariable)
        const endDateVariable = new Date(projects[i].endDateVariable)
        const duration = getProjectDuration(endDateVariable, startDateVariable)

        containerProject.innerHTML += `
        <div id="contents" class="mp-card">
        <!--MPC = My Project Card-->
        <div class="mpc-img">
            <img class="card-img-top rounded mx-auto d-block p-2" src="${projects[i].image}" alt="">
        </div>
        <div class="mpc-title">
            <a class="text-decoration-none text-dark fw-bold text-center" href="project-details.html" target="_blank">
                <p class="card-title my-2"> ${projects[i].title} </p>
            </a>
        </div>
        <div class="mpc-duration">
            <small>${duration}</small>
        </div>
        <div class="mpc-content fs-8">
        ${projects[i].content}
        </div>
        <h6 class="card-subtitle text-muted text-end">1 hour ago</h6>
        <div class="mpc-icons">
            ${(projects[i].html === true) ? '<img class="mpc-icons me-3" src="./assets/graphql.svg" />' : ''}
            ${(projects[i].css === true) ? '<img class="mpc-icons me-3" src="./assets/nextjs.svg" />' : ''}
            ${(projects[i].nodeJs === true) ? '<img class="mpc-icons me-3"src="./assets/react.svg" />' : ''}
            ${(projects[i].reactJs === true) ? '<img src="./assets/redux.svg" />' : ''}  
        </div>
        <div class="mpc-mod my-3 btn-group d-flex">
            <button type="button" class="btn btn-dark me-1">Edit</button>
            <button type="button" class="btn btn-dark ms-1">Delete</button>
        </div>
    </div>
        `
    }
}

    // let cardIcons = {
    //     html: document.querySelector('input[name="checkHtml"]').checked,
    //     css: document.querySelector('input[name="checkCss"]').checked,
    //     nodeJs: document.querySelector('input[name="checkNode"]').checked,
    //     reactJs: document.querySelector('input[name="checkReact"]').checked
    // }
        // const objectProjectString = JSON.stringify(projects);
                // localStorage.setItem(`${projects[i].title}`, objectProjectString);
                
