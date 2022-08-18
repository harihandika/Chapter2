
function submitForm() {
  // DOM = Document Object Model
  let name = document.getElementById("input-name").value
  let email = document.getElementById("input-email").value
  let phone = document.getElementById("input-phone").value
  let subject = document.getElementById("choose-subject").value
  let message = document.getElementById("input-message").value


  // VALIDATION
  if (name, email, phone, subject, message == "") {
      return alert("All form input must be filled to continue")
  }

  let emailReceiver = "harihandika2441998@gmail.com"

  let a = document.createElement('a')
  a.href = `mailto:${emailReceiver}?subject=${subject}&body=Hello, my name ${name},My phone Number ${phone}, ${subject}, ${message}`
     
  a.click()

  let dataObject = {
      name: name,
      email: email,
      phone:phone,
      subject:subject,
      message: message,
  }

  console.table(dataObject)
}