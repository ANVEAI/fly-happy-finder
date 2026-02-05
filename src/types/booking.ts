 export interface Airport {
   code: string;
   city: string;
   name: string;
   country: string;
 }
 
 export interface Flight {
   id: string;
   airline: string;
   airlineLogo: string;
   flightNumber: string;
   departure: {
     airport: Airport;
     time: string;
     date: string;
   };
   arrival: {
     airport: Airport;
     time: string;
     date: string;
   };
   duration: string;
   stops: number;
   stopDetails?: string[];
   price: number;
   originalPrice?: number;
   seatsAvailable: number;
   class: 'economy' | 'business' | 'first';
   amenities: string[];
   refundable: boolean;
 }
 
 export interface Passenger {
   id: string;
   title: string;
   firstName: string;
   lastName: string;
   age: number;
   type: 'adult' | 'child' | 'infant';
   email?: string;
   phone?: string;
   seatNumber?: string;
   meal?: string;
   baggage?: string;
 }
 
 export interface SearchParams {
   from: Airport | null;
   to: Airport | null;
   departDate: Date | null;
   returnDate: Date | null;
   tripType: 'one-way' | 'round-trip' | 'multi-city';
   passengers: {
     adults: number;
     children: number;
     infants: number;
   };
   class: 'economy' | 'business' | 'first';
 }
 
 export interface Booking {
   id: string;
   flight: Flight;
   returnFlight?: Flight;
   passengers: Passenger[];
   totalPrice: number;
   addOns: {
     meals: number;
     baggage: number;
     seats: number;
     insurance: number;
   };
   promoCode?: string;
   promoDiscount?: number;
   status: 'pending' | 'confirmed' | 'cancelled';
   createdAt: Date;
 }
 
 export interface Seat {
   id: string;
   row: number;
   column: string;
   type: 'standard' | 'premium' | 'extra-legroom' | 'exit-row';
   price: number;
   isAvailable: boolean;
   isSelected: boolean;
 }