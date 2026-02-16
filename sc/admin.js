const loginBtn = document.getElementById('logInbtn');
const passwordInput = document.getElementById('password');

function revealAdminPanel() {
    document.getElementById('admin_panel').hidden = false;
    document.getElementById('sign_in').hidden = true;
}

loginBtn.addEventListener('click', async () => {
    const password = passwordInput.value;

    if (!password) {
        alert('Please enter a password.');
        return;
    }

    const res = await fetch('https://kogane-game.onrender.com/admin/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    });

    if (!res.ok) {
        alert('Login failed. Please check your password and try again.');
        return;
    }

    const data = await res.json();

    localStorage.setItem('token', data.token);
    revealAdminPanel();
});