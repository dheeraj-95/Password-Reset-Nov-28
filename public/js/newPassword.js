const form = document.getElementById('newPassword-form');
const submitbtn = document.getElementById('submitbtn');

function resetpassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const ConfirmPassword = document.getElementById('confirmPassword').value;
    submitbtn.innerHTML = 'Loading...'
    if (!email || !password || !ConfirmPassword) {
        custom_alert('warning', 'Please fill email field...')
        submitbtn.innerHTML = 'Reset Password'
    } else if (ConfirmPassword != password) {
        custom_alert('warning', "'Confirm Password' field must match 'Password' field ...")
        submitbtn.innerHTML = 'Reset Password'
    } else {
        UpdatePassword(email,password);
    }
}

async function UpdatePassword(email,password) {
    let data = {
        email: email,
        password: password
    }
    let datares = await fetch('https://password-reset-heroku.herokuapp.com/user/passwordreset', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await datares.json()
    custom_alert(res.type, res.message);
    if (res.type == 'success') {
        submitbtn.innerHTML = 'Password Successfully Updated..'
        submitbtn.disabled = true
        setTimeout(() => {
            window.location.href = "./index.html"
        }, 4500);

    }
    else {
        submitbtn.innerHTML = 'Try Again'
        setTimeout(() => {
            window.location.href = "./index.html"
        }, 4500);
    }

}