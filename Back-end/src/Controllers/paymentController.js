// controllers/payment.controller.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//  Étape 1 : Créer une session de paiement
export const createPaymentSession = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ message: "bookingId et amount sont requis" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Paiement réservation ${bookingId}`,
            },
            unit_amount: amount * 100, // Stripe en centimes          
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Erreur création session Stripe", error: error.message });
  }
};
