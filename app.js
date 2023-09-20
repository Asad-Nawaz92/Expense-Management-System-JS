function signup() {
  var nameInput = document.createElement("signup-name");
  var emailInput = document.getElementById("signup-email");
  var passwordInput = document.getElementById("signup-pass");
  var confirmpasswordInput = document.getElementById("signup-confirm-pass");

  var name = nameInput.value;
  var email = emailInput.value;
  var password = passwordInput.value;
  var confirmPassword = confirmpasswordInput.value;

  if (password != confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (
    name === "" ||
    confirmPassword === "" ||
    email === "" ||
    password === ""
  ) {
    alert("Please fill in all fields.");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return;
  }
  var usersJSON = localStorage.getItem("users");
  var users = usersJSON ? JSON.parse(usersJSON) : [];

  var existingUser = users.some(function (user) {
    return user.email === email;
  });

  if (existingUser) {
    alert("User with this email already exists. Please sign in.");
    location.href = "./signin.html";
    return;
  }

  var newUser = {
    email: email,
    password: password,
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  location.href = "./signin.html";
}

function signin() {
  var emailInput = document.getElementById("signin-email");
  var passwordInput = document.getElementById("signin-pass");
  var email = emailInput.value;
  var password = passwordInput.value;

  var usersJSON = localStorage.getItem("users");
  var users = usersJSON ? JSON.parse(usersJSON) : [];

  var user = users.find(function (e) {
    return e.email === email && e.password === password;
  });

  if (user) {
    location.href = "./welcome.html";
  } else {
    alert("Invalid email or password. Please try again.");
    location.href = "./signin.html";
  }
}

function logOut() {
  location.href = "./signin.html";
}

//Expense Management System
var expenses = [];
var expenseList = document.getElementById("expense-list");
var totalAmount = 0;

function addExpense() {
  var titleInput = document.getElementById("expense-title");
  var amountInput = document.getElementById("expense-amount");
  var dateInput = document.getElementById("expense-date");

  var title = titleInput.value;
  var amount = parseFloat(amountInput.value);
  var date = dateInput.value;

  if (title === "" || isNaN(amount) || date === "") {
    alert("Please fill in all fields with valid data.");
    return;
  }

  var newRow = document.createElement("tr");

  var idCell = document.createElement("td");
  idCell.textContent = expenseList.rows.length + 1;

  var titleCell = document.createElement("td");
  titleCell.textContent = title;

  var amountCell = document.createElement("td");
  amountCell.textContent = amount.toFixed(2);

  var dateCell = document.createElement("td");
  dateCell.textContent = date;

  var actionCell = document.createElement("td");

  var updateButton = document.createElement("button");
  updateButton.textContent = "Update";
  updateButton.setAttribute("onclick", "updateExpense(this)");
  actionCell.appendChild(updateButton);
  updateButton.setAttribute("class", "btn btn-info m-2");

  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("onclick", "deleteExpense(this)");
  actionCell.appendChild(deleteButton);
  deleteButton.setAttribute("class", "btn btn-danger m-2");

  newRow.appendChild(idCell);
  newRow.appendChild(titleCell);
  newRow.appendChild(amountCell);
  newRow.appendChild(dateCell);
  newRow.appendChild(actionCell);

  expenseList.appendChild(newRow);

  titleInput.value = "";
  amountInput.value = "";
  dateInput.value = "";

  totalAmount += amount;
  displayTotalAmount();
}
function updateExpense(button) {
  var row = button.parentNode.parentNode;
  var titleCell = row.cells[1];
  var amountCell = row.cells[2];
  var dateCell = row.cells[3];

  var updatedTitle = prompt("Enter Updated Title", titleCell.textContent);
  var updatedAmount = parseFloat(
    prompt("Enter Updated Amount", amountCell.textContent)
  );
  var updatedDate = prompt("Enter Updated Date", dateCell.textContent);

  if (updatedTitle === null || isNaN(updatedAmount) || updatedDate === null) {
    alert("Please fill in all fields with valid data.");
    return;
  }

  titleCell.textContent = updatedTitle;
  amountCell.textContent = updatedAmount.toFixed(2);
  dateCell.textContent = updatedDate;
}

function deleteExpense(button) {
  var row = button.parentNode.parentNode;
  var rowIndex = row.rowIndex;
  expenseList.deleteRow(rowIndex);

  var rows = expenseList.rows;
  for (var i = rowIndex; i < rows.length; i++) {
    rows[i].cells[0].textContent = i + 1;
  }

  totalAmount -= parseFloat(row.cells[2].textContent);
  displayTotalAmount();
}

function deleteAll() {
  expenseList.innerHTML = "";
  totalAmount = 0;
  displayTotalAmount();
}

function displayTotalAmount() {
  var totalAmountElement = document.getElementById("total-amount");

  if (totalAmountElement) {
    totalAmountElement.textContent =
      "Total Amount : " + totalAmount.toFixed(2) + " PKR";
  }
}

displayTotalAmount();
