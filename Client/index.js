window.onload = function() {
  if(window.localStorage.getItem('user')) {
    window.location.assign('http://127.0.0.1:4500/account.html')

  }
}
 
 // Creating User Account

 const emailSignUp = document.querySelector('#email-sign-up');
 const passwordSignUp = document.querySelector('.password-sign-up');
 const confirmPass = document.querySelector('.con-password-sign-up');
 const firstName = document.querySelector('.first-name');
 const lastName = document.querySelector('.last-name');
const phoneNumber = document.querySelector('.phone-number');
const signUpSubmit = document.querySelector('.signUpBtn');
const accountForm = document.querySelector('.accountForm');
const accountContainer = document.querySelector('#account');

let passwordsMatch, passwordValidated;

// Checking that passwords match each other with immediate feedback to client


function matchPasswords () {
 if(passwordSignUp.value !== confirmPass.value) {
  confirmPass.classList.remove('match');
   confirmPass.classList.add('no-match');
   passwordsMatch = false;
 } else {
   confirmPass.classList.remove('no-match');
   confirmPass.classList.add('match');
   passwordsMatch = true;
 }
 
}



// Validating password with immediate feedback to client

function validatePassword () {
  let input = passwordSignUp.value
  const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,./{}|\":<>\[\]\\\' ~_]).{8,}/
  if(!re.test(input)){
    passwordSignUp.classList.remove('match');
    passwordSignUp.classList.add('no-match');
    passwordValidated = false
  }else {
    passwordSignUp.classList.remove('no-match');
   passwordSignUp.classList.add('match');
   passwordValidated = true
  }
}

passwordSignUp.addEventListener('keyup', matchPasswords);
passwordSignUp.addEventListener('keydown', matchPasswords);
passwordSignUp.addEventListener('keyup', validatePassword);
passwordSignUp.addEventListener('keydown', validatePassword);

confirmPass.addEventListener('keyup', validatePassword);
confirmPass.addEventListener('keydown', validatePassword);
confirmPass.addEventListener('keyup', matchPasswords);
confirmPass.addEventListener('keydown', matchPasswords);

function submitUser(e) {
e.preventDefault();

if(!passwordsMatch || !passwordValidated) {
  alert('Passwords Need to Match and/or Hit Min Requirements.');
  return;
}

let phone = phoneNumber.value;

phone = phone.replaceAll('-', "")
const newUser = {
  email: emailSignUp.value,
  password: confirmPass.value,
  fname: firstName.value,
  lname: lastName.value,
  phone: phone
}

axios
    .post('/api/users', newUser)
    .then(res => {
      while(accountContainer.firstChild) {
        accountContainer.removeChild(accountContainer.firstChild);
      }
      accountContainer.classList.add('small');
      accountContainer.innerHTML = `
      <h2>Account Succesfully Created!</h2>
      <div class="sign-up-wrapper">
      <a href="index.html#logIn"><button class="button small">Log In</button></a>
    </div>

      `
    })
    .catch(err => {
      alert('That email address already exists')
      return;
    })

    emailSignUp.value = ''
    passwordSignUp.value = ''
    confirmPass.value = ''
    firstName.value = ''
    lastName.value = ''
    phoneNumber.value = ''

    confirmPass.classList.remove('no-match')
    confirmPass.classList.remove('match');
    passwordSignUp.classList.remove('no-match')
    passwordSignUp.classList.remove('match')
}

accountForm.addEventListener('submit', submitUser);

// User Log-in 

const loginForm = document.querySelector('#logIn');
const emailLogIn = document.querySelector('#email-log-in');
const passLogIn = document.querySelector('#password-log-in');
const logInBtn = document.querySelector('#logInBtn');

function logIn (e) {
e.preventDefault();

let email = emailLogIn.value;
let password = passLogIn.value;

let user = {
  email: email,
  password: password
}

axios
    .post('/api/user', user)
    .then(res => {
      const { message } = res.data

      if(!isNaN(message)) {
      window.localStorage.setItem('user', message);
      window.location.href="account.html"
      } else {
        if (message === "Incorrect Password") {
          alert('Password does not match our system. Please try again with the correct password')

        } else if (message === "Incorrect Email") {
          alert(`That email address is not associated with an account.`)
        }
      }
      
      
    })
    .catch(err => console.log(err));
}

loginForm.addEventListener('submit', logIn);