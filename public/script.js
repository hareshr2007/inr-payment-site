// ==========================================
// RAZORPAY PAYMENT
// ==========================================

const payButton = document.getElementById("payButton");

payButton.addEventListener("click", async function () {

    try {

        // Create Razorpay order
        const response = await fetch("/create-order", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                amount: 1
            })
        });

        if (!response.ok) {
            throw new Error("Could not create order");
        }

        const order = await response.json();

        // Razorpay Checkout
        const options = {

            key: "rzp_test_ToFel4Hpq69mw0",

            amount: order.amount,

            currency: order.currency,

            name: "Haresh's Store",

            description: "₹1 Payment",

            order_id: order.id,

            handler: async function (paymentResponse) {

                console.log(
                    "Razorpay payment response:",
                    paymentResponse
                );

                try {

                    const verifyResponse = await fetch(
                        "/verify-payment",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify(paymentResponse)
                        }
                    );

                    const result =
                        await verifyResponse.json();

                    const paymentMessage =
                        document.getElementById(
                            "paymentMessage"
                        );

                    if (result.success) {

                        paymentMessage.textContent =
                            "✅ Payment verified successfully!";

                    } else {

                        paymentMessage.textContent =
                            "❌ Payment verification failed.";

                    }

                } catch (error) {

                    console.error(error);

                    alert(
                        "Could not verify the payment."
                    );
                }
            },

            theme: {
                color: "#2563eb"
            }
        };

        const razorpay =
            new Razorpay(options);

        razorpay.open();

    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while starting the payment."
        );
    }
});


// ==========================================
// QR CODE COUNTDOWN
// ==========================================

const qrTimer =
    document.getElementById("qrTimer");

const qrPayment =
    document.getElementById("qrPayment");

const qrExpired =
    document.getElementById("qrExpired");

let timeLeft = 5 * 60;


function updateQrTimer() {

    const minutes =
        Math.floor(timeLeft / 60);

    const seconds =
        timeLeft % 60;


    qrTimer.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    if (timeLeft <= 0) {

        clearInterval(qrCountdown);

        qrPayment.style.display = "none";

        qrExpired.style.display = "block";

        return;
    }


    timeLeft--;
}


// Start immediately
updateQrTimer();


// Continue every second
const qrCountdown =
    setInterval(updateQrTimer, 1000);