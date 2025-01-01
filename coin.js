const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Payment Gateway Integration (Example: Stripe)
app.post("/api/payment", async (req, res) => {
  const { gateway, coins, cost } = req.body;

  try {
    // Example: Stripe Payment
    if (gateway === "stripe") {
      // Integrate Stripe SDK here
      console.log(`Processing Stripe payment for $${cost} (${coins} coins).`);
    }

    // Add other gateways similarly
    res.status(200).json({ success: true, message: "Payment processed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Payment failed.", error });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
