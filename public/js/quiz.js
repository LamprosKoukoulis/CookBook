const params = new URLSearchParams(window.location.search);

const moduleId = params.get("module_id");
const quizId = params.get("quiz_id");

const quizState={
    quizId:null,
    answers :{}
}

if(moduleId){
    loadQuiz();
}else if(quizId){
    startQuiz();
}

//FUNCTIONS
async function loadQuiz(){
    const res = await fetch(`/quiz?module_id=${moduleId}`,{
        "credentials": "include"
    });

    if(!res.ok) return;

    const quizzes = await res.json();

    const container = document.getElementById("quizContainer");
    container.innerHTML = "";

    quizzes.forEach(quiz => {
        container.innerHTML+=`
        <div class="quiz-card">
            <h3>${quiz.title}</h3>
                <button class="start-quiz" value="${quiz.id}">
                    Start
                </button>
            </div>`;
    });

        document.querySelectorAll(".start-quiz").forEach(btn =>{
        btn.addEventListener("click",() =>{
            const quizId = btn.value;
            console.log("start quiz", quizId);
            console.log("start quiz");
            
            container.innerHTML ="";
            startQuiz(quizId);
        });
    });
}

async function startQuiz(quizId) {
    quizState.quizId = quizId;

    const res = await fetch(`/questions?quiz_id=${quizId}`, {
        credentials: "include"
    });

    if (!res.ok) return;

    var questions = await res.json();

    console.log(questions);
        questions = questions.slice(0, 10);

    renderQuiz(questions);
}

function renderQuiz(questions) {

    const container = document.getElementById("quizContainer");
    container.innerHTML = "";

    questions.forEach((q, index) => {

        container.innerHTML += `
            <div class="question-card" data-question-id="${q.id}">
                
                <h3>${index + 1}. ${q.question}</h3>

                ${renderQuestion(q)}

            </div>
        `;
    });
    container.innerHTML +=`<button id="submitQuiz" >Καταχώρηση Απαντήσεων</button>`;

    document.getElementById("submitQuiz").addEventListener("click",submitQuiz);
}

function renderQuestion(q) {

    // MULTIPLE CHOICE
    if (q.type === "multiple_choice") {
        return q.answers.map(a =>
            `
                <label>
                    <input type="radio"
                           name="q_${q.id}"
                           value="${a.id}"
                           onchange="selectAnswer('${q.id}','${a.id}')">
                    ${a.option_text}
                </label><br>
            `).join("");
    }

    // TRUE / FALSE
    if (q.type === "true_false") {

        return `
            <label>
                <input type="radio" name="q_${q.id}" value="1" onchange="selectAnswer('${q.id}','1')">
                True
            </label><br>

            <label>
                <input type="radio" name="q_${q.id}" value="0"onchange="selectAnswer('${q.id}','0')">
                False
            </label>
        `;
    }

    return `<p>Unknown question type</p>`;
}

function selectAnswer(questionId,answerId){
    quizState.answers[questionId]= answerId;
}

async function submitQuiz(){
    const answers =[];
    for(const questionId in quizState.answers){
        const answer = quizState.answers[questionId];
            answers.push({question_id: questionId,
            answer : answer
        });
    }

    data= {
        quizId  : quizState.quizId,
        answers :answers 
    };

    const res = await fetch("/quiz/submit",{
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        credentials:"include",
        body: JSON.stringify(data)
    });

    const result = await res.json();
    alert(`Score: ${result.score}/${result.total}`)
}
