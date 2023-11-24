const categoryList = document.querySelector('.categories');
const productsArea = document.querySelector('.products');
const basketBtn = document.querySelector('#basket');
const closeBtn = document.querySelector('#close');
const modal = document.querySelector('.modal-wrapper');
const basketList = document.querySelector('#list');
const totalSpan = document.querySelector('#total-price');
const totalCount = document.querySelector('#count');
const form = document.getElementById('form');
const search = document.getElementById('search');

//API
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchProducts();
});

const baseURL = 'https://api.escuelajs.co/api/v1'

/*
 * get category information
 * 1- Send request to API
 * 2- process incoming data
 * 3- Run the function that will print the incoming data on the screen as a card
 * 4- notify the user if the answer is wrong
 */

const fetchCategories = () => {
    fetch(`${baseURL}/categories`)
        .then((res) => res.json())
        .then((data) => {
            renderCategories(data.slice(1, 5));
        })
        .catch((err) => console.log(err)
        );
}

const renderCategories = (categories) => {
    categories.forEach((category) => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category-card');
        categoryDiv.innerHTML = `
        <img src=${category.image}/>
        <p class="slide">${category.name}</p>
        `;
        categoryList.appendChild(categoryDiv);
    });
}

const fetchProducts = async () => {
    try {
        const res = await fetch(`${baseURL}/products`);
        const data = await res.json();
        renderProducts(data.slice(0, 20));
    } catch (err) {
        console.log(err)
    }
};
const renderProducts = (products) => {
    const productsHTML = products.map((product) => `
    
    <div class="card">
            <img src=${product.images[1]} />
            <h4>${product.title}</h4>
            <h4>${product.category.name ? product.category.name : 'Diğer'
        }</h4>
            <div class="action">
              <span>${product.price} &#8378;</span>
              <button onclick="addToBasket({id:${product.id},title:'${product.title
        }',price:${product.price},img:'${product.images[1]
        }',amount:1})">Sepete Ekle</button>
            </div>
          </div>
    
    
    `
    )

    productsArea.innerHTML += productsHTML.join('');
}

let basket = [];
let total = 0;

basketBtn.addEventListener('click', () => {
    modal.classList.add('active');
    renderBasket();
})

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active')
})

function addToBasket(product) {
    const found = basket.find((i) => i.id === product.id)
    if (found) {
        found.amount++;
    } else {
        basket.push(product)
    }
}

const renderBasket = () => {

    const cardsHTML = basket.map((product) => `
    <div class="item">
        <img src=${product.img} />
        <h3 class="title">${product.title}</h3>
        <h4 class="price">${product.price} &#8378;</h4>
        <p>Miktar: ${product.amount}</p>
        <img onclick="deleteItem(${product.id})" id="delete" src="images/e-trash.png" />
    </div>
    `).join(' ');

    basketList.innerHTML = cardsHTML;

    calculateTotal();
}

const calculateTotal = () => {
    const sum=basket.reduce((sum,i)=>sum + i.price * i.amount,0)
    const amount = basket.reduce((sum, i) => sum + i.amount, 0)

    totalSpan.innerText = sum;
    totalCount.innerText = amount + ' ' + "Product";
}

const deleteItem = (deleteid) => {
    basket = basket.filter((i) => i.id !== deleteid)

    renderBasket()
}