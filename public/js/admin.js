async function initAdmin() {
    await checkAdmin();

    await loadCourses();
    await loadModules();
    await loadQuizzes();

    setupForms();
}

initAdmin();


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


document.getElementById("questionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        quiz_id: document.getElementById("quiz_id").value,
        question: document.getElementById("question").value,
        type: document.getElementById("type").value,
        correct_answer: document.getElementById("correct_answer").value
    };

    const res = await fetch("/quiz/submit", {
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

async function createCourse(e) {
    e.preventDefault();

    const body = {
        title: document.getElementById("courseTitle").value,
        description: document.getElementById("courseDescription").value,
        category: document.getElementById("courseCategory").value
    };

    const res = await fetch("/courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Course created");
        await loadCourses();
    }
}

async function createCourse(e) {
    e.preventDefault();

    const body = {
        title: document.getElementById("courseTitle").value,
        description: document.getElementById("courseDescription").value,
        category: document.getElementById("courseCategory").value
    };

    const res = await fetch("/courses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Course created");
        await loadCourses();
    }
}

async function loadCourses() {

    const res = await fetch("/courses", {
        credentials: "include"
    });

    if (!res.ok) return;

    const courses = await res.json();

    const selects = [
        document.getElementById("moduleCourse"),
        document.getElementById("quizCourse"),
        document.getElementById("questionCourse")
    ];

    selects.forEach(select => {

        if (!select) return;

        select.innerHTML =
            `<option value="">Select Course</option>`;

        courses.forEach(course => {

            select.innerHTML += `
                <option value="${course.id}">
                    ${course.title}
                </option>
            `;
        });
    });
}

async function createModule(e) {
    e.preventDefault();

    const body = {
        course_id:
            document.getElementById("moduleCourse").value,

        title:
            document.getElementById("moduleTitle").value,

        content:
            document.getElementById("moduleContent").value,

        difficulty:
            document.getElementById("moduleDifficulty").value
    };

    const res = await fetch("/modules", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Module created");
        await loadModules();
    }
}

async function loadModules(courseId = null) {

    let url = "/modules";

    if (courseId) {
        url = `/modules/course/${courseId}`;
    }

    const res = await fetch(url, {
        credentials: "include"
    });

    if (!res.ok) return;

    const modules = await res.json();

    const selects = [
        document.getElementById("quizModule"),
        document.getElementById("questionModule")
    ];

    selects.forEach(select => {

        if (!select) return;

        select.innerHTML =
            `<option value="">Select Module</option>`;

        modules.forEach(module => {

            select.innerHTML += `
                <option value="${module.id}">
                    ${module.title}
                </option>
            `;
        });
    });
}

async function createQuiz(e) {
    e.preventDefault();

    const body = {
        module_id:
            document.getElementById("quizModule").value,

        title:
            document.getElementById("quizTitle").value
    };

    const res = await fetch("/quiz/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Quiz created");
        await loadQuizzes();
    }
}

async function loadQuizzes(moduleId = null) {

    let url = "/quiz";

    if (moduleId) {
        url = `/quiz/:${moduleId}`;
    }

    const res = await fetch(url, {
        credentials: "include"
    });

    if (!res.ok) return;

    const quizzes = await res.json();

    const select =
        document.getElementById("questionQuiz");

    if (!select) return;

    select.innerHTML =
        `<option value="">Select Quiz</option>`;

    quizzes.forEach(quiz => {

        select.innerHTML += `
            <option value="${quiz.id}">
                ${quiz.title}
            </option>
        `;
    });
}