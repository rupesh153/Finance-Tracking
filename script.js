const expenseForm = document.getElementById("expenseForm");

const expenseTable = document.getElementById("expenseTable");

const budgetDisplay = document.getElementById("budgetDisplay");

const expenseDisplay = document.getElementById("expenseDisplay");

const balanceDisplay = document.getElementById("balanceDisplay");

const budgetInput = document.getElementById("budgetInput");

const warning = document.getElementById("warning");

const searchInput = document.getElementById("searchInput");

const filterCategory = document.getElementById("filterCategory");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let budget = JSON.parse(localStorage.getItem("budget")) || 0;
let pieChart;
let barChart;



function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));

  localStorage.setItem("budget", JSON.stringify(budget));
}

function updateSummary() {
  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  let balance = budget - total;

  // Prevent Negative Balance
  if (balance < 0) {
    balance = 0;

    warning.innerText = "⚠ Budget Limit Exceeded!";
  } else {
    warning.innerText = "";
  }

  budgetDisplay.innerText = `₹${budget}`;

  expenseDisplay.innerText = `₹${total}`;

  balanceDisplay.innerText = `₹${balance}`;
}

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;

  const amount = Number(document.getElementById("amount").value);

  const category = document.getElementById("category").value;

  const date = document.getElementById("date").value;

  expenses.push({
    title,
    amount,
    category,
    date,
  });

  saveData();

  renderExpenses();

  expenseForm.reset();
});

function renderExpenses(data = expenses) {
  expenseTable.innerHTML = "";

  data.forEach((expense, index) => {
    expenseTable.innerHTML += `
      <tr>

        <td>${expense.title}</td>

        <td>₹${expense.amount}</td>

        <td>${expense.category}</td>

        <td>${expense.date}</td>

        <td>

          <button class="edit-btn"
          onclick="editExpense(${index})">

          <i class="fa-solid fa-pen"></i>

          </button>

          <button class="delete-btn"
          onclick="deleteExpense(${index})">

          <i class="fa-solid fa-trash"></i>

          </button>

        </td>

      </tr>
    `;
  });

  updateSummary();

  updateCharts();
}

function deleteExpense(index) {
  expenses.splice(index, 1);

  saveData();

  renderExpenses();
}

function editExpense(index) {
  const exp = expenses[index];

  document.getElementById("title").value = exp.title;

  document.getElementById("amount").value = exp.amount;

  document.getElementById("category").value = exp.category;

  document.getElementById("date").value = exp.date;

  deleteExpense(index);
}

document.getElementById("setBudgetBtn").addEventListener("click", () => {
  budget = Number(budgetInput.value);

  saveData();

  updateSummary();

  budgetInput.value = "";
});

function filterExpenses() {
  const search = searchInput.value.toLowerCase();

  const category = filterCategory.value;

  const filtered = expenses.filter((exp) => {
    const matchSearch =
      exp.title.toLowerCase().includes(search) ||
      exp.category.toLowerCase().includes(search);

    const matchCategory = category === "All" || exp.category === category;

    return matchSearch && matchCategory;
  });

  renderExpenses(filtered);
}

searchInput.addEventListener("input", filterExpenses);

filterCategory.addEventListener("change", filterExpenses);


function updateCharts(){

  const totals = {};

  expenses.forEach(exp=>{

    if(totals[exp.category]){

      totals[exp.category] += exp.amount;

    }else{

      totals[exp.category] =
      exp.amount;
    }

  });

  const labels =
  Object.keys(totals);

  const values =
  Object.values(totals);

  if(pieChart) pieChart.destroy();
  if(barChart) barChart.destroy();

  pieChart = new Chart(
    document.getElementById("pieChart"),
    {
      type:"doughnut",

      data:{
        labels:labels,

        datasets:[{
          data:values
        }]
      }
    }
  );

  barChart = new Chart(
    document.getElementById("barChart"),
    {
      type:"bar",

      data:{
        labels:labels,

        datasets:[{
          label:"Expenses",
          data:values,
          borderRadius:10
        }]
      }
    }
  );
}


renderExpenses();

updateSummary();
