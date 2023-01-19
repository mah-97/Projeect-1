const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const playerNames = document.querySelector('#player-search').value.split(",");
    if(!playerNames) {
       alert("Please enter a valid player name");
       return;
    }
    let playerInfo = document.querySelector('#player-info');
    playerInfo.innerHTML = "";
    playerNames.forEach(name => {

        fetch(`https://www.balldontlie.io/api/v1/players?search=${name}`)
        .then(response => response.json())
        .then(data => {
            if(data.meta.total_count === 0) {
              playerInfo.innerHTML += `<p>Player not found: ${name}</p>`;
              return;
            }
            const player = data.data[0];

            fetch(`https://www.balldontlie.io/api/v1/stats?seasons[]=2022&player_ids[]=${player.id}`)
            .then(response => response.json())
            .then(stats => {
                let team = "unknown";
                if(player.team && player.team.full_name) {
                  team = player.team.full_name;
                }
                let pts = 0;
                let reb = 0;
                let ast = 0;
                if(stats.data && stats.data.length > 0) {
                  stats.data.forEach(stat => {
                    pts += stat.pts;
                    reb += stat.reb;
                    ast += stat.ast;
                  });
                  pts = (pts / stats.data.length).toFixed(2);
                  reb = (reb / stats.data.length).toFixed(2);
                  ast = (ast / stats.data.length).toFixed(2);
                }
                playerInfo.innerHTML += `
                    <h2 class="change">${player.first_name} ${player.last_name}</h2>
                    <p class="change">Team: ${team}</p>
                    <p class="change">Points per game: ${pts}</p>
                    <p class="change">Rebounds per game: ${reb}</p>
                    <p class="change">Assists per game: ${ast}</p>
                `;
            })
            
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });
    });
});
