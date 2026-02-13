const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const backend_link = 'https://kogane-game.onrender.com';

async function loadProfile() {
    try {
        const res = await fetch(`${backend_link}/players/${id}`);
        const data = await res.json();

        renderProfile(data);
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

function renderProfile(profile) {
    const container = document.getElementById('profile');
    container.innerHTML = `<h1>${player.name}</h1>
        <p>Points: ${player.points}</p>
        <p>Status: ${player.status ? "Alive" : "Dead"}</p>
        <p>Grade: ${player.profiles?.grade || "N/A"}</p>
        <p>Achievements: ${JSON.stringify(player.profiles?.achievements || [])}</p>
    `;
}

loadProfile();