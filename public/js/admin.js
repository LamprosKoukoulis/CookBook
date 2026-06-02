async function checkAdmin() {

    const res = await fetch("/auth/me", {
        credentials: "include"
    });

    if (!res.ok) {
        window.location.href = "/login.html";
        return;
    }

    const user = await res.json();

    if (user.role !== "admin") {
        alert("Access denied");
        window.location.href = "/";
    }
}

checkAdmin();

document
.getElementById("questionForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    const body = {
        quiz_id: document.getElementById("quiz_id").value,
        question: document.getElementById("question").value,
        type: document.getElementById("type").value,
        correct_answer: document.getElementById("correct_answer").value
    };

    const res = await fetch("/quiz/questions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Created!");
    } else {
        alert("Error");
    }
});