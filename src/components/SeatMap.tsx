 import { useState, useEffect } from 'react';
 import { motion } from 'framer-motion';
 import { generateSeats } from '@/data/mockData';
 import { Seat } from '@/types/booking';
 import { useBooking } from '@/context/BookingContext';
 
 interface SeatMapProps {
   passengerCount: number;
 }
 
 const SeatMap = ({ passengerCount }: SeatMapProps) => {
   const { selectedSeats, setSelectedSeats } = useBooking();
   const [seats, setSeats] = useState<Seat[]>([]);
 
   useEffect(() => {
     setSeats(generateSeats());
   }, []);
 
   const handleSeatClick = (seat: Seat) => {
     if (!seat.isAvailable) return;
 
     const isAlreadySelected = selectedSeats.find((s) => s.id === seat.id);
     
     if (isAlreadySelected) {
       setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
     } else if (selectedSeats.length < passengerCount) {
       setSelectedSeats([...selectedSeats, { ...seat, isSelected: true }]);
     }
   };
 
   const getSeatClass = (seat: Seat) => {
     const isSelected = selectedSeats.find((s) => s.id === seat.id);
     
     if (!seat.isAvailable) return 'seat seat-occupied';
     if (isSelected) return 'seat seat-selected';
     if (seat.type === 'premium') return 'seat seat-premium';
     return 'seat seat-available';
   };
 
   const columns = ['A', 'B', 'C', '', 'D', 'E', 'F'];
   const rows = Array.from({ length: 30 }, (_, i) => i + 1);
 
   return (
     <div className="bg-card rounded-xl p-6 shadow-card">
       <div className="flex items-center justify-between mb-6">
         <h3 className="text-lg font-semibold">Select Your Seats</h3>
         <span className="text-sm text-muted-foreground">
           {selectedSeats.length} of {passengerCount} selected
         </span>
       </div>
 
       {/* Legend */}
       <div className="flex flex-wrap gap-4 mb-6 text-sm">
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-accent/20 border-2 border-accent" />
           <span>Available</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-primary" />
           <span>Selected</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-muted" />
           <span>Occupied</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-6 h-6 rounded bg-purple-100 border-2 border-purple-300" />
           <span>Premium (₹800)</span>
         </div>
       </div>
 
       {/* Seat Map */}
       <div className="overflow-x-auto">
         <div className="min-w-fit mx-auto">
           {/* Plane Nose */}
           <div className="flex justify-center mb-4">
             <div className="w-24 h-8 bg-muted rounded-t-full" />
           </div>
 
           {/* Column Headers */}
           <div className="flex justify-center gap-1 mb-2">
             {columns.map((col, idx) => (
               <div
                 key={idx}
                 className={`w-8 h-6 md:w-10 flex items-center justify-center text-sm font-medium text-muted-foreground ${
                   col === '' ? 'w-4 md:w-6' : ''
                 }`}
               >
                 {col}
               </div>
             ))}
           </div>
 
           {/* Rows */}
           <div className="space-y-1">
             {rows.map((row) => (
               <motion.div
                 key={row}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: row * 0.02 }}
                 className="flex justify-center gap-1 items-center"
               >
                 {columns.map((col, idx) => {
                   if (col === '') {
                     return (
                       <div key={idx} className="w-4 md:w-6 flex items-center justify-center text-xs text-muted-foreground">
                         {row}
                       </div>
                     );
                   }
                   
                   const seat = seats.find((s) => s.row === row && s.column === col);
                   if (!seat) return <div key={idx} className="w-8 h-8 md:w-10 md:h-10" />;
 
                   return (
                     <button
                       key={seat.id}
                       onClick={() => handleSeatClick(seat)}
                       className={getSeatClass(seat)}
                       disabled={!seat.isAvailable}
                       title={`Seat ${seat.id} - ₹${seat.price}`}
                     >
                       {seat.column}
                     </button>
                   );
                 })}
               </motion.div>
             ))}
           </div>
 
           {/* Plane Tail */}
           <div className="flex justify-center mt-4">
             <div className="w-16 h-4 bg-muted rounded-b-lg" />
           </div>
         </div>
       </div>
 
       {/* Selected Seats Summary */}
       {selectedSeats.length > 0 && (
         <div className="mt-6 pt-4 border-t">
           <div className="flex flex-wrap gap-2">
             {selectedSeats.map((seat) => (
               <span
                 key={seat.id}
                 className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
               >
                 Seat {seat.id} - ₹{seat.price}
               </span>
             ))}
           </div>
           <div className="mt-2 text-right font-semibold">
             Total: ₹{selectedSeats.reduce((sum, s) => sum + s.price, 0)}
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default SeatMap;