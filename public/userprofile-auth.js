//========================================
// USER PROFILE AUTH
// PART 1
//========================================

//========== GLOBALS ==========//

let user = null;


//========== ELEMENTS ==========//

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const customerProfile = document.getElementById("customerProfile");

const customerContact =
document.getElementById("customerContact");

const loginContact = document.getElementById("loginContact");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const registerName = document.getElementById("registerName");
const registerContact = document.getElementById("registerContact");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword =
document.getElementById("registerConfirmPassword");

const registerBtn = document.getElementById("registerBtn");
const registerError = document.getElementById("registerError");

const showRegister =
document.getElementById("showRegister");

const showLogin =
document.getElementById("showLogin");

const logoutBtn =
document.getElementById("logoutBtn");



//========== PAGE LOAD ==========//

window.addEventListener("load", async()=>{

    const savedUser =
    localStorage.getItem("user");

    if(savedUser){

        user = JSON.parse(savedUser);

        await loadUser();

    }

    else{

        showLoginPage();

    }

});



//========== SHOW LOGIN ==========//

function showLoginPage(){

    loginSection.style.display="block";
    registerSection.style.display="none";
    customerProfile.style.display="none";

}



//========== SHOW REGISTER ==========//

function showRegisterPage(){

    loginSection.style.display="none";
    registerSection.style.display="block";
    customerProfile.style.display="none";

}



//========== SWITCH PAGES ==========//

showRegister.onclick=()=>{

    showRegisterPage();

};

showLogin.onclick=()=>{

    showLoginPage();

};



//========== CONTACT VALIDATION ==========//

function validContact(contact){

    return /^\+[1-9]\d{7,14}$/.test(contact);

}



//========== REGISTER ==========//

registerBtn.onclick = async()=>{

    registerError.innerHTML="";

    let name =
    registerName.value.trim();

    let contact =
    registerContact.value.trim();

    let password =
    registerPassword.value;

    let confirm =
    registerConfirmPassword.value;

    if(

        !name ||

        !contact ||

        !password ||

        !confirm

    ){

        registerError.innerHTML=
        "Please fill all fields.";

        return;

    }

    if(

        !validContact(contact)

    ){

        registerError.innerHTML=
        "Enter a valid contact number with country code.";

        return;

    }

    if(

        password!==confirm

    ){

        registerError.innerHTML=
        "Passwords do not match.";

        return;

    }

    registerBtn.disabled=true;

    registerBtn.innerHTML=
    "Registering...";

    try{

        const response =
        await fetch(

            "/users/register",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:JSON.stringify({

                    name,
                    contact,
                    password

                })

            }

        );

        const data =
        await response.json();

        if(data.success){

            registerBtn.innerHTML=
            "Registered";

            registerError.style.color=
            "#009500";

            registerError.innerHTML=
            "Registration successful.";

            registerName.value="";
            registerContact.value="";
            registerPassword.value="";
            registerConfirmPassword.value="";

            setTimeout(()=>{

                registerBtn.innerHTML=
                "Register";

                registerBtn.disabled=false;

                registerError.innerHTML="";
                registerError.style.color="#d80000";

                showLoginPage();

            },1000);

        }

        else{

            registerBtn.disabled=false;

            registerBtn.innerHTML=
            "Register";

            registerError.innerHTML=
            data.message;

        }

    }

    catch(err){

        console.log(err);

        registerBtn.disabled=false;

        registerBtn.innerHTML=
        "Register";

        registerError.innerHTML=
        "Unable to connect.";

    }

};

//========================================
// USER PROFILE AUTH
// PART 2
//========================================


//========== LOGIN ==========//

loginBtn.onclick = async()=>{

    loginError.innerHTML="";

    const contact=
    loginContact.value.trim();

    const password=
    loginPassword.value;

    if(!contact || !password){

        loginError.innerHTML=
        "Enter contact number and password.";

        return;

    }

    loginBtn.disabled=true;
    loginBtn.innerHTML="Logging in...";

    try{

        const response=await fetch(

            "/users/login",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    contact,
                    password

                })

            }

        );

        const data=
        await response.json();

        if(!data.success){

            loginBtn.disabled=false;
            loginBtn.innerHTML="Login";

            loginError.innerHTML=
            data.message;

            return;

        }

        user=data.user;

        localStorage.setItem(

            "user",

            JSON.stringify(user)

        );

        loginContact.value="";
        loginPassword.value="";

        await loadUser();

    }

    catch(err){

        console.log(err);

        loginBtn.disabled=false;

        loginBtn.innerHTML="Login";

        loginError.innerHTML=
        "Unable to connect.";

    }

};




//========== LOAD USER ==========//

async function loadUser(){

    try{

        const response=await fetch(

            "/users/"+user.user_id

        );

        const data=
        await response.json();

        if(!data.success){

            logout();

            return;

        }

        user=data.user;

        localStorage.setItem(

            "user",

            JSON.stringify(user)

        );

        showProfile();

    }

    catch(err){

        console.log(err);

    }

}




//========== SHOW PROFILE ==========//

function showProfile(){

    loginSection.style.display="none";

    registerSection.style.display="none";

    customerProfile.style.display="block";

    loginBtn.disabled=false;
    loginBtn.innerHTML="Login";



   document.getElementById(
    "customerName"
).value =
user.name || "";



    document.getElementById(

        "customerContact"

    ).innerHTML=

    user.contact || "";

    currentCoordinates = user.coordinates || currentCoordinates;
showCoordinates();
loadAddresses();



   document.getElementById(
    "customerEmail"
).value =
user.email || "";



    if(

        user.coordinates

    ){

        document.getElementById(

            "customerCoordinates"

        ).innerHTML=

        user.coordinates.latitude+

        ", "+

        user.coordinates.longitude;

    }

    else{

        document.getElementById(

            "customerCoordinates"

        ).innerHTML=

        "Not Available";

    }



    if(

        user.profile_image

    ){

        profileImage.src=

        user.profile_image;

        profileImage.style.display="block";

        profilePlus.style.display="none";

    }

    else{

        profileImage.style.display="none";

        profilePlus.style.display="flex";

    }



    if(

        typeof loadAddresses==="function"

    ){

        loadAddresses();

    }

}

//========== LOGOUT ==========//

function logout(){

    localStorage.removeItem(

        "user"

    );

    user=null;

    customerProfile.style.display="none";

    registerSection.style.display="none";

    loginSection.style.display="block";

}



logoutBtn.onclick=async()=>{

    try{

        await fetch(

            "/users/logout",

            {

                method:"POST"

            }

        );

    }

    catch(err){}

    logout();

};


//========== REFRESH USER ==========//

async function refreshUser(){

    if(!user)return;

    await loadUser();

}
