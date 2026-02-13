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
                <p>${player.Fname} ${player.Lname}</p>
                <p>${player.points}</p>
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