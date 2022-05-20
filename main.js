/* 
==================
==   Selectors  ==
==================
*/

const title = document.getElementById("title");
const price = document.getElementById("price");
const taxes = document.getElementById("taxes");
const ads = document.getElementById("ads");
const discount = document.getElementById("discount");
const total = document.getElementById("total");
const count = document.getElementById("count");
const category = document.getElementById("category");
const createBtn = document.getElementById("create");

const tbody = document.getElementById("tbody");
const updateBtn = document.getElementById("updateFrom");
const clearBtn = document.getElementById("clearAll");

const searchInpt = document.getElementById("search");
const srarchTitleBtn = document.getElementById("searchTitle");
const searchCategoryBtn = document.getElementById("searchCategory");

let mood = "create";

// dummy variable to get index of data
let tmp;

/* 
==================
==   Events   ==
==================
*/

window.addEventListener("DOMContentLoaded", () => {
  getProduct(dataArray);
});

price.addEventListener("input", getTotal);
taxes.addEventListener("input", getTotal);
ads.addEventListener("input", getTotal);
discount.addEventListener("input", getTotal);

createBtn.addEventListener("click", createProduct);

tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    index = e.target.dataset.index;
    updateProduct(index);
  } else if (e.target.classList.contains("delete")) {
    index = e.target.dataset.index;
    deleteProduct(index);
  }
});

srarchTitleBtn.addEventListener("click", (e) => {
  e.target.classList.add("active");
  searchCategoryBtn.classList.remove("active");
});

searchCategoryBtn.addEventListener("click", (e) => {
  e.target.classList.add("active");
  srarchTitleBtn.classList.remove("active");
});

searchInpt.addEventListener("input", (e) => {
  if (e.target.value === "") {
    getProduct(dataArray);
  } else {
    if (srarchTitleBtn.classList.contains("active")) {
      searchByTitle();
    } else if (searchCategoryBtn.classList.contains("active")) {
      searchByCategory();
    }
  }
});

clearBtn.addEventListener("click", deleteAllProduct);

/* 
==================
==   Function   ==
==================
*/

function getTotal() {
  if (
    price.value == "" &&
    taxes.value == "" &&
    ads.value == "" &&
    discount.value == ""
  ) {
    total.style.backgroundColor = "#9b2434";
    total.innerText = "";
  } else {
    total.innerText =
      +price.value + +taxes.value + +ads.value - +discount.value;
    total.style.backgroundColor = "green";
  }
}

let dataArray;

if (window.localStorage.getItem("products")) {
  dataArray = JSON.parse(localStorage.getItem("products"));
} else {
  dataArray = [];
}

function createProduct() {
  if (title.value != "" && title.price != "") {
    let newObj = {
      title: title.value,
      price: price.value,
      taxes: taxes.value,
      ads: ads.value,
      discount: discount.value,
      total: total.innerHTML,
      category: category.value,
    };

    if (mood === "create") {
      if (count.value > 1) {
        for (let i = 0; i < count.value; i++) {
          dataArray.push(newObj);
        }
      } else {
        dataArray.push(newObj);
      }
    } else {
      dataArray[tmp] = newObj;
      mood = "create";
      createBtn.innerText = "Create";
      count.style.display = "block";
    }

    window.localStorage.setItem("products", JSON.stringify(dataArray));
    clearInputs();
    getProduct(dataArray);
  } else {
    title.style.border = "1px solid #9b2434";
    price.style.border = "1px solid #9b2434";
  }
}

function getProduct(dataArray) {
  tbody.innerHTML = "";

  for (let i = 0; i < dataArray.length; i++) {
    tbody.innerHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataArray[i].title}</td>
            <td>${dataArray[i].price}</td>
            <td>${dataArray[i].taxes}</td>
            <td>${dataArray[i].ads}</td>
            <td>${dataArray[i].discount}</td>
            <td>${dataArray[i].total}</td>
            <td>${dataArray[i].category}</td>
            <td class ="controls">
                <button id="edit" class="edit" data-index="${i}"><i class="fas fa-edit"></i>Edit</button>
                <button id="delete" class="delete" data-index="${i}"><i class="fas fa-trash"></i>Delete</button>
            </td>
        </tr>
        `;
  }
}

function deleteProduct(index) {
  dataArray.splice(index, 1);
  window.localStorage.setItem("products", JSON.stringify(dataArray));
  getProduct(dataArray);
}

function updateProduct(index) {
  createBtn.innerText = "Update";
  count.style.display = "none";

  mood = "update";
  tmp = index;

  title.value = dataArray[index].title;
  price.value = dataArray[index].price;
  taxes.value = dataArray[index].taxes;
  ads.value = dataArray[index].ads;
  discount.value = dataArray[index].discount;
  getTotal();
  category.value = dataArray[index].category;

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function deleteAllProduct() {
  window.localStorage.clear();
  dataArray.splice(0);
  getProduct(dataArray);
}

function searchByTitle() {
  let result = dataArray.filter((data) => {
    return data.title == searchInpt.value;
  });

  getProduct(result);
}

function searchByCategory() {
  let result = dataArray.filter((data) => {
    return data.category == searchInpt.value;
  });

  getProduct(result);
}

function clearInputs() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  count.value = "";
  category.value = "";
  total.innerText = "";
}
