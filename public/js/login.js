document.getElementById("loginForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if(response.ok){
        window.location.href =
            "/dashboard.html";
    }
    else{
        alert(data.error);
    }
});