const backend_link = 'https://kogane-game.onrender.com';

const players = document.getElementById("plrs");

async function getPlayers() {
    try {
        const container = players;
        container.innerHTML = '<p>Loading...</p>';
        const timer_id = setTimeout(() => {
            container.innerHTML = '<p>Loading...<br><br>Geez this is taking a while...<br>The server is probably starting up, just give it a moment.</p>';
        }, 10000);
        const res = await fetch(`${backend_link}/players`);
        const data = await res.json();
        clearTimeout(timer_id);
        container.innerHTML = '';

        data.forEach(player => {
            const player_div = document.createElement('div');
            player_div.classList.add('player');
            const ruleCount = player.rules?.[0]?.count || 0;
            player_div.innerHTML = `
                <div class="plr-wrapper">
                    <img src="${player.status ? 'assets/Alive.png' : 'assets/Dead.png'}" alt=${player.status ? 'Alive' : 'Dead'} class='status_img' />
                    <div class="player-info">
                        <div class="top-row">
                            <span>${player.Fname}</span>
                            <span>Points: ${player.points} pts</span>
                            <span>Rules: ${ruleCount}</span>
                        </div>
                        <div class="bottom-row">
                            <span>${player.Lname}</span>
                            <span>City: ${player.city ? player.city : ''}</span>
                        </div>
                    </div>
                </div>
            `;

            player_div.style.cursor = "pointer";
            
            player_div.addEventListener("click", () => {
                window.location.href = `profile.html?id=${player.id}`;
            });
            if (!player.status) {
                player_div.classList.add('dead');
            }
            container.appendChild(player_div);
        })
    } catch (error) {
        console.error('Error fetching players:', error);
    }
}

getPlayers();

const settings_icon = document.getElementById('setting_btn');
const settings = document.getElementById('settings');

settings_icon.addEventListener('click', () => {
    settings.hidden = !settings.hidden;
});