const payButton = document.getElementById("payButton");

payButton.addEventListener("click", async function () {

    try {

        // Ask our server to create a Razorpay order
        const response = await fetch("/create-order", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                amount: 499
            })
        });

        if (!response.ok) {
            throw new Error("Could not create order");
        }

        const order = await response.json();


        // Razorpay Checkout settings
        const options = {

            // Your Razorpay TEST Key ID
            key: "rzp_test_ToFel4Hpq69mw0",

            amount: order.amount,

            currency: order.currency,

            name: "Haresh's Store",

            description: "Premium Course",

            order_id: order.id,


            // This runs after Razorpay reports a payment
            handler: async function (paymentResponse) {

                console.log("Razorpay payment response:",paymentResponse);
                try {

                    // Send the payment details to our server
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


                    const result = await verifyResponse.json();


                    const paymentMessage =
                    document.getElementById("paymentMessage");
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


        // Create Razorpay Checkout
        const razorpay = new Razorpay(options);


        // Open the payment window
        razorpay.open();


    } catch (error) {

        console.error(error);

        alert(
            "Something went wrong while starting the payment."
        );

    }

});