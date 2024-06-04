const firebaseConfig = {
  apiKey: "AIzaSyDa1y03PJzImKtToZ7U37cu2O1nkQIC7Vo",
  authDomain: "signup-auth-474ba.firebaseapp.com",
  projectId: "signup-auth-474ba",
  storageBucket: "signup-auth-474ba.appspot.com",
  messagingSenderId: "132636142418",
  appId: "1:132636142418:web:91edf99f16e2e048d4a88b",
};

// Initialize Firebase
const fireBase = firebase.initializeApp(firebaseConfig);

// SignUp/SignIn Form
function signup() {
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-pass");

  const email = emailInput.value;
  const password = passwordInput.value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User account created successfully.",
      }).then(() => {
        window.location.href = "./signin.html";
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    });
}

function signin() {
  const emailInput = document.getElementById("signin-email");
  const passwordInput = document.getElementById("signin-pass");

  const email = emailInput.value;
  const password = passwordInput.value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "./welcome.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    });
}

function logOut() {
  window.location.href = "./signin.html";
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
  actionCell.appendChild(deleteButton);
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("onclick", "deleteExpense(this.parentNode)");
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
