const socket = io();

socket.on("enviodeproducts", (obj) => {
    updateProductList(obj);
});

function updateProductList(productList) {
    const productsDiv = document.getElementById('list-products');
    let productosHTML = "";

    productList.forEach((product) => {
        productosHTML += `
        <div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
            <div class="card-header bg-primary text-black">code: ${product.code}</div>
            <div class="card-body">
                <h4 class="card-title text-black">${product.name}</h4>
                <p class="card-text">
                    <ul class="card-text">
                        <li>id: ${product._id}</li>
                        <li>description: ${product.description}</li>
                        <li>price: $${product.price}</li>
                        <li>category: ${product.category}</li>
                        <li>status: ${product.status}</li>
                        <li>stock: ${product.stock}</li>
                        <li>thumbnail: <img src="${product.thumbnail}" alt="img" class="img-thumbnail img-fluid"></li>
                    </ul>
                </p>
            </div>
            <div class="d-flex justify-content-center mb-4">
               <button type="button" class="btn btn-danger delete-btn" onclick="deleteProduct('${product._id}')">Eliminar</button>
            </div>
        </div>`;
    });

    productsDiv.innerHTML = productosHTML;
}

let form = document.getElementById("formProduct");
form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let name = form.elements.name.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let status = form.elements.status.checked;

    socket.emit("addProduct", {
        name,
        description,
        stock,
        category,
        price,
        code,
        status
    });

    form.reset();
});

// eliminar por ID
document.getElementById("delete-btn").addEventListener("click", function () {
    const deleteidinput = document.getElementById("id-prod");
    const deleteid = deleteidinput.value.trim(); 
    if (deleteid) {
        socket.emit("deleteProduct", deleteid);
        deleteidinput.value = "";
    } else {
        console.error("ID del producto no válido");
    }
});

// eliminar el producto directamente
function deleteProduct(productId) {
    socket.emit("deleteProduct", String(productId)); 
}
