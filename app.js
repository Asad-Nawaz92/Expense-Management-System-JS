const firebaseConfig = {
  apiKey: "AIzaSyAIB3aKe6VPHkJXlqcaOLgijE5DOCYo45E",
  authDomain: "ems-app-a9ff1.firebaseapp.com",
  databaseURL: "https://ems-app-a9ff1-default-rtdb.firebaseio.com",
  projectId: "ems-app-a9ff1",
  storageBucket: "ems-app-a9ff1.appspot.com",
  messagingSenderId: "1067876255076",
  appId: "1:1067876255076:web:d2c3e60545f42f65fba671",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

const expenseList = document.getElementById("expense-list");

// Initialize total amount
let totalAmount = 0;

window.onload = function () {
  loadExpenses();
};

// SignUp function
function signup() {
  const emailInput = document.getElementById("signup-email");
  const passwordInput = document.getElementById("signup-pass");

  const email = emailInput.value;
  const password = passwordInput.value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User account created successfully.",
      }).then(() => {
        window.location.href = "signin.html";
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    });
}

// SignIn function
function signin() {
  const emailInput = document.getElementById("signin-email");
  const passwordInput = document.getElementById("signin-pass");

  const email = emailInput.value;
  const password = passwordInput.value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "welcome.html";
    })
    .catch((error) => {
      const errorMessage = error.message;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    });
}

// Logout function with Swal
function logOut() {
  Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to log out?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, log out",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      auth.signOut().then(() => {
        Swal.fire(
          "Logged Out!",
          "You have been successfully logged out.",
          "success"
        ).then(() => {
          window.location.href = "signin.html";
        });
      });
    }
  });
}

