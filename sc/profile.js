const params = new URLSearchParams(window.location.search);
const id = params.get('id');

const profile_container = document.getElementById('profile');
const heading = document.getElementById('Heading');

const backend_link = 'https://kogane-game.onrender.com';

async function loadProfile() {
    try {
        profile_container.innerHTML = 'Loading...';
        const res = await fetch(`${backend_link}/players/${id}`);
        const player = await res.json();
        console.log(player);
        heading.innerHTML = `${player.Fname} ${player.Lname}`;
        profile_container.innerHTML = `
            <p>Points: ${player.points}</p>
            <p>Status: ${player.status ? "Alive" : "Dead"}</p>
            <p>Grade: ${player.profiles?.grade || "N/A"}</p>
            <p>City: ${player.city || "N/A"}</p>
            <h3>Rules Created:</h3>
            <ul>
                ${player.rules?.map(rule => `<li>${rule.rule}</li>`).join('') || '<li>No rules created.</li>'}
            </ul>
        `;
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

loadProfile();