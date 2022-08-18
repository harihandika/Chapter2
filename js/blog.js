let blogs = []

function getFullTime(time) {

    let month = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]

    // tanggal => getDate()
    // bulan => getMonth()
    // tahun => getFullYear()
    // jam => getHours()
    // menit => getMinutes()

    let date = time.getDate()
    let monthIndex = time.getMonth()
    let year = time.getFullYear()
    let hour = time.getHours()
    let minute = time.getMinutes()

    let result = `${date} ${month[monthIndex]} ${year} ${hour}:${minute} WIB`

    // console.log(time);
    // console.log(result);

    return result;
}

function addBlog(event) {
    event.preventDefault()

    let inputName = document.getElementById("inputProjectName").value
    let inputContent = document.getElementById("inputDescription").value
    let inputImage = document.getElementById("inputImage").files[0]
    let startDate= document.getElementById("inputStartDate").value
    let endDate = document.getElementById("inputEndDate").value
    // const projectDate = {

    //     let startDate= document.getElementById("inputStartDate").value,
    //     let endDate = document.getElementById("inputEndDate").value
    // }

    inputImage = URL.createObjectURL(inputImage)

    let cardIcons = {
        html: document.querySelector('input[name="checkHtml"]').checked,
        css: document.querySelector('input[name="checkCss"]').checked,
        nodeJs: document.querySelector('input[name="checkNode"]').checked,
        reactJs: document.querySelector('input[name="checkReact"]').checked
    }

    let blog = {
        title: inputName,
        startDate:startDate,
        endDate:endDate,
        // date: projectDate,
        content: inputContent,
        icons: cardIcons,
        image: inputImage,
        postAt: new Date()
    }

    blogs.push(blog)

    console.table(blogs)

    renderCard()
}

function getProjectDuration(endDate, startDate) {

    const distance = endDate - startDate

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

function getDistanceTime(time) {
    let blogPostAt = new Date(time); // Waktu Blog di post
    let currentTime = new Date() // Waktu saat ini

    let distance = currentTime - blogPostAt; // milisecond

    // Convert to Day
    let dayDistance = Math.floor(distance / (1000 * 60 * 60 * 24))

    if(dayDistance > 0) {
        return `${dayDistance} day ago`;
    } else {
        // Convert to Hour
        let hourDistance = Math.floor(distance / (1000 * 60 * 60))

        if(hourDistance > 0) {
            return `${hourDistance} hours ago`;
        } else {
            // Convert to Minute
            let minuteDistance = Math.floor(distance / (1000 * 60))

            if (minuteDistance > 0) {
                return `${minuteDistance} minute ago`;
            } else {
                // Convert to Second
                let secondDistance = Math.floor(distance / (1000))

                return `${secondDistance} second ago`;
            }
        }

    }
}

function renderCard() {

    let containerBlog = document.getElementById("contents")
    containerBlog.innerHTML = '';

    const objectBlogString = JSON.stringify(blogs);

    for (let i = 0; i < blogs.length; i++) {

        const startDateVariable = new Date(blogs[i].startDate)
        const endDateVariable = new Date(blogs[i].endDate)
        const duration = getProjectDuration(endDateVariable, startDateVariable)

        localStorage.setItem(`${blogs[i].title}`, objectBlogString);

        containerBlog.innerHTML += `
        <div id="contents" class="mp-card">
            <!--MPC = My Project Card-->
            <div class="mpc-img">
                <img src="${blogs[i].image}" alt="">
            </div>
            <div class="mpc-title">
            <a href="blog-detail.html?${blogs[i].title}" id='${blogs[i].title}' target="_blank" action="blog-detail.html?${blogs[i].title}">
                <p>${blogs[i].title}</p>
            </a>
            </div>
            <div class="mpc-duration">
                <small>Durasi: ${duration}</small>
            </div>
            <div class="mpc-content">
                ${blogs[i].content}
            </div>
            <div style="text-align: right; color: grey; font-size: 15px">
                ${getDistanceTime(blogs[i].postAt)}
            </div>
            <div class="mpc-icons">
                ${(blogs[i].icons.html === true) ? '<i class="fa-brands fa-html5"></i>' : ''}
                ${(blogs[i].icons.css === true) ? '<i class="fa-brands fa-css3-alt"></i>' : ''}
                ${(blogs[i].icons.nodeJs === true) ? '<i class="fa-brands fa-node-js"></i>' : ''}
                ${(blogs[i].icons.reactJs === true) ? '<i class="fa-brands fa-react"></i>' : ''}  
            </div>
            <div class="mpc-mod">
                <button>Edit</button>
                <button>Delete</button>
            </div>
        </div>
        `
    }
}

setInterval(function() {
    renderCard()
}, 1000)
