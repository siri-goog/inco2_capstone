//Function: check required field
function checkRequired(input, alert) {
    
    var result = true

    if (input.value === "") {
        //console.log("Please enter " + input.id + ".")
        if(input.id == "pswRepeat"){
            alert.innerHTML = "Please enter repeat password" 
        }else{
            console.log(input.id)
            alert.innerHTML = "Please enter " + input.id + "."
        }
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

//Function: validate password 
function validatePassword(password, passwordAlert) {
    var result = true
    
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (passwordRegex.test(password.value)) {

        passwordAlert.innerHTML = ""
        
    }else {
        console.log(password.value)
        passwordAlert.innerHTML = "Please enter a valid password."
        password.focus()
        result = false;
    }

    return result
}

function validate() {
    
    var finalResult = true

    var userName = document.getElementById("username")
    var email = document.getElementById("email")
    var password = document.getElementById("password")
    var pswRepeat = document.getElementById("pswRepeat")

    var usernameMsg = document.getElementById("usernameMsg")
    var pswMsg = document.getElementById("pswMsg")
    var pswRepeatMsg = document.getElementById("pswRepeatMsg")
    var emailMsg = document.getElementById("emailMsg")

    //check required fields
    
    if (checkRequired(userName, usernameMsg) === false) {
       
        finalResult = false
    }
     if (checkRequired(email, emailMsg) === false) {
        finalResult = false

    }  else if (validateEmail(email, emailMsg) === false) {
        finalResult = false
    }
    if (checkRequired(password, pswMsg) === false) {
        finalResult = false
    } else if (validatePassword(password, pswMsg) === false) {
        finalResult = false
    }
    if (checkRequired(pswRepeat, pswRepeatMsg) === false) {
        finalResult = false
    } 
    if (password.value !== pswRepeat.value) {
        pswRepeatMsg.innerHTML = "Password doesn't match"
        pswRepeat.focus()
        finalResult = false
    }   
}

document.addEventListener("DOMContentLoaded", () => {
    const registerBtn = document.getElementById("signupBtn")
    registerBtn.onclick = (event) => {
        validate()
    }
})
