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
    container.innerHTML +=`<h2>Semester ${prevCourse}</h2>`;
    
    courses.forEach(course => {
        console.log(course.semester);
        if(prevCourse !== course.semester){
            container.innerHTML +=`<h2>Semester ${course.semester}</h2>`;
            prevCourse = course.semester;
        }
        container.innerHTML +=`<input type="button" id="${course.id}" value="${course.title}">`;
    });

}
loadContent();