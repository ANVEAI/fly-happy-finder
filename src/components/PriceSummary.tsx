 import { motion } from 'framer-motion';
 import { useBooking } from '@/context/BookingContext';
 import { ChevronDown, ChevronUp, Tag, Shield } from 'lucide-react';
 import { useState } from 'react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 
 const PriceSummary = () => {
   const { 
     searchParams, 
     selectedFlight, 
     returnFlight, 
     selectedSeats, 
     addOns,
     promoCode,
     setPromoCode,
     promoDiscount,
     setPromoDiscount,
     getTotalPrice 
   } = useBooking();
   
   const [isExpanded, setIsExpanded] = useState(true);
   const [promoInput, setPromoInput] = useState('');
   const [promoError, setPromoError] = useState('');
 
   const passengerCount = searchParams.passengers.adults + searchParams.passengers.children;
 
   const applyPromo = () => {
     const validCodes: Record<string, number> = {
       'SAVE10': 0.1,
       'FIRST50': 50,
       'FLY500': 500,
     };
 
     const code = promoInput.toUpperCase();
     if (validCodes[code]) {
       const discount = typeof validCodes[code] === 'number' && validCodes[code] < 1
         ? getTotalPrice() * validCodes[code]
         : validCodes[code];
       setPromoDiscount(discount);
       setPromoCode(code);
       setPromoError('');
     } else {
       setPromoError('Invalid promo code');
       setPromoDiscount(0);
       setPromoCode('');
     }
   };
 
   if (!selectedFlight) return null;
 
   const flightTotal = (selectedFlight.price + (returnFlight?.price || 0)) * passengerCount;
   const seatTotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
   const mealTotal = addOns.meals.reduce((sum, m) => sum + m.price, 0);
   const baggageTotal = addOns.baggage.reduce((sum, b) => sum + b.price, 0);
   const insuranceTotal = addOns.insurance ? 299 * passengerCount : 0;
 
   return (
     <motion.div
       initial={{ opacity: 0, x: 20 }}
       animate={{ opacity: 1, x: 0 }}
       className="bg-card rounded-xl shadow-card sticky top-24"
     >
       {/* Header */}
       <button
         onClick={() => setIsExpanded(!isExpanded)}
         className="w-full flex items-center justify-between p-4 border-b"
       >
         <h3 className="font-semibold text-lg">Price Summary</h3>
         {isExpanded ? (
           <ChevronUp className="w-5 h-5 text-muted-foreground" />
         ) : (
           <ChevronDown className="w-5 h-5 text-muted-foreground" />
         )}
       </button>
 
       {isExpanded && (
         <div className="p-4 space-y-4">
           {/* Flight Fare */}
           <div className="space-y-2">
             <div className="flex justify-between text-sm">
               <span className="text-muted-foreground">
                 Base Fare ({passengerCount} traveller{passengerCount > 1 ? 's' : ''})
               </span>
               <span>₹{flightTotal.toLocaleString()}</span>
             </div>
 
             {seatTotal > 0 && (
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Seat Selection</span>
                 <span>₹{seatTotal.toLocaleString()}</span>
               </div>
             )}
 
             {mealTotal > 0 && (
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Meals</span>
                 <span>₹{mealTotal.toLocaleString()}</span>
               </div>
             )}
 
             {baggageTotal > 0 && (
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Extra Baggage</span>
                 <span>₹{baggageTotal.toLocaleString()}</span>
               </div>
             )}
 
             {insuranceTotal > 0 && (
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground flex items-center gap-1">
                   <Shield className="w-3 h-3" />
                   Travel Insurance
                 </span>
                 <span>₹{insuranceTotal.toLocaleString()}</span>
               </div>
             )}
 
             {promoDiscount > 0 && (
               <div className="flex justify-between text-sm text-success">
                 <span className="flex items-center gap-1">
                   <Tag className="w-3 h-3" />
                   Promo ({promoCode})
                 </span>
                 <span>-₹{promoDiscount.toLocaleString()}</span>
               </div>
             )}
           </div>
 
           {/* Promo Code */}
           <div className="pt-4 border-t">
             <div className="flex gap-2">
               <Input
                 placeholder="Enter promo code"
                 value={promoInput}
                 onChange={(e) => setPromoInput(e.target.value)}
                 className="flex-1"
               />
               <Button variant="outline" onClick={applyPromo}>
                 Apply
               </Button>
             </div>
             {promoError && (
               <p className="text-destructive text-sm mt-1">{promoError}</p>
             )}
             <p className="text-xs text-muted-foreground mt-2">
               Try: SAVE10, FIRST50, FLY500
             </p>
           </div>
 
           {/* Total */}
           <div className="pt-4 border-t">
             <div className="flex justify-between items-center">
               <span className="font-semibold text-lg">Total Amount</span>
               <span className="text-2xl font-bold text-primary">
                 ₹{getTotalPrice().toLocaleString()}
               </span>
             </div>
           </div>
         </div>
       )}
     </motion.div>
   );
 };
 
 export default PriceSummary;