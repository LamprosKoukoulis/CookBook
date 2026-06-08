const params = new URLSearchParams(window.location.search);
const courseId = params.get("course_id");

async function loadModules(){
    var res = await fetch(
        `/courses?course_id=${courseId}`,
        {credentials:"include"

        }
    );

    if(!res.ok) return;

    const course = await res.json();
    const ccontainer = document.getElementById("courseContainer");

    ccontainer.innerHTML = "";
    ccontainer.innerHTML +=`
    <div class="course-card">
        <h3>${course.title}</h3>
        <span class="course-content">${course.description}</span>
    </div><br>`;
    
    res = await fetch(`/modules?course_id=${courseId}`, {
        credentials: "include"
    });
    
    if(!res.ok) return;

    const modules = await res.json();
    const mcontainer = document.getElementById("modulesContainer");

    mcontainer.innerHTML = "";

    for(const module of modules){
        
        const statsRes = await fetch(`/stats/module?module_id=${module.id}`,{
            credentials:"include"
        });

        let stats ={
            completion_percent : 0,
            last_score: null
        }

        if(statsRes.ok){
            stats = await statsRes.json();
        }
        mcontainer.innerHTML +=`
        <div class="module-card">
            <h3>${module.title}</h3>
            <span class="module-content">${module.content}</span><br>
                            <div class="progress-wrapper">
                    <div class="progress-bar">
                        <div class="progress-fill"
                             style="width:${stats.completion_percent}%">
                        </div>
                    </div>

                    <small>${stats.completion_percent}% completed</small>
                </div>

                <div class="module-meta">
                    <span>Last score: ${
                        stats.last_score !== null
                        ? stats.last_score + "/10"
                        : "No attempts yet"
                    }</span><br>
            <button
                class="module-btn"
                value="${module.id}">
                Open Quiz
            </button>
            </div>`
    };

    document.querySelectorAll(".module-btn").forEach(btn =>{
        btn.addEventListener("click",() =>{
            const moduleId = btn.value;

            window.location.href = `/quiz.html?module_id=${moduleId}`;
        });
    });
}

loadModules();