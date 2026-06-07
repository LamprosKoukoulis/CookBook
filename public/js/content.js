async function loadContent(){
    const container = document.getElementById("privateContent");

    const res = await fetch("/courses/", {
        credentials: "include"
    }).catch(err => {
        console.log("FETCH FAILED:", err);
        return null;
    
    });
    if(!res.ok) return;
    
    courses = await res.json();
    courses.forEach(course => {
        console.log(res.user.semester);
        
        container.innerHTML +=`<input type="button" id="${course.id}" value="${course.title}">`;
    });

}
loadContent();