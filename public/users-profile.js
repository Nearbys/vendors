//=============================
// ELEMENTS
//=============================

const loginSection=document.getElementById("loginSection");
const registerSection=document.getElementById("registerSection");
const customerProfile=document.getElementById("customerProfile");

const loginContact=document.getElementById("loginContact");
const loginPassword=document.getElementById("loginPassword");
const loginBtn=document.getElementById("loginBtn");
const loginError=document.getElementById("loginError");

const registerName=document.getElementById("registerName");
const registerContact=document.getElementById("registerContact");
const registerPassword=document.getElementById("registerPassword");
const registerConfirmPassword=document.getElementById("registerConfirmPassword");
const registerBtn=document.getElementById("registerBtn");
const registerError=document.getElementById("registerError");

const showRegister=document.getElementById("showRegister");
const showLogin=document.getElementById("showLogin");

let user=null;


//=============================
// PAGE LOAD
//=============================

window.addEventListener("load",()=>{

    const savedUser=localStorage.getItem("user");

    if(savedUser){

        user=JSON.parse(savedUser);

        showProfile();

    }

});


//=============================
// SWITCH LOGIN / REGISTER
//=============================

showRegister.onclick=()=>{

    loginSection.style.display="none";
    registerSection.style.display="block";

};

showLogin.onclick=()=>{

    registerSection.style.display="none";
    loginSection.style.display="block";

};


//=============================
// CONTACT VALIDATION
//=============================

function validContact(contact){

    return /^\+[1-9]\d{7,14}$/.test(contact);

}


//=============================
// REGISTER
//=============================

registerBtn.onclick=async()=>{

    registerError.innerText="";

    let name=registerName.value.trim();
    let contact=registerContact.value.trim();
    let password=registerPassword.value;
    let confirm=registerConfirmPassword.value;

    if(!name || !contact || !password || !confirm){

        registerError.innerText="Please fill all fields.";

        return;

    }

    if(!validContact(contact)){

        registerError.innerText="Enter contact with country code.";

        return;

    }

    if(password!==confirm){

        registerError.innerText="Passwords do not match.";

        return;

    }

    registerBtn.disabled=true;
    registerBtn.innerText="Registering...";

    try{

        const response=await fetch("/users/register",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                name,
                contact,
                password

            })

        });

        const data=await response.json();

        if(data.success){

            registerBtn.innerText="Registered";

            registerError.style.color="#009500";
            registerError.innerText="Registration successful.";

            registerName.value="";
            registerContact.value="";
            registerPassword.value="";
            registerConfirmPassword.value="";

            setTimeout(()=>{

                registerSection.style.display="none";
                loginSection.style.display="block";

                registerBtn.innerText="Register";
                registerBtn.disabled=false;
                registerError.innerText="";
                registerError.style.color="#d80000";

            },1200);

        }

        else{

            registerBtn.disabled=false;
            registerBtn.innerText="Register";

            registerError.innerText=data.message;

        }

    }

    catch(err){

        registerBtn.disabled=false;
        registerBtn.innerText="Register";

        registerError.innerText="Unable to connect.";

    }

};


//=============================
// LOGIN
//=============================

loginBtn.onclick=async()=>{

    loginError.innerText="";

    let contact=loginContact.value.trim();
    let password=loginPassword.value;

    if(!contact || !password){

        loginError.innerText="Enter contact number and password.";

        return;

    }

    loginBtn.disabled=true;
    loginBtn.innerText="Logging in...";

    try{

        const response=await fetch("/users/login",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                contact,
                password

            })

        });

        const data=await response.json();

        if(data.success){

            user=data.user;

            localStorage.setItem(

                "user",

                JSON.stringify(user)

            );

            loginBtn.innerText="Logged In";

            showProfile();

        }

        else{

            loginBtn.disabled=false;
            loginBtn.innerText="Login";

            loginError.innerText=data.message;

        }

    }

    catch(err){

        loginBtn.disabled=false;
        loginBtn.innerText="Login";

        loginError.innerText="Unable to connect.";

    }

};


//=============================
// SHOW PROFILE
//=============================

function showProfile(){

    loginSection.style.display="none";
    registerSection.style.display="none";
    customerProfile.style.display="block";

    document.getElementById("customerName").innerText=user.name;

    document.getElementById("customerContact").innerText=user.contact;

    if(user.email){

        document.getElementById("customerEmail").innerText=user.email;

    }

    if(user.profile_image){

        document.getElementById("profileImage").src=user.profile_image;
        document.getElementById("profileImage").style.display="block";
        document.getElementById("profilePlus").style.display="none";

    }

}
