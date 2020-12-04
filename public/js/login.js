const form = document.getElementById('login-form');
const loginbtn = document.getElementById('loginbtn');


function login() {
    loginbtn.innerHTML = "loading..."
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (!email || !password) {
        custom_alert('warning', 'Please Fill all the Fields...')
        loginbtn.innerHTML = 'Try again'
    } else {
        CheckCredentials(email, password)
    }
}

async function CheckCredentials(email, password) {
    let data = {
        email: email,
        password: password
    }
    const datares = await fetch('https://password-reset-heroku.herokuapp.com/user/signin', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await datares.json();
    if (res.type == 'success') {
        loginbtn.innerHTML = 'login successful...';
        setTimeout(() => {
            window.location.href = `./home.html`;
            form.reset()
        }, 2000);
    } else {
        custom_alert("error", res.error);
        loginbtn.innerHTML = 'Try Again'
    }
}