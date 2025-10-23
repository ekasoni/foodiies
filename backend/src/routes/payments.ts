import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// @route   POST /api/payments/create-payment-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-payment-intent', authenticate, async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: req.user!.id
      },
      include: {
        restaurant: {
          select: {
            name: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.payment) {
      return res.status(400).json({ message: 'Payment already exists for this order' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.total) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        customerId: req.user!.id
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', authenticate, async (req: AuthRequest, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: req.user!.id
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId,
        stripePaymentIntentId: paymentIntentId,
        amount: order.total,
        status: 'COMPLETED'
      }
    });

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        restaurant: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`restaurant_${order.restaurantId}`).emit('order_confirmed', updatedOrder);
    io.to(`order_${orderId}`).emit('payment_confirmed', updatedOrder);

    res.json({
      success: true,
      payment,
      order: updatedOrder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Stripe webhook handler
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook Error');
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('PaymentIntent failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// @route   GET /api/payments/order/:orderId
// @desc    Get payment for order
// @access  Private
router.get('/order/:orderId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId: req.user!.id
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payment = await prisma.payment.findUnique({
      where: { orderId }
    });

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;