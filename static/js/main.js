document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();

    
    document.getElementById('add-product-form').addEventListener('submit', function (e) {
        e.preventDefault();
        addProduct();
    });
});

function fetchProducts() {
    fetch('/api/products/')
        .then(response => response.json())
        .then(response => {
            const tableBody = document.getElementById('product-table');
            tableBody.innerHTML = ''; 

           
            if (response.data && Array.isArray(response.data)) {
                response.data.forEach(product => {
                    const row = `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.description || ''}</td>
                            <td>${product.price}</td>
                            <td>${product.stock_now}</td>
                            <td>
                                <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">Edit</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                            </td>
                        </tr>
                    `;
                    tableBody.insertAdjacentHTML('beforeend', row);
                });
            } else {
                console.error('Invalid response format:', response);
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
}

function openAddProductModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

function addProduct() {
    const form = document.getElementById('add-product-form');
    const data = {
        name: form.name.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        stock_now: parseInt(form.stock_now.value), 
    };

    fetch('/api/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(() => {
        fetchProducts();
        form.reset(); 
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide(); // Close the modal
    })
    .catch(error => {
        console.error('Error adding product:', error);
    });
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/api/products/${id}/`, { method: 'DELETE' })
            .then(() => fetchProducts());
    }
}

function editProduct(id) {
    // Fetch the product details
    fetch(`/api/products/${id}/`)
        .then(response => response.json())
        .then(response => {
      

            const product = response.data;
            

            
            const form = document.getElementById('edit-product-form');

           
            form.querySelector('#edit-name').value = product.name;
            form.querySelector('#edit-description').value = product.description || '';
            form.querySelector('#edit-price').value = product.price;
            form.querySelector('#edit-stock_now').value = product.stock_now;

           
            const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
            modal.show();

           
            form.onsubmit = function (e) {
                e.preventDefault();
                updateProduct(id);
            };
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
}


function updateProduct(id) {
    const form = document.getElementById('edit-product-form');
    const data = {};

    
    if (form.querySelector('#edit-name').value) data.name = form.querySelector('#edit-name').value;
    if (form.querySelector('#edit-description').value) data.description = form.querySelector('#edit-description').value;
    if (form.querySelector('#edit-price').value) data.price = parseFloat(form.querySelector('#edit-price').value);
    if (form.querySelector('#edit-stock_now').value) data.stock_now = parseInt(form.querySelector('#edit-stock_now').value);

    fetch(`/api/products/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(() => {
        fetchProducts(); 
        bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide(); 
    })
    .catch(error => {
        console.error('Error updating product:', error);
    });
}