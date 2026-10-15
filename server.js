const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();
const app = express();

app.use(express.json());

app.use(express.static("public"));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

app.post("/create-order", async (req, res) => {

    try {

        const options = {
            amount: 100,
            currency: "INR",
            receipt: "receipt_" + Date.now()
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to create order"
        });

    }

});


// VERIFY PAYMENT
app.post("/verify-payment", (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");

        if (expectedSignature === razorpay_signature) {

            res.json({
                success: true,
                message: "Payment verified successfully"
            });

        } else {

            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });

        }

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Verification error"
        });

    }

});
app.post("/verify-payment", (req, res) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body =
            razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature =
            crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest("hex");

        if (expectedSignature === razorpay_signature) {

            res.json({
                success: true,
                message: "Payment verified successfully"
            });

        } else {

            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });

        }

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Verification error"
        });

    }

});

app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});