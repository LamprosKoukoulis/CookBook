async function loadUser(){

    const response =await fetch(
            "/auth/me",
            {
                credentials:"include"
            }
        );

    if(!response.ok){
        window.location.href = "/login.html";
        return;
    }


        const user = await response.json();
        // console.log("USER FROM API:", user);
        // document.getElementById("authButtons").style.display = "none";
        
        // document.getElementById("userArea").style.display = "block";
        
        document.getElementById("privateContent").style.display = "block";
        
        document.getElementById("welcomeText")
        .textContent =`Welcome ${user.full_name}`;

}

loadUser();

async function loadHallOfFame() {

    const response =
        await fetch(
            "/stats/hall-of-fame",
            {
                credentials: "include"
            }
        );

    if (!response.ok) return;

    const users =
        await response.json();

    const container =
        document.getElementById(
            "hallOfFame"
        );

    container.innerHTML = "";

    users.forEach((user,index)=>{

        container.innerHTML += `
            <div class="leaderboard-row">
                <span>
                    ${index+1}. ${user.full_name}
                </span>

                <span>
                    ${Math.floor(user.total_time/60)} mins
                </span>
            </div>
        `;
    });
}

loadHallOfFame();