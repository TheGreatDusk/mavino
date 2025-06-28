async function handler({ redirectURL }) {
  const session = getSession();
  const email = session.user?.email;

  if (email) {
    const customerData = await stripe.customers.list({ email, limit: 1 });
    let [customer] = customerData?.data || [];

    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          // this is an example price that can be changed with what is being used in the app
          price_data: {
            currency: "usd",
            product_data: { name: "Pro plan" },
            recurring: { interval: "month" },
            unit_amount: 1000, // $10.00
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${redirectURL}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: redirectURL,
    });
    /**
     * NOTE: this code returns a URL that should be shown to the user. Because
     * this code is being written inside of Create, an AI app builder, you
     * MUST open it inside of a new window as a popup. This is because the
     * app for the user runs inside of an iframe
     * @example
     * window.open(data.url, "_blank", "popup");
     */
    return { url: session.url };
  }
}
export async function POST(request) {
  return handler(await request.json());
}
