 import { Airport, Flight } from '@/types/booking';
 
 export const airports: Airport[] = [
   { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International', country: 'India' },
   { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International', country: 'India' },
   { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International', country: 'India' },
   { code: 'MAA', city: 'Chennai', name: 'Chennai International', country: 'India' },
   { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International', country: 'India' },
   { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International', country: 'India' },
   { code: 'GOI', city: 'Goa', name: 'Dabolim Airport', country: 'India' },
   { code: 'COK', city: 'Kochi', name: 'Cochin International', country: 'India' },
   { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
   { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International', country: 'India' },
   { code: 'JAI', city: 'Jaipur', name: 'Jaipur International', country: 'India' },
   { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International', country: 'India' },
 ];
 
 export const airlines = [
   { name: 'IndiGo', code: '6E', logo: '✈️' },
   { name: 'Air India', code: 'AI', logo: '🛫' },
   { name: 'SpiceJet', code: 'SG', logo: '🔴' },
   { name: 'Vistara', code: 'UK', logo: '💜' },
   { name: 'GoAir', code: 'G8', logo: '🟢' },
   { name: 'AirAsia India', code: 'I5', logo: '🔴' },
 ];
 
 export const generateFlights = (from: Airport, to: Airport, date: string): Flight[] => {
   const flights: Flight[] = [];
   const times = ['06:00', '08:30', '10:15', '12:45', '14:30', '16:00', '18:30', '20:00', '22:15'];
   
   times.forEach((time, index) => {
     const airline = airlines[index % airlines.length];
     const duration = Math.floor(Math.random() * 2) + 1;
     const durationMinutes = Math.floor(Math.random() * 45) + 15;
     const stops = index % 3 === 0 ? 0 : index % 3 === 1 ? 1 : 0;
     const basePrice = 2500 + Math.floor(Math.random() * 5000);
     
     const departHour = parseInt(time.split(':')[0]);
     const departMinute = parseInt(time.split(':')[1]);
     const arrivalHour = (departHour + duration + (stops > 0 ? 1 : 0)) % 24;
     const arrivalMinute = (departMinute + durationMinutes) % 60;
     
     flights.push({
       id: `FL${index + 1}${from.code}${to.code}`,
       airline: airline.name,
       airlineLogo: airline.logo,
       flightNumber: `${airline.code}${1000 + Math.floor(Math.random() * 9000)}`,
       departure: {
         airport: from,
         time,
         date,
       },
       arrival: {
         airport: to,
         time: `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`,
         date,
       },
       duration: `${duration}h ${durationMinutes}m`,
       stops,
       stopDetails: stops > 0 ? ['Via ' + airports[Math.floor(Math.random() * airports.length)].city] : undefined,
       price: basePrice,
       originalPrice: index % 2 === 0 ? basePrice + Math.floor(basePrice * 0.15) : undefined,
       seatsAvailable: Math.floor(Math.random() * 20) + 1,
       class: 'economy',
       amenities: ['Meal', 'WiFi', 'USB Charging', 'Entertainment'],
       refundable: index % 3 === 0,
     });
   });
   
   return flights.sort((a, b) => a.price - b.price);
 };
 
 export const generateSeats = () => {
   const seats = [];
   const columns = ['A', 'B', 'C', 'D', 'E', 'F'];
   const occupiedSeats = new Set<string>();
   
   // Randomly mark some seats as occupied
   for (let i = 0; i < 30; i++) {
     const row = Math.floor(Math.random() * 30) + 1;
     const col = columns[Math.floor(Math.random() * 6)];
     occupiedSeats.add(`${row}${col}`);
   }
   
   for (let row = 1; row <= 30; row++) {
     for (const col of columns) {
       const seatId = `${row}${col}`;
       const isExit = row === 10 || row === 20;
       const isPremium = row <= 3;
       
       seats.push({
         id: seatId,
         row,
         column: col,
         type: isPremium ? 'premium' : isExit ? 'exit-row' : 'standard',
         price: isPremium ? 800 : isExit ? 500 : 200,
         isAvailable: !occupiedSeats.has(seatId),
         isSelected: false,
       });
     }
   }
   
   return seats;
 };
 
 export const meals = [
   { id: 'veg', name: 'Vegetarian Meal', price: 350, description: 'Fresh vegetarian options' },
   { id: 'non-veg', name: 'Non-Vegetarian Meal', price: 400, description: 'Chicken/Fish options' },
   { id: 'vegan', name: 'Vegan Meal', price: 400, description: 'Plant-based meal' },
   { id: 'jain', name: 'Jain Meal', price: 350, description: 'No onion, no garlic' },
 ];
 
 export const baggageOptions = [
   { id: 'none', name: 'Cabin Bag Only (7kg)', price: 0 },
   { id: '15kg', name: '15 kg Check-in', price: 500 },
   { id: '20kg', name: '20 kg Check-in', price: 750 },
   { id: '25kg', name: '25 kg Check-in', price: 1000 },
   { id: '30kg', name: '30 kg Check-in', price: 1250 },
 ];