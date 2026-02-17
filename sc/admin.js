//------Login Section------
const loginBtn = document.getElementById('logInBtn');
const passwordInput = document.getElementById('password');
const confirmMsg = document.getElementById('confirm');

function revealAdminPanel() {
    document.getElementById('admin_panel').hidden = false;
    document.getElementById('sign_in').hidden = true;
}

window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) return;

    const res = await fetch('https://kogane-game.onrender.com/admin/verify', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await res.json();

    console.log(data.valid);

    if (res.ok) {
        revealAdminPanel();
    } else {
        localStorage.removeItem('token');
    }
});

loginBtn.addEventListener('click', async () => {
    try {
        confirmMsg.textContent = 'Loading...';
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
//------Management Section------

const playersContainer = document.getElementById('players');
const playersBtn = document.getElementById('view_players');

playersBtn.addEventListener('click', () => {
    console.log('Pressed');
    if (document.getElementById('plrDiv').hidden === true) {
        fetchPlayers();
        document.getElementById('plrDiv').hidden = false;
        document.getElementById('rulesDiv').hidden = true;
    } else {
        document.getElementById('plrDiv').hidden = true;
    }
});

async function fetchPlayers() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('https://kogane-game.onrender.com/players')
        const data = await res.json();
        playersContainer.innerHTML = '';
        data.forEach(plr => {
            const li = document.createElement('li');
            li.textContent = `${plr.id} - ${plr.Fname} ${plr.Lname}`;
            playersContainer.appendChild(li);
            const delBtn = document.createElement('button');
            delBtn.style.marginLeft = '10px';
            delBtn.textContent = 'Delete';
            delBtn.addEventListener('click', async () => {
                if (!confirm(`Are you sure you want to delete player ${plr.Fname} ${plr.Lname}? This action cannot be undone.`)) return;
                try {
                    const delRes = await fetch('https://kogane-game.onrender.com/admin/delete_player', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ playerId: plr.id })
                    });
                    if (!delRes.ok) {
                        alert('An error occurred while deleting the player.');
                        return console.error('Failed to delete player:', await delRes.json().error);
                    }
                    alert(`Player ${plr.Fname} ${plr.Lname} has been deleted.`);
                } catch (err) {
                    console.error('Error deleting player:', err);
                    alert('An error occurred while deleting the player.');
                }
                fetchPlayers();
            });
            li.appendChild(delBtn);
        });
    } catch (err) {
        console.error('Error fetching players:', err);
    }
}