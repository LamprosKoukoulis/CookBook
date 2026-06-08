async function loadContent(){
    const container = document.getElementById("privateContent");

    const res = await fetch(`/courses/semester`, {
        credentials: "include"
    }).catch(err => {
        console.log("FETCH FAILED:", err);
        return null;
    
    });
    if(!res.ok) {
        console.log("[content] fetch failed");
        
        return;
    }
    courses = await res.json();

    prevCourse = courses[0].semester;
    container.innerHTML +=`<h3>Semester ${prevCourse}</h3>`;
    
    courses.forEach(course => {
        console.log(course.semester);
        if(prevCourse !== course.semester){
            container.innerHTML +=`<h3>Semester ${course.semester}</h3>`;
            prevCourse = course.semester;
        }
        container.innerHTML +=`<button class="course-btn" data-course-id="${course.id}">${course.title}</button>`;
    });


    document.querySelectorAll(".course-btn").forEach(btn =>{
        btn.addEventListener("click",() =>{
            const courseId = btn.dataset.courseId;

            window.location.href =`/course.html?course_id=${courseId}`;
        });
    });

}
loadContent();