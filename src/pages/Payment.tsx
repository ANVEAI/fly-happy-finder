import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Lock,
  CheckCircle2,
  Plane
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import BookingSteps from '@/components/BookingSteps';
import PriceSummary from '@/components/PriceSummary';
import { useBooking } from '@/context/BookingContext';
import { format } from 'date-fns';

const steps = [
  { id: 1, label: 'Flight', description: 'Select flight' },
  { id: 2, label: 'Passengers', description: 'Enter details' },
  { id: 3, label: 'Payment', description: 'Complete booking' },
  { id: 4, label: 'Confirmation', description: 'Get ticket' },
];

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay' },
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
  { id: 'netbanking', name: 'Net Banking', icon: Building2, description: 'All major banks' },
  { id: 'wallet', name: 'Wallets', icon: Wallet, description: 'Paytm, MobiKwik' },
];

const Payment = () => {
  const navigate = useNavigate();
  const { selectedFlight, searchParams, passengers, setBookingId, getTotalPrice } = useBooking();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

  if (!selectedFlight) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate booking ID
    const bookingId = `SKY${Date.now().toString(36).toUpperCase()}`;
    setBookingId(bookingId);

    navigate('/confirmation');
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Steps Header */}
      <div className="bg-card border-b pt-20">
        <div className="container mx-auto px-4">
          <BookingSteps currentStep={3} steps={steps} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => navigate('/passenger-details')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Passenger Details
            </Button>

            {/* Flight Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl p-6 shadow-card mb-6"
            >
              <h3 className="font-semibold text-lg mb-4">Flight Summary</h3>

              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl">{selectedFlight.airlineLogo}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <span>{selectedFlight.departure.airport.code}</span>
                    <Plane className="w-4 h-4 rotate-90 text-primary" />
                    <span>{selectedFlight.arrival.airport.code}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedFlight.airline} • {selectedFlight.flightNumber} • {selectedFlight.duration}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(searchParams.departDate!, 'EEE, dd MMM yyyy')} • {selectedFlight.departure.time} - {selectedFlight.arrival.time}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">₹{selectedFlight.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                {passengers.length} Traveller(s): {passengers.map((p) => `${p.firstName} ${p.lastName}`).join(', ') || 'Details pending'}
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 shadow-card"
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-success" />
                Secure Payment
              </h3>

              <div className="mb-6">
                <Label className="mb-2 block">Payment Method</Label>
                <Input
                  placeholder="Enter payment method (Card, UPI, Net Banking, Wallet)"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Type 'Card', 'UPI', 'Net Banking', or 'Wallet' to see options.
                </p>
              </div>

              {/* Card Payment Form */}
              {(paymentMethod.toLowerCase().includes('card') || paymentMethod.toLowerCase().includes('credit') || paymentMethod.toLowerCase().includes('debit')) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t"
                >
                  <div>
                    <Label>Card Number</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input
                      placeholder="Name on card"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiry Date</Label>
                      <Input
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        type="password"
                        placeholder="***"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* UPI Form */}
              {paymentMethod.toLowerCase().includes('upi') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-4 border-t"
                >
                  <div>
                    <Label>UPI ID</Label>
                    <Input
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4">
                    {/* Removing buttons, just generic note or input if they want to specify app */}
                    <Input placeholder="Enter UPI App (Optional)" />
                  </div>
                </motion.div>
              )}

              {/* Net Banking */}
              {paymentMethod.toLowerCase().includes('net') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 border-t"
                >
                  <Label>Bank Name</Label>
                  <Input placeholder="Enter Bank Name (e.g. HDFC, SBI)" />
                </motion.div>
              )}

              {/* Wallets */}
              {paymentMethod.toLowerCase().includes('wallet') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 border-t"
                >
                  <Label>Wallet Name</Label>
                  <Input placeholder="Enter Wallet Name (e.g. Paytm, PhonePe)" />
                </motion.div>
              )}
            </motion.div>

            {/* Pay Button */}
            <div className="mt-8">
              <Button
                size="lg"
                className="w-full md:w-auto px-12 py-6 text-lg"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-2" />
                    Pay ₹{getTotalPrice().toLocaleString()}
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="lg:w-80">
            <PriceSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;