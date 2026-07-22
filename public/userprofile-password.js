//=====================================
// USER PROFILE PASSWORD
// PART 1
//=====================================


//========== ELEMENTS ==========//

const oldPassword =
document.getElementById("oldPassword");

const newPassword =
document.getElementById("newPassword");

const confirmNewPassword =
document.getElementById("confirmNewPassword");

const passwordValidation =
document.getElementById("passwordValidation");

const changePasswordBtn =
document.getElementById("changePasswordBtn");




let oldPasswordVerified = false;




//========== CHECK OLD PASSWORD ==========//

oldPassword.addEventListener(

    "blur",

    checkOldPassword

);




async function checkOldPassword(){

    if(!user) return;

    if(

        oldPassword.value.trim()===""

    ){

        resetPasswordFields();

        return;

    }

    passwordValidation.innerHTML=

    "Checking...";

    passwordValidation.style.color=

    "#666";

    try{

        const response=

        await fetch(

            "/users/check-password",

            {

                method:"POST",

                headers:{

                    "Content-Type":

                    "application/json"

                },

                body: JSON.stringify({

    user_id: user.user_id,

    password: oldPassword.value.trim()

})

            }

        );

        const data=

        await response.json();

        if(

            response.ok &&

            data.success

        ){

            oldPasswordVerified=true;

            passwordValidation.innerHTML=

            "✓ Password Correct";

            passwordValidation.style.color=

            "#009500";

            newPassword.disabled=false;
confirmNewPassword.disabled=false;

passwordValidation.innerHTML=
"✓ Password Correct";

passwordValidation.style.color=
"#009500";

changePasswordBtn.disabled=true;

        }

        else{

            oldPasswordVerified=false;

            passwordValidation.innerHTML=

            "✕ Wrong Password";

            passwordValidation.style.color=

            "#d80000";

            newPassword.disabled=true;

            confirmNewPassword.disabled=true;

            changePasswordBtn.disabled=true;

        }

    }

    catch(err){

        console.log(err);

        oldPasswordVerified=false;

        passwordValidation.innerHTML=

        "Unable to verify password.";

        passwordValidation.style.color=

        "#d80000";

        newPassword.disabled=true;

        confirmNewPassword.disabled=true;

        changePasswordBtn.disabled=true;

    }

}

//=====================================
// USER PROFILE PASSWORD
// PART 2 & 3
//=====================================


//========== VALIDATE NEW PASSWORDS ==========//

newPassword.addEventListener(
"input",
validateNewPasswords
);

confirmNewPassword.addEventListener(
"input",
validateNewPasswords
);

function validateNewPasswords(){

    if(!oldPasswordVerified){

        changePasswordBtn.disabled=true;
        return;

    }

    const newPass=
    newPassword.value.trim();

    const confirmPass=
    confirmNewPassword.value.trim();

    if(

        newPass.length<4

    ){

        passwordValidation.innerHTML=

        "Password must be at least 4 characters.";

        passwordValidation.style.color="#d80000";

        changePasswordBtn.disabled=true;

        return;

    }

    if(

        newPass!==confirmPass

    ){

        passwordValidation.innerHTML=

        "Passwords do not match.";

        passwordValidation.style.color="#d80000";

        changePasswordBtn.disabled=true;

        return;

    }

    passwordValidation.innerHTML=

    "✓ Ready to update";

    passwordValidation.style.color="#009500";

    changePasswordBtn.disabled=false;

}




//========== UPDATE PASSWORD ==========//

changePasswordBtn.onclick =

async function(){

    if(!oldPasswordVerified) return;

    changePasswordBtn.disabled=true;

    changePasswordBtn.innerHTML=

    "Updating...";

    try{

        const response=

        await fetch(

            "/users/password",

            {

                method:"PUT",

                headers:{

                    "Content-Type":

                    "application/json"

                },

                body:JSON.stringify({

                    user_id: user.user_id,

                    oldPassword: oldPassword.value.trim(),

                    newPassword: newPassword.value

                })

            }

        );

        const data=

        await response.json();

        if(

            !response.ok ||

            !data.success

        ){

            throw new Error(

                data.message ||

                "Unable to update password."

            );

        }

        user.password=

        newPassword.value;

        localStorage.setItem(

            "user",

            JSON.stringify(user)

        );

        changePasswordBtn.innerHTML=

        "✓ Updated";

        resetPasswordFields();

        setTimeout(()=>{

            changePasswordBtn.innerHTML=

            "Update Password";

        },2000);

    }

    catch(err){

        console.log(err);

        alert(err.message);

        changePasswordBtn.innerHTML=

        "Update Password";

    }

};


//========== RESET ==========//

function resetPasswordFields(){

    oldPasswordVerified=false;

    oldPassword.value="";

    newPassword.value="";

    confirmNewPassword.value="";

    newPassword.disabled=true;

    confirmNewPassword.disabled=true;

    changePasswordBtn.disabled=true;

    passwordValidation.innerHTML="";

}
