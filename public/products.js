//================ PRODUCT IMAGE ================//

let productImageFile = null;

const productImageInput = document.getElementById("productImageInput");

const productImagePreview = document.getElementById("productImagePreview");

productImagePreview.addEventListener("click",()=>{

    productImageInput.click();

});

productImageInput.addEventListener("change",(e)=>{

    const file = e.target.files[0];

    if(!file) return;

    productImageFile = file;

    productImagePreview.innerHTML =
        `<img src="${URL.createObjectURL(file)}">`;

});



    //================ CREATE PRODUCT ================//

document.getElementById("createProductBtn").addEventListener(

"click",

async()=>{

    try{

        if(!productImageFile){

            alert("Select a product image.");

            return;

        }

        const title =
            document.getElementById("productTitle").value.trim();

        const category =
            document.getElementById("productCategory").value;

        const description =
            document.getElementById("productDescription").value.trim();

        const quantity =
            document.getElementById("productQuantity").value;

        const unit =
            document.getElementById("productUnit").value;

        const price =
            document.getElementById("productPrice").value;

        if(title===""){

            alert("Enter product title.");

            return;

        }

        if(category===""){

            alert("Select category.");

            return;

        }

        if(price===""){

            alert("Enter price.");

            return;

        }

        const image = await uploadToCloudinary(

    productImageFile,

    "product_images"

    );

        const response = await fetch("/products",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                business_id:vendor.id,

                title,

                category,

                description,

                quantity,

                unit,

                price,

                image

            })

        });

        const data = await response.json();

        if(!response.ok){

            alert(data.message);

            return;

        }

        alert("Product created.");

        productImageFile = null;

        productImageInput.value = "";

        productImagePreview.innerHTML = "+";

        document.getElementById("productTitle").value = "";

        document.getElementById("productCategory").selectedIndex = 0;

        document.getElementById("productDescription").value = "";

        document.getElementById("productQuantity").value = "";

        document.getElementById("productUnit").selectedIndex = 0;

        document.getElementById("productPrice").value = "";

        productModal.style.display = "none";

        loadProducts();

    }

    catch(err){

        console.log(err);

        alert("Unable to create product.");

    }

});

    //================ LOAD PRODUCTS ================//

async function loadProducts(){

    try{

        const response = await fetch(

            `/products/${vendor.id}`

        );

        const data = await response.json();

        if(!response.ok){

            throw new Error(data.message);

        }

        const list = document.getElementById("productsList");

        list.innerHTML = "";

        if(data.products.length===0){

            list.innerHTML=`

                <div style="text-align:center;padding:20px;color:#888;">

                    No products added yet.

                </div>

            `;

            return;

        }

        data.products.forEach(product=>{

            list.innerHTML+=`

                <div class="product-card">

                    <img src="${product.image}">

                    <div class="product-info">

                        <div class="product-title">

                            ${product.title}

                        </div>

                        <div class="product-category">

                            ${product.category}

                        </div>

                        <div>

                            ${product.quantity} ${product.unit}

                        </div>

                        <div class="product-price">

                            ${businessCurrency} ${Number(product.price).toFixed(2)}

                        </div>

                    </div>

                    <div class="product-actions">

                        <button onclick="editProduct(${product.id})">

                            ✏️

                        </button>

                        <button onclick="deleteProduct(${product.id})">

                            🗑️

                        </button>

                    </div>

                </div>

            `;

        });

    }

    catch(err){

        console.log(err);

    }

}
