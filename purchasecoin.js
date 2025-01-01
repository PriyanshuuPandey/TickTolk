const coinAmount = document.getElementById("coinAmount");
const coinSummary = document.getElementById("coinSummary");
const priceSummary = document.getElementById("priceSummary");

// Update Summary
coinAmount.addEventListener("change", () => {
  const coins = parseInt(coinAmount.value);
  const cost = (coins / 5).toFixed(2); // 1$ = 5 Coins
  coinSummary.innerText = `Gold Coins: ${coins}`;
  priceSummary.innerText = `Total Cost: $${cost}`;
});

// Payment Gateways
document.querySelectorAll(".gateway-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const gateway = e.target.id;
    const coins = parseInt(coinAmount.value);
    const cost = (coins / 5).toFixed(2);

    alert(`Proceeding to payment via ${gateway} for $${cost}.`);
    // Replace the alert with a payment integration API call
  });
});
