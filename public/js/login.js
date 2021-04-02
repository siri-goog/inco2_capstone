//Function: check required field
function checkRequired(input, alert) {
    
    var result = true

    if (input.value === "") {
        alert.innerHTML = "Please enter " + input.id + "."
        input.focus()
        result = false;
    } else {
        alert.innerHTML = ""
    }

    return result
}

//Function: validate email
function validateEmail(email, emailAlert) {
    
    var result = true
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRegex.test(email.value.toLowerCase())) {

        emailAlert.innerHTML = ""
        
    }else {
        console.log("Please enter a valid e-mail address.")
        emailAlert.innerHTML = "Please enter a valid e-mail address."
        email.focus()
        result = false;
    }

    return result
}

function validate() {
    
    var finalResult = true

    
    var email = document.getElementById("email")
    var emailMsg = document.getElementById("emailMsg")
    var password = document.getElementById("password")
    var passwordMsg = document.getElementById("passwordMsg")

    //check email
    if (checkRequired(email, emailMsg) === false) {
        finalResult = false
    }  else if (validateEmail(email, emailMsg) === false) {
        finalResult = false
    }
    //check password
    if (checkRequired(password, passwordMsg) === false) {
        finalResult = false
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("loginBtn")
    loginBtn.onclick = (event) => {
        validate()
    }
})