// Add expense function
function addExpense() {
  const titleInput = document.getElementById("expense-title");
  const amountInput = document.getElementById("expense-amount");
  const dateInput = document.getElementById("expense-date");

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value.trim());
  const date = dateInput.value.trim();

  // Check if input fields are valid
  if (title === "" || isNaN(amount) || date === "") {
    Swal.fire({
      icon: "error",
      title: "Invalid Input",
      text: "Please fill in all fields with valid data.",
    });
    return;
  }

  // Add the expense to the database
  const newExpenseRef = db.ref("expenses/").push();
  newExpenseRef
    .set({
      title: title,
      amount: amount,
      date: date,
    })
    .then(() => {
      const newRow = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = expenseList.rows.length + 1;

      const titleCell = document.createElement("td");
      titleCell.textContent = title;

      const amountCell = document.createElement("td");
      amountCell.textContent = amount.toFixed(2);

      const dateCell = document.createElement("td");
      dateCell.textContent = date;

      const actionCell = document.createElement("td");

      const updateButton = document.createElement("button");
      updateButton.textContent = "Update";
      updateButton.setAttribute(
        "onclick",
        `updateExpense('${newExpenseRef.key}')`
      );
      updateButton.setAttribute("class", "btn btn-info m-2");
      actionCell.appendChild(updateButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute(
        "onclick",
        `deleteExpense('${newExpenseRef.key}', this)`
      );
      deleteButton.setAttribute("class", "btn btn-danger m-2");
      actionCell.appendChild(deleteButton);
      
      newRow.appendChild(idCell);
      newRow.appendChild(titleCell);
      newRow.appendChild(amountCell);
      newRow.appendChild(dateCell);
      newRow.appendChild(actionCell);


      expenseList.appendChild(newRow);
      // Clear input fields
      titleInput.value = "";
      amountInput.value = "";
      dateInput.value = "";
      totalAmount += amount;
      displayTotalAmount();
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

// Update expense function
function updateExpense(docId) {
  const row = document.querySelector(
    `button[onclick="updateExpense('${docId}')"]`
  ).parentNode.parentNode;
  const titleCell = row.cells[1];
  const amountCell = row.cells[2];
  const dateCell = row.cells[3];

  Swal.fire({
    title: "Enter Updated Details",
    html: `<input id="updatedTitle" class="swal2-input" placeholder="Title" value="${titleCell.textContent}">
           <input id="updatedAmount" class="swal2-input" type="number" placeholder="Amount" value="${amountCell.textContent}">
           <input id="updatedDate" class="swal2-input" type="date" value="${dateCell.textContent}">`,
    focusConfirm: false,
    preConfirm: () => {
      // Retrieve updated values from Swal input fields
      const updatedTitle = document.getElementById("updatedTitle").value.trim();
      const updatedAmount = parseFloat(
        document.getElementById("updatedAmount").value.trim()
      );
      const updatedDate = document.getElementById("updatedDate").value.trim();

      // Validate updated values
      if (updatedTitle === "" || isNaN(updatedAmount) || updatedDate === "") {
        Swal.showValidationMessage(
          "Please fill in all fields with valid data."
        );
        return;
      }

      // Return updated values
      return { updatedTitle, updatedAmount, updatedDate };
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const { updatedTitle, updatedAmount, updatedDate } = result.value;

      // Update expense in the database
      db.ref("expenses/" + docId)
        .update({
          title: updatedTitle,
          amount: updatedAmount,
          date: updatedDate,
        })
        .then(() => {
          // Update expense in the HTML table
          titleCell.textContent = updatedTitle;
          amountCell.textContent = updatedAmount.toFixed(2);
          dateCell.textContent = updatedDate;
          // Provide feedback to the user
          Swal.fire({
            icon: "success",
            title: "Expense Updated Successfully",
          });
        })
        .catch((error) => {
          // Handle errors
          console.error("Error updating document: ", error);
          // Provide feedback to the user
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "An error occurred while updating the expense.",
          });
        });
    }
  });
}

// Delete expense function
function deleteExpense(docId, button) {
  db.ref("expenses/" + docId)
    .remove()
    .then(() => {
      const row = button.closest("tr");
      row.parentNode.removeChild(row);

      totalAmount -= parseFloat(row.cells[2].textContent);
      displayTotalAmount();
    })
    .catch((error) => {
      console.error("Error deleting document: ", error);
    });
}

// Delete all expenses function
function deleteAll() {
  if (expenseList.rows.length === 0) {
    Swal.fire({
      icon: "error",
      title: "No Expenses",
      text: "Please add expenses first.",
    });
    return;
  }

  db.ref("expenses/")
    .remove()
    .then(() => {
      expenseList.innerHTML = "";
      totalAmount = 0;
      displayTotalAmount();
    })
    .catch((error) => {
      console.error("Error deleting documents: ", error);
    });
}

// Display total amount function
function displayTotalAmount() {
  const totalAmountElement = document.getElementById("total-amount");
  if (totalAmountElement) {
    totalAmountElement.textContent =
      "Total Amount : " + totalAmount.toFixed(2) + " PKR";
      totalAmountElement.setAttribute("class", "total_amount");
  }
}

// Load expenses from Firebase Realtime Database and display them
function loadExpenses() {
  db.ref("expenses/")
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const expense = childSnapshot.val();
        const newRow = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = expenseList.rows.length + 1;

        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;

        const amountCell = document.createElement("td");
        amountCell.textContent = expense.amount.toFixed(2);

        const dateCell = document.createElement("td");
        dateCell.textContent = expense.date;

        const actionCell = document.createElement("td");

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.setAttribute(
          "onclick",
          `updateExpense('${childSnapshot.key}')`
        );
        updateButton.setAttribute("class", "btn btn-info m-2");
        actionCell.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
          "onclick",
          `deleteExpense('${childSnapshot.key}', this)`
        );
        deleteButton.setAttribute("class", "btn btn-danger m-2");
        actionCell.appendChild(deleteButton);

        newRow.appendChild(idCell);
        newRow.appendChild(titleCell);
        newRow.appendChild(amountCell);
        newRow.appendChild(dateCell);
        newRow.appendChild(actionCell);

        expenseList.appendChild(newRow);

        totalAmount += expense.amount;
        displayTotalAmount();
      });
    })
    .catch((error) => {
      console.error("Error loading expenses: ", error);
    });
}
