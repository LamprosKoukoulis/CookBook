let cachedUser =null;
export async function getMe(){
    if(cachedUser){
        return cachedUser;
    }
    const res = await fetch("/auth/me", {
        credentials: "include"
    }).catch(err => {
        console.log("FETCH FAILED:", err);
        return null;
    });

    if(!res || !res.ok){
        dropUser();
        return null;
    }

    cachedUser = await res.json();
    // localStorage.setItem("me", JSON.stringify(cachedUser));
    return cachedUser;
}

export function dropUser(){
    cachedUser = null;
}