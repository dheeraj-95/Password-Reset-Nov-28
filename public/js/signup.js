const form = document.getElementById('signup-form');

function signup() {
    const signupbtn = document.getElementById('signupbtn')
    signupbtn.innerHTML = 'Loading...'
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmpassword = document.getElementById('confirmPassword').value
    if (!email || !password || !confirmpassword) {
        custom_alert('warning', 'Please Fill all the Fields...')
        signupbtn.innerHTML = 'Try Again..'
    } else if (password !== confirmpassword) {
        custom_alert('warning', "'Confirm Password' field must match 'Password' field ...")
        signupbtn.innerHTML = 'Try Again..'
    } else {
        registerUser(email,password)
    }
}

async function registerUser(email,password) {
    let data = {
        email: email,
        password: password
    }
    let datares = await fetch('https://password-reset-heroku.herokuapp.com/user/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await datares.json()
    custom_alert(res.type, res.message);
    if (res.type == 'success') {
        signupbtn.innerHTML = 'Signup Successful'
        setTimeout(() => {
            window.location.href = "./index.html"
            form.reset()
        }, 3000);
    }else{
        signupbtn.innerHTML = 'Try Again..'
    }
}