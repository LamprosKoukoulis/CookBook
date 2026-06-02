async function loadHeader() {
    
    const container = document.getElementById("header-container");
    
    const res = await fetch("./components/header.html");
    const html = await res.text();
    
    container.innerHTML = html;
    document.getElementById("logo").addEventListener("click", () => {window.location.href = "/dashboard.html";});
    
    const navGuest = document.getElementById("nav-guest");
    const navUser = document.getElementById("nav-user");
    const navAdmin = document.getElementById("nav-admin");

    const userRes = await fetch("/auth/me", {
        credentials: "include"
    }).catch(() => null);

    //IF NOT LOGGED IN
    if (!userRes || !userRes.ok) {

        navGuest.style.display = "block";
        navUser.style.display = "none";
        navAdmin.style.display = "none";

        return;
    }

    const user = await userRes.json();

    // LOGGED IN: hide guest buttons
    navGuest.style.display = "none";

    if (user.role === "admin") {

        navAdmin.style.display = "block";

        document.getElementById("adminText").textContent =
            `Admin: ${user.full_name}`;

    } else {

        navUser.style.display = "block";

        document.getElementById("welcomeText").textContent =
            `Welcome ${user.full_name}`;
    }

    // logout shared logic
    const logout = async () => {
        await fetch("/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        location.href = "/login.html";
    };
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    document.getElementById("logoutBtnAdmin")?.addEventListener("click", logout);

}

loadHeader();