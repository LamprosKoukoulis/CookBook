document.getElementById("registerForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const body = {
        full_name:
            document.getElementById("full_name").value,

        email:
            document.getElementById("email").value,

        password:
            document.getElementById("password").value,

        semester:
            document.getElementById("semester").value
    };

    const response = await fetch(
        "/auth/register",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(body)
        }
    );

    const data = await response.json();

    if(response.ok){
        alert("Registration successful");
        window.location.href =
            "/login.html";
    }
    else{
        alert(data.error);
    }
});