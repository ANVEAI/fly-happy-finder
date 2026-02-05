 import { motion } from 'framer-motion';
 import { Plane, Clock, Briefcase, Wifi, Utensils, Zap } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Flight } from '@/types/booking';
 
 interface FlightCardProps {
   flight: Flight;
   onSelect: (flight: Flight) => void;
   index: number;
 }
 
 const FlightCard = ({ flight, onSelect, index }: FlightCardProps) => {
   const amenityIcons: Record<string, React.ReactNode> = {
     'Meal': <Utensils className="w-3 h-3" />,
     'WiFi': <Wifi className="w-3 h-3" />,
     'USB Charging': <Zap className="w-3 h-3" />,
     'Entertainment': <Briefcase className="w-3 h-3" />,
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.3, delay: index * 0.05 }}
       className="flight-card group"
     >
       <div className="flex flex-col lg:flex-row lg:items-center gap-4">
         {/* Airline Info */}
         <div className="flex items-center gap-3 lg:w-36">
           <div className="text-3xl">{flight.airlineLogo}</div>
           <div>
             <div className="font-semibold text-foreground">{flight.airline}</div>
             <div className="text-sm text-muted-foreground">{flight.flightNumber}</div>
           </div>
         </div>
 
         {/* Flight Times */}
         <div className="flex-1 flex items-center justify-between lg:justify-center gap-4">
           {/* Departure */}
           <div className="text-center">
             <div className="text-2xl font-bold text-foreground">{flight.departure.time}</div>
             <div className="text-sm font-medium text-muted-foreground">
               {flight.departure.airport.code}
             </div>
           </div>
 
           {/* Duration & Stops */}
           <div className="flex-1 max-w-xs mx-4">
             <div className="flex items-center gap-2">
               <div className="h-0.5 flex-1 bg-border rounded relative">
                 {flight.stops > 0 && (
                   <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-accent rounded-full" />
                 )}
               </div>
               <Plane className="w-4 h-4 text-primary rotate-90" />
             </div>
             <div className="flex items-center justify-center gap-2 mt-1">
               <Clock className="w-3 h-3 text-muted-foreground" />
               <span className="text-xs text-muted-foreground">{flight.duration}</span>
               <span className="text-xs text-muted-foreground">•</span>
               <span className={`text-xs font-medium ${
                 flight.stops === 0 ? 'text-success' : 'text-accent'
               }`}>
                 {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
               </span>
             </div>
           </div>
 
           {/* Arrival */}
           <div className="text-center">
             <div className="text-2xl font-bold text-foreground">{flight.arrival.time}</div>
             <div className="text-sm font-medium text-muted-foreground">
               {flight.arrival.airport.code}
             </div>
           </div>
         </div>
 
         {/* Price & Book */}
         <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2 lg:w-40">
           <div className="text-right">
             {flight.originalPrice && (
               <div className="text-sm text-muted-foreground line-through">
                 ₹{flight.originalPrice.toLocaleString()}
               </div>
             )}
             <div className="text-2xl font-bold text-foreground">
               ₹{flight.price.toLocaleString()}
             </div>
             <div className="text-xs text-muted-foreground">per person</div>
           </div>
           <Button
             onClick={() => onSelect(flight)}
             className="whitespace-nowrap"
           >
             Book Now
           </Button>
         </div>
       </div>
 
       {/* Expandable Details */}
       <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center gap-4">
         {/* Amenities */}
         <div className="flex items-center gap-2">
           {flight.amenities.slice(0, 4).map((amenity) => (
             <Badge key={amenity} variant="secondary" className="text-xs gap-1">
               {amenityIcons[amenity]}
               {amenity}
             </Badge>
           ))}
         </div>
 
         <div className="flex-1" />
 
         {/* Refund & Seats */}
         <div className="flex items-center gap-3">
           {flight.refundable && (
             <Badge className="bg-success/10 text-success hover:bg-success/20">
               Refundable
             </Badge>
           )}
           <span className="text-sm text-muted-foreground">
             {flight.seatsAvailable} seats left
           </span>
         </div>
       </div>
     </motion.div>
   );
 };
 
 export default FlightCard;