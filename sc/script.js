const backend_link = 'https://kogane-game.onrender.com';

const players = document.getElementById("plrs");

async function getPlayers() {
    try {
        const res = await fetch(`${backend_link}/players`);
        const data = await res.json();
        console.log(data);
        const container = players;
        container.innerHTML = '';

        data.forEach(player => {
            const player_div = document.createElement('div');
            player_div.classList.add('player');

            player_div.innerHTML = `
                <img src="${player.status ? 'assets/Alive.png' : 'assets/Dead.png'}" alt='Status' class='status_img' />
                <div class="top-row">
                    <span>${player.Fname}</span>
                    <span>Points: ${player.points} pts</span>
                    <span>Rules: ${player.rules.count}</span>
                </div>
                <div class="bottom-row">
                    <span>${player.Lname}</span>
                    <span>City: ${player.city}</span>
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