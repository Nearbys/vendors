//=====================================
// USER PROFILE ADDRESS
// PART 1
//=====================================


//========== ELEMENTS ==========//

const addressContainer =
document.getElementById("addressContainer");

const addAddress =
document.getElementById("addAddress");




//========== LOAD ADDRESSES ==========//

function loadAddresses(){

    addressContainer.innerHTML="";

    if(!user.addresses){

        user.addresses=[];

    }

    if(user.addresses.length===0){

        createAddressCard(

            {

                title:"",
                address:""

            },

            0

        );

        return;

    }

    user.addresses.forEach(

        (item,index)=>{

            createAddressCard(

                item,

                index

            );

        }

    );

}




//========== ADD ADDRESS ==========//

addAddress.onclick=function(){

    if(

        user.addresses.length>=5

    ){

        alert(

            "Maximum 5 addresses allowed."

        );

        return;

    }

    user.addresses.push({

        title:"",
        address:""

    });

    loadAddresses();

};




//========== CREATE CARD ==========//

function createAddressCard(

    item,

    index

){

    const card=

    document.createElement("div");

    card.className="addressCard";



    card.innerHTML=`

        <div class="inputGroup">

            <label>Title</label>

            <input

                type="text"

                class="addressTitle"

                placeholder="Home / Office"

                value="${item.title || ""}"

                data-index="${index}">

        </div>

        <div class="inputGroup">

            <label>Address</label>

            <textarea

                class="addressText"

                rows="3"

                placeholder="Enter address"

                data-index="${index}">${item.address || ""}</textarea>

        </div>

        <div

            class="deleteAddress"

            data-index="${index}">

            <i class="fa-solid fa-trash"></i>

        </div>

    `;



    addressContainer.appendChild(

        card

    );

}

//=====================================
// USER PROFILE ADDRESS
// PART 2
// EDIT & DELETE
//=====================================


//========== AUTO SAVE ON EDIT ==========//

addressContainer.addEventListener(

    "input",

    function(e){

        if(

            e.target.classList.contains(

                "addressTitle"

            )

        ){

            const index=

            Number(

                e.target.dataset.index

            );

            user.addresses[index].title=

            e.target.value;

        }



        if(

            e.target.classList.contains(

                "addressText"

            )

        ){

            const index=

            Number(

                e.target.dataset.index

            );

            user.addresses[index].address=

            e.target.value;

        }

    }

);




//========== SAVE WHEN LEAVING FIELD ==========//

addressContainer.addEventListener(

    "focusout",

    async function(e){

        if(

            e.target.classList.contains(

                "addressTitle"

            ) ||

            e.target.classList.contains(

                "addressText"

            )

        ){

            await saveAddresses();

        }

    }

);




//========== DELETE ADDRESS ==========//

addressContainer.addEventListener(

    "click",

    async function(e){

        const button=

        e.target.closest(

            ".deleteAddress"

        );



        if(!button) return;



        const index=

        Number(

            button.dataset.index

        );



        if(

            !confirm(

                "Delete this address?"

            )

        ){

            return;

        }



        user.addresses.splice(

            index,

            1

        );



        if(

            user.addresses.length===0

        ){

            user.addresses.push({

                title:"",
                address:""

            });

        }



        await saveAddresses();

        loadAddresses();

    }

);

//=====================================
// USER PROFILE ADDRESS
// PART 3
// SAVE ADDRESSES
//=====================================


let savingAddresses = false;




//========== SAVE ==========//

async function saveAddresses(){

    if(!user) return;

    if(savingAddresses) return;

    savingAddresses = true;

    try{

        const response = await fetch(

            "/users/addresses",

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    user_id:user.user_id,

                    addresses:user.addresses

                })

            }

        );

        const data = await response.json();

        if(!response.ok || !data.success){

            throw new Error(

                data.message ||

                "Unable to save addresses."

            );

        }

        user.addresses =

        data.addresses;

        localStorage.setItem(

            "user",

            JSON.stringify(user)

        );

    }

    catch(err){

        console.log(err);

        alert(err.message);

    }

    finally{

        savingAddresses = false;

    }

}




//========== LOAD AFTER LOGIN ==========//

document.addEventListener(

    "DOMContentLoaded",

    function(){

        if(

            localStorage.getItem(

                "user"

            )

        ){

            try{

                user = JSON.parse(

                    localStorage.getItem(

                        "user"

                    )

                );

            }

            catch(err){}

        }

    }

);
