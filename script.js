// Define price and cash in drawer
const price = 3.26;
const cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

// Define DOM elements
const displayChangeDue = document.querySelector("#change-due");
const cashInput = document.querySelector("#cash");
const purchaseBtn = document.querySelector("#purchase-btn");
const priceScreen = document.querySelector("#price-screen");
const cashDrawerDisplay = document.querySelector("#cash-drawer-display");

// Function to format results
function formatResults(status, change) {
  displayChangeDue.innerHTML = `<p>Status: ${status}</p>`;
  for (const [currency, amount] of change) {
    displayChangeDue.innerHTML += `<p>${currency}: $${amount}</p>`;
  }
}

// Function to check cash register
function checkCashRegister() {
  const cash = Number(cashInput.value);

  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    cashInput.value = "";
    return;
  }

  if (cash === price) {
    displayChangeDue.innerHTML = "<p>No change due - customer paid with exact cash</p>";
    cashInput.value = "";
    return;
  }

  let changeDue = cash - price;
  let change = [];
  let cidCopy = JSON.parse(JSON.stringify(cid)); // Create a copy of cid to avoid mutating the original array

  const reversedCid = cidCopy.reverse();
  const denominations = {
    "ONE HUNDRED": 100,
    "TWENTY": 20,
    "TEN": 10,
    "FIVE": 5,
    "ONE": 1,
    "QUARTER": 0.25,
    "DIME": 0.1,
    "NICKEL": 0.05,
    "PENNY": 0.01
  };

  let totalCID = cid.reduce((acc, curr) => acc + curr[1], 0);

  if (totalCID < changeDue) {
    displayChangeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    return;
  }

  if (totalCID === changeDue) {
    formatResults("CLOSED", cid);
    return;
  }

  for (const [currency, value] of reversedCid) {
    if (changeDue >= denominations[currency] && value > 0) {
      const count = Math.min(Math.floor(changeDue / denominations[currency]), value / denominations[currency]);
      const changeAmount = count * denominations[currency];
      change.push([currency, changeAmount]);
      changeDue = parseFloat((changeDue - changeAmount).toFixed(2));
    }
  }

  if (changeDue > 0) {
    displayChangeDue.innerHTML = "<p>Status: INSUFFICIENT_FUNDS</p>";
    return;
  }

  formatResults("OPEN", change);
  updateUI(change);
}

// Function to update UI
function updateUI(change) {
  cashInput.value = "";
  priceScreen.textContent = `Total: $${price}`;
  cashDrawerDisplay.innerHTML = "<p><strong>Change in drawer:</strong></p>";
  for (const [currency, amount] of cid) {
    cashDrawerDisplay.innerHTML += `<p>${currency}: $${amount}</p>`;
  }
}

// Event listener for purchase button
purchaseBtn.addEventListener("click", checkCashRegister);

// Event listener for cash input
cashInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkCashRegister();
  }
});

// Initialize UI
updateUI();
