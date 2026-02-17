const loginBtn = document.getElementById('logInBtn');
const passwordInput = document.getElementById('password');
const confirmMsg = document.getElementById('confirm');

function revealAdminPanel() {
    document.getElementById('admin_panel').hidden = false;
    document.getElementById('sign_in').hidden = true;
}

loginBtn.addEventListener('click', async () => {
    try {
        const password = passwordInput.value;

        if (!password) {
            confirmMsg.textContent = 'Please enter a password.';
            return;
        }

        const res = await fetch('https://kogane-game.onrender.com/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
        });
        
        const data = await res.json();

        if (res.status === 401) {
            confirmMsg.textContent = 'Invalid password.';
            return;
        }

        if (res.status == 429) {
            confirmMsg.textContent = 'Too many attempts. Please try again later.';
            return;
        }

        localStorage.setItem('token', data.token);
        revealAdminPanel();
    } catch (err) {
        console.error('Error during login:', err);
        confirmMsg.textContent = 'An error occurred. Please try again later.';
    }
});