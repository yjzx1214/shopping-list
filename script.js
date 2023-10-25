const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const filter = document.querySelector('#filter');
const clearBtn = document.querySelector('#clear');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemFromStorage = getItemFromStorage();

  itemFromStorage.forEach((item) => addItemToDOM(item));

  checkUI();
}

function addItem(e) {
  e.preventDefault();

  const newItem = itemInput.value;
  if (newItem === '') {
    alert('Please add an item!');
    return;
  }

  if (isEditMode) {
    editItem = document.querySelector('.edit-mode');
    removeItem(editItem);
    editItem.classList.remove('edit-mode');
  } else {
    if (checkItemExists(newItem)) {
      alert('The item already exists!');
      return;
    }
  }

  addItemToDOM(newItem);

  addItemToLocalStorage(newItem);

  checkUI();
}

function addItemToDOM(item) {
  const li = document.createElement('li');
  li.textContent = item;

  const button = createButton('remove-item btn-link text-red');
  const icon = createIcon('fa-solid fa-xmark');

  button.appendChild(icon);
  li.appendChild(button);
  itemList.appendChild(li);
}

function addItemToLocalStorage(item) {
  const itemFromStorage = getItemFromStorage();

  itemFromStorage.push(item);

  localStorage.setItem('items', JSON.stringify(itemFromStorage));
}

//check the item if exists
function checkItemExists(item) {
  const itemFromStorage = getItemFromStorage();
  return itemFromStorage.includes(item);
}

//Get item from local storage
function getItemFromStorage() {
  let itemFromStorage;

  if (localStorage.getItem('items') === null) {
    itemFromStorage = [];
  } else {
    itemFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemFromStorage;
}

//Create delete button
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  return button;
}

//Create delete icon
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItems(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    if (confirm('Are you sure you want to remove')) {
      removeItem(e.target.parentElement.parentElement);
    }
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(item) {
  isEditMode = true;

  //change the item color back to black
  const items = itemList.querySelectorAll('li');
  items.forEach((item) => item.classList.remove('edit-mode'));

  //change the 'Add' button to the 'edit' button
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228b22';

  itemInput.value = item.textContent;
  item.classList.add('edit-mode');
}

//Remove item
function removeItem(item) {
  item.remove();

  itemName = item.textContent;

  let itemFromStorage = getItemFromStorage();

  itemFromStorage = itemFromStorage.filter((item) => item !== itemName);
  localStorage.setItem('items', JSON.stringify(itemFromStorage));

  checkUI();
}

//Clear all items
function clearItems() {
  if (confirm('Are you sure you want to remove all items')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');
    checkUI();
  }
}

//filter items
function filterItems(e) {
  const input = e.target.value.toLowerCase();

  const items = itemList.querySelectorAll('li');
  items.forEach((item) => {
    if (item.firstChild.textContent.toLowerCase().indexOf(input) === -1) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
}

function checkUI() {
  itemInput.value = '';

  const items = document.querySelectorAll('li');
  if (items.length === 0) {
    filter.style.display = 'none';
    clearBtn.style.display = 'none';
  } else {
    filter.style.display = 'block';
    clearBtn.style.display = 'block';
  }

  if (isEditMode) {
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
  }
}

function initialize() {
  itemList.addEventListener('click', onClickItems);
  clearBtn.addEventListener('click', clearItems);
  itemForm.addEventListener('submit', addItem);
  filter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
}

initialize();
