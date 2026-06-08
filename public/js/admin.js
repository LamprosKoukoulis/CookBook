async function initAdmin() {
    await checkAdmin();

    await loadCourses();
    await loadModules("questionModule");
    await loadModules("quizModule");
    await loadQuizzes();

    setupForms();
}

initAdmin();

function setupForms() {

    document.getElementById("courseForm")?.addEventListener("submit", createCourse);

    document.getElementById("moduleForm")?.addEventListener("submit", createModule);

    document.getElementById("quizForm")?.addEventListener("submit", createQuiz);

    document.getElementById("questionForm")?.addEventListener("submit", createQuestion);

    document.getElementById("questionCourse")?.addEventListener("change",e =>{loadModules("questionModule",e.target.value)});
    
    document.getElementById("questionModule")?.addEventListener("change",e =>{loadQuizzes(e.target.value)});
    
    document.getElementById("quizCourse")?.addEventListener("change",e =>{loadModules("quizModule",e.target.value)});

    document.getElementById("questionType").addEventListener("change",updateQuestionTypeUI);
}

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

async function createCourse(e) {
    e.preventDefault();

    const body = {
        title: document.getElementById("courseTitle").value,
        description: document.getElementById("courseDescription").value,
        semester: Number(document.getElementById("courseCategory").value)
    };
    console.log("body: "+JSON.stringify(body));
    
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
            document.getElementById("moduleContent").value
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
        // await loadModules();
    }
}

async function loadModules(fieldId, courseId = null) {

    let url = "/courses";

    if (courseId) {
        url = `/courses?course_id=${courseId}`;
    }

    const res = await fetch(url, {
        credentials: "include"
    });

    if (!res.ok) return;

    const modules = await res.json();
    const select = document.getElementById(`${fieldId}`);

    if (!select) return;
    // const selects = [
    //     document.getElementById("quizModule"),
    //     document.getElementById("questionModule")
    // ];

    // selects.forEach(select => {

        
        select.innerHTML =
        `<option value="">Select Module</option>`;
        
        if (!courseId) return;
        modules.forEach(module => {

            select.innerHTML += `
                <option value="${module.id}">
                    ${module.title}
                </option>
            `;
        });
    // }
    // );
}

function updateQuestionTypeUI() {

    const type =
        document.getElementById("questionType").value;

    const optionInputs = [
        document.getElementById("option1"),
        document.getElementById("option2"),
        document.getElementById("option3"),
        document.getElementById("option4")
    ];

    const correctSelect =
        document.getElementById("correctOption");

    if (type === "true_false") {

        optionInputs.forEach(i => {
            i.style.display = "none";
        });

        correctSelect.innerHTML = `
            <option value="1">
                True
            </option>

            <option value="0">
                False
            </option>
        `;
    }
    else {

        optionInputs.forEach(i => {
            i.style.display = "block";
        });

        correctSelect.innerHTML = `
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
            <option value="4">Option 4</option>
        `;
    }
}

async function createQuiz(e) {
    e.preventDefault();
    
    const body = {
        module_id:  document.getElementById("quizModule").value,
        course_id:  document.getElementById("quizCourse").value,
        title:      document.getElementById("quizTitle").value
    };
    console.log("course:", document.getElementById("quizCourse").value);
    console.log("module:", document.getElementById("quizModule").value);
    console.log("title:", document.getElementById("quizTitle").value);
    const res = await fetch("/quiz", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Quiz created");
        // await loadQuizzes();
    }
}

async function loadQuizzes(moduleId = null) {

    let url = "/quiz";

    if (moduleId) {
        url = `/quiz?module_id=${moduleId}`;
    }

    const res = await fetch(url, {
        credentials: "include"
    });

    
    if (!res.ok) return;
    const quizzes = await res.json();

    const select = document.getElementById("questionQuiz");
        
    if (!select) return;
        
    select.innerHTML =`<option value="">Select Quiz</option>`;
    
    if(!moduleId) return;
    quizzes.forEach(quiz => {
        console.log("quizTitle: "+quiz.title);
        console.log("quizId: "+quiz.id);
        
        select.innerHTML += `
            <option value="${quiz.id}">
                ${quiz.title}
            </option>
        `;
    });
}

async function createQuestion(e) {
    e.preventDefault();

    const body = {
        quiz_id:
            document.getElementById("questionQuiz").value,

        question:
            document.getElementById("questionText").value,

        type:
            document.getElementById("questionType").value,

        options: [
            document.getElementById("option1").value,
            document.getElementById("option2").value,
            document.getElementById("option3").value,
            document.getElementById("option4").value
        ],

        correct_answer: document.getElementById("correctOption").value,

        difficulty:document.getElementById("moduleDifficulty").value
    };

    const res = await fetch("/questions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(body)
    });

    if (res.ok) {
        alert("Question created");
    }
}