const form = document.getElementById('reset-form');
const submitbtn = document.getElementById('submitbtn');

function resetPassword() {
    const email = document.getElementById('email').value;
    submitbtn.innerHTML ='Loading...'
    if (!email) {
        custom_alert('warning', 'Please fill email field...')
        submitbtn.innerHTML ='Send Verification'
    } else {
        sendVerification(email)
    }
}

async function sendVerification(email) {
    let data = {
        email: email
    }
    let datares = await fetch('https://password-reset-heroku.herokuapp.com/user/reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await datares.json()
    custom_alert(res.type, res.message);
    if(res.type == 'success'){
        submitbtn.innerHTML ='Check your Inbox..'
        submitbtn.disabled = true
        setTimeout(() => {
            window.location.href = "./newPassword.html"
        }, 4500);
    }
    else{
        submitbtn.innerHTML ='Send Verification'
    }
    
}