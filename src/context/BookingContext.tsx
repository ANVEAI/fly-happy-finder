 import React, { createContext, useContext, useState, ReactNode } from 'react';
 import { Flight, Passenger, SearchParams, Seat } from '@/types/booking';
 
 interface BookingContextType {
   searchParams: SearchParams;
   setSearchParams: (params: SearchParams) => void;
   selectedFlight: Flight | null;
   setSelectedFlight: (flight: Flight | null) => void;
   returnFlight: Flight | null;
   setReturnFlight: (flight: Flight | null) => void;
   passengers: Passenger[];
   setPassengers: (passengers: Passenger[]) => void;
   selectedSeats: Seat[];
   setSelectedSeats: (seats: Seat[]) => void;
   addOns: {
     meals: { passengerId: string; mealId: string; price: number }[];
     baggage: { passengerId: string; baggageId: string; price: number }[];
     insurance: boolean;
   };
   setAddOns: (addOns: BookingContextType['addOns']) => void;
   promoCode: string;
   setPromoCode: (code: string) => void;
   promoDiscount: number;
   setPromoDiscount: (discount: number) => void;
   bookingId: string | null;
   setBookingId: (id: string | null) => void;
   resetBooking: () => void;
   getTotalPrice: () => number;
 }
 
 const defaultSearchParams: SearchParams = {
   from: null,
   to: null,
   departDate: null,
   returnDate: null,
   tripType: 'one-way',
   passengers: {
     adults: 1,
     children: 0,
     infants: 0,
   },
   class: 'economy',
 };
 
 const BookingContext = createContext<BookingContextType | undefined>(undefined);
 
 export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
   const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
   const [returnFlight, setReturnFlight] = useState<Flight | null>(null);
   const [passengers, setPassengers] = useState<Passenger[]>([]);
   const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
   const [addOns, setAddOns] = useState<BookingContextType['addOns']>({
     meals: [],
     baggage: [],
     insurance: false,
   });
   const [promoCode, setPromoCode] = useState('');
   const [promoDiscount, setPromoDiscount] = useState(0);
   const [bookingId, setBookingId] = useState<string | null>(null);
 
   const resetBooking = () => {
     setSearchParams(defaultSearchParams);
     setSelectedFlight(null);
     setReturnFlight(null);
     setPassengers([]);
     setSelectedSeats([]);
     setAddOns({ meals: [], baggage: [], insurance: false });
     setPromoCode('');
     setPromoDiscount(0);
     setBookingId(null);
   };
 
   const getTotalPrice = () => {
     let total = 0;
     
     // Flight prices
     if (selectedFlight) {
       const passengerCount = searchParams.passengers.adults + searchParams.passengers.children;
       total += selectedFlight.price * passengerCount;
     }
     if (returnFlight) {
       const passengerCount = searchParams.passengers.adults + searchParams.passengers.children;
       total += returnFlight.price * passengerCount;
     }
     
     // Seat prices
     total += selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
     
     // Meal prices
     total += addOns.meals.reduce((sum, meal) => sum + meal.price, 0);
     
     // Baggage prices
     total += addOns.baggage.reduce((sum, bag) => sum + bag.price, 0);
     
     // Insurance
     if (addOns.insurance) {
       total += 299 * (searchParams.passengers.adults + searchParams.passengers.children);
     }
     
     // Apply promo discount
     total -= promoDiscount;
     
     return Math.max(0, total);
   };
 
   return (
     <BookingContext.Provider
       value={{
         searchParams,
         setSearchParams,
         selectedFlight,
         setSelectedFlight,
         returnFlight,
         setReturnFlight,
         passengers,
         setPassengers,
         selectedSeats,
         setSelectedSeats,
         addOns,
         setAddOns,
         promoCode,
         setPromoCode,
         promoDiscount,
         setPromoDiscount,
         bookingId,
         setBookingId,
         resetBooking,
         getTotalPrice,
       }}
     >
       {children}
     </BookingContext.Provider>
   );
 };
 
 export const useBooking = () => {
   const context = useContext(BookingContext);
   if (context === undefined) {
     throw new Error('useBooking must be used within a BookingProvider');
   }
   return context;
 };