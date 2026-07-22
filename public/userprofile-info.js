//=====================================
// USER PROFILE INFO
// PART 1A
//=====================================


//========== ELEMENTS ==========//

const customerName =
document.getElementById("customerName");

const customerEmail =
document.getElementById("customerEmail");




//========== ENABLE NAME EDIT ==========//

customerName.addEventListener(

    "click",

    function(){

        customerName.removeAttribute(

            "readonly"

        );

        customerName.focus();

        customerName.select();

    }

);




//========== ENABLE EMAIL EDIT ==========//

customerEmail.addEventListener(

    "click",

    function(){

        customerEmail.removeAttribute(

            "readonly"

        );

        customerEmail.focus();

        customerEmail.select();

    }

);




//========== SAVE NAME ==========//

customerName.addEventListener(

    "blur",

    saveProfile

);

customerName.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            customerName.blur();

        }

    }

);




//========== SAVE EMAIL ==========//

customerEmail.addEventListener(

    "blur",

    saveProfile

);

customerEmail.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            customerEmail.blur();

        }

    }

);




//========== SAVE PROFILE ==========//

async function saveProfile(){

    if(!user) return;

    customerName.setAttribute(

        "readonly",

        true

    );

    customerEmail.setAttribute(

        "readonly",

        true

    );

    const name=

    customerName.value.trim();

    const email=

    customerEmail.value.trim();

    try{

        const response=

        await fetch(

            "/users/profile",

            {

                method:"PUT",

                headers:{

                    "Content-Type":

                    "application/json"

                },

                body:JSON.stringify({

                    user_id:user.user_id,

                    name,

                    email

                })

            }

        );

        const data=

        await response.json();

        if(!data.success){

            alert(

                data.message

            );

            customerName.value=

            user.name || "";

            customerEmail.value=

            user.email || "";

            return;

        }

        user=data.user;

        localStorage.setItem(

            "user",

            JSON.stringify(user)

        );

    }

    catch(err){

        console.log(err);

        customerName.value=

        user.name || "";

        customerEmail.value=

        user.email || "";

        alert(

            "Unable to update profile."

        );

    }

}

//=====================================
// USER PROFILE INFO
// PART 1B (SHARED LOCATION)
//=====================================


//========== ELEMENTS ==========//

const refreshCoordinates =
document.getElementById("refreshCoordinates");

const customerCoordinates =
document.getElementById("customerCoordinates");

const currentLocation =
document.getElementById("currentLocation");




//========== BUTTONS ==========//

if(refreshCoordinates){

    refreshCoordinates.onclick=()=>{

        updateCurrentLocation(true);

    };

}

if(currentLocation){

    currentLocation.onclick=()=>{

        updateCurrentLocation(true);

    };

}




//========== SHARED LOCATION FUNCTION ==========//

async function updateCurrentLocation(

    saveToDatabase=true

){

    if(!navigator.geolocation){

        alert(

            "Geolocation is not supported."

        );

        return;

    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            const latitude=

            position.coords.latitude.toFixed(7);

            const longitude=

            position.coords.longitude.toFixed(7);



            currentCoordinates={

                latitude,
                longitude

            };



            localStorage.setItem(

                "currentCoordinates",

                JSON.stringify(

                    currentCoordinates

                )

            );



            if(

                user &&

                saveToDatabase

            ){

                try{

                    const response=

                    await fetch(

                        "/users/location",

                        {

                            method:"PUT",

                            headers:{

                                "Content-Type":

                                "application/json"

                            },

                            body:JSON.stringify({

                                user_id:user.user_id,

                                latitude,
                                longitude

                            })

                        }

                    );

                    const data=

                    await response.json();

                    if(data.success){

                        user.coordinates=

                        data.coordinates;

                    }

                }

                catch(err){

                    console.log(err);

                }



                localStorage.setItem(

                    "user",

                    JSON.stringify(user)

                );

            }



            showCoordinates();

            setLocationLoading(false);



            //=========================
            // LOAD BUSINESSES LATER
            //=========================

            if(

                typeof loadNearbyBusinesses

                ===

                "function"

            ){

                loadNearbyBusinesses();

            }

        },



        ()=>{

            setLocationLoading(false);

            alert(

                "Unable to get current location."

            );

        },



        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

        }

    );

}




//========== SHOW COORDINATES ==========//

function showCoordinates(){

    if(

        user &&

        user.coordinates

    ){

        customerCoordinates.innerHTML=

        user.coordinates.latitude+

        ", "+

        user.coordinates.longitude;

    }

    else if(

        currentCoordinates

    ){

        customerCoordinates.innerHTML=

        currentCoordinates.latitude+

        ", "+

        currentCoordinates.longitude;

    }

    else{

        customerCoordinates.innerHTML=

        "Not Available";

    }

}




//========== BUTTON STATES ==========//

function setLocationLoading(

    loading

){

    if(refreshCoordinates){

        refreshCoordinates.disabled=

        loading;

        refreshCoordinates.innerHTML=

        loading

        ?

        '<i class="fa-solid fa-spinner fa-spin"></i>'

        :

        '<i class="fa-solid fa-rotate-right"></i>';

    }

}




//========== RESTORE LOCATION ==========//

const savedCoordinates=

localStorage.getItem(

    "currentCoordinates"

);

if(savedCoordinates){

    currentCoordinates=

    JSON.parse(savedCoordinates);

}
