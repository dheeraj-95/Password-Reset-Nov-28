checklogin();

async function checklogin() {
    let response = await fetch('https://password-reset-heroku.herokuapp.com/user/checklogin', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await response.json()
    console.log(res);
    custom_alert(res.type, res.message);
    if (res.type != 'success') {
        setTimeout(() => {
            window.location.href = "./index.html"
        }, 3000);
    }else{
        console.log(document.getElementById('welcome-user'));
        document.getElementById('welcome-user').innerHTML=`
            <h1 id="username" class="text-center">Welcome ${res.user.split('@')[0]}</h1>`
    }
}


async function logout() {
    let response = await fetch('https://password-reset-heroku.herokuapp.com/user/logout', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const res = await response.json()
    custom_alert(res.type,res.message);
    setTimeout(() => {
        window.location.href = "./index.html"
    }, 3000);
}