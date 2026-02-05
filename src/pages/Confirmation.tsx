 import { useEffect } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { 
   CheckCircle2, 
   Download, 
   Mail, 
   Plane, 
   Calendar,
   Clock,
   Users,
   MapPin,
   Home,
   Hotel,
   Car
 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import Header from '@/components/Header';
 import BookingSteps from '@/components/BookingSteps';
 import { useBooking } from '@/context/BookingContext';
 import { format } from 'date-fns';
 
 const steps = [
   { id: 1, label: 'Flight', description: 'Select flight' },
   { id: 2, label: 'Passengers', description: 'Enter details' },
   { id: 3, label: 'Payment', description: 'Complete booking' },
   { id: 4, label: 'Confirmation', description: 'Get ticket' },
 ];
 
 const relatedServices = [
   { icon: Hotel, title: 'Book a Hotel', description: 'Find stays near your destination', color: 'bg-accent' },
   { icon: Car, title: 'Rent a Car', description: 'Explore with convenience', color: 'bg-success' },
 ];
 
 const Confirmation = () => {
   const navigate = useNavigate();
   const { selectedFlight, searchParams, passengers, bookingId, selectedSeats, getTotalPrice, resetBooking } = useBooking();
 
   useEffect(() => {
     if (!selectedFlight || !bookingId) {
       navigate('/');
     }
   }, [selectedFlight, bookingId, navigate]);
 
   if (!selectedFlight || !bookingId) {
     return null;
   }
 
   const handleNewBooking = () => {
     resetBooking();
     navigate('/');
   };
 
   return (
     <div className="min-h-screen bg-background">
       <Header />
 
       {/* Steps Header */}
       <div className="bg-card border-b pt-20">
         <div className="container mx-auto px-4">
           <BookingSteps currentStep={4} steps={steps} />
         </div>
       </div>
 
       <div className="container mx-auto px-4 py-8">
         {/* Success Message */}
         <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="text-center mb-8"
         >
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
             className="inline-flex p-4 rounded-full bg-success/10 text-success mb-4"
           >
             <CheckCircle2 className="w-16 h-16" />
           </motion.div>
           <h1 className="text-3xl font-bold text-foreground mb-2">
             Booking Confirmed!
           </h1>
           <p className="text-muted-foreground">
             Your flight has been booked successfully. A confirmation email has been sent.
           </p>
         </motion.div>
 
         <div className="max-w-3xl mx-auto">
           {/* Booking Details Card */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-card rounded-xl shadow-card overflow-hidden mb-6"
           >
             {/* Booking ID Header */}
             <div className="bg-secondary text-secondary-foreground p-6">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                   <div className="text-sm opacity-80">Booking Reference</div>
                   <div className="text-2xl font-bold">{bookingId}</div>
                 </div>
                 <div className="flex gap-2">
                   <Button variant="secondary" size="sm">
                     <Download className="w-4 h-4 mr-2" />
                     Download Ticket
                   </Button>
                   <Button variant="secondary" size="sm">
                     <Mail className="w-4 h-4 mr-2" />
                     Email Ticket
                   </Button>
                 </div>
               </div>
             </div>
 
             {/* Flight Details */}
             <div className="p-6">
               <div className="flex items-center gap-4 mb-6">
                 <div className="text-4xl">{selectedFlight.airlineLogo}</div>
                 <div>
                   <div className="font-semibold text-lg">{selectedFlight.airline}</div>
                   <div className="text-muted-foreground">{selectedFlight.flightNumber}</div>
                 </div>
               </div>
 
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* From */}
                 <div className="text-center md:text-left">
                   <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground mb-1">
                     <MapPin className="w-4 h-4" />
                     <span>From</span>
                   </div>
                   <div className="text-2xl font-bold">{selectedFlight.departure.time}</div>
                   <div className="font-medium">{selectedFlight.departure.airport.city}</div>
                   <div className="text-sm text-muted-foreground">{selectedFlight.departure.airport.name}</div>
                 </div>
 
                 {/* Duration */}
                 <div className="text-center flex flex-col items-center justify-center">
                   <div className="flex items-center gap-2 text-muted-foreground mb-2">
                     <Clock className="w-4 h-4" />
                     <span>{selectedFlight.duration}</span>
                   </div>
                   <div className="w-full h-0.5 bg-border relative">
                     <Plane className="w-5 h-5 text-primary absolute left-1/2 -translate-x-1/2 -top-2.5 rotate-90" />
                   </div>
                   <div className="text-sm text-muted-foreground mt-2">
                     {selectedFlight.stops === 0 ? 'Non-stop' : `${selectedFlight.stops} Stop`}
                   </div>
                 </div>
 
                 {/* To */}
                 <div className="text-center md:text-right">
                   <div className="flex items-center justify-center md:justify-end gap-2 text-muted-foreground mb-1">
                     <MapPin className="w-4 h-4" />
                     <span>To</span>
                   </div>
                   <div className="text-2xl font-bold">{selectedFlight.arrival.time}</div>
                   <div className="font-medium">{selectedFlight.arrival.airport.city}</div>
                   <div className="text-sm text-muted-foreground">{selectedFlight.arrival.airport.name}</div>
                 </div>
               </div>
 
               <div className="mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                 <div>
                   <div className="flex items-center gap-1 text-muted-foreground mb-1">
                     <Calendar className="w-3 h-3" />
                     <span>Date</span>
                   </div>
                   <div className="font-medium">
                     {format(searchParams.departDate!, 'EEE, dd MMM yyyy')}
                   </div>
                 </div>
                 <div>
                   <div className="flex items-center gap-1 text-muted-foreground mb-1">
                     <Users className="w-3 h-3" />
                     <span>Travellers</span>
                   </div>
                   <div className="font-medium">{passengers.length} Passenger(s)</div>
                 </div>
                 <div>
                   <div className="text-muted-foreground mb-1">Class</div>
                   <div className="font-medium capitalize">{searchParams.class}</div>
                 </div>
                 <div>
                   <div className="text-muted-foreground mb-1">Seats</div>
                   <div className="font-medium">
                     {selectedSeats.length > 0
                       ? selectedSeats.map((s) => s.id).join(', ')
                       : 'Auto-assigned'}
                   </div>
                 </div>
               </div>
             </div>
 
             {/* Passenger List */}
             <div className="border-t p-6">
               <h3 className="font-semibold mb-4">Passenger Details</h3>
               <div className="space-y-3">
                 {passengers.map((passenger, index) => (
                   <div
                     key={passenger.id}
                     className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                         {index + 1}
                       </div>
                       <div>
                         <div className="font-medium">
                           {passenger.title} {passenger.firstName} {passenger.lastName}
                         </div>
                         <div className="text-sm text-muted-foreground capitalize">
                           {passenger.type} • {passenger.age} years
                         </div>
                       </div>
                     </div>
                     {selectedSeats[index] && (
                       <div className="text-sm">
                         Seat: <span className="font-medium">{selectedSeats[index].id}</span>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
 
             {/* Total Amount */}
             <div className="border-t bg-muted/30 p-6">
               <div className="flex items-center justify-between">
                 <span className="text-lg">Total Amount Paid</span>
                 <span className="text-2xl font-bold text-primary">
                   ₹{getTotalPrice().toLocaleString()}
                 </span>
               </div>
             </div>
           </motion.div>
 
           {/* Related Services */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.5 }}
             className="mb-8"
           >
             <h3 className="font-semibold text-lg mb-4">Complete Your Trip</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {relatedServices.map((service) => (
                 <div
                   key={service.title}
                   className="bg-card rounded-xl p-6 shadow-card flex items-center gap-4 cursor-pointer hover:shadow-elevated transition-shadow"
                 >
                   <div className={`p-3 rounded-xl ${service.color} text-white`}>
                     <service.icon className="w-6 h-6" />
                   </div>
                   <div>
                     <div className="font-semibold">{service.title}</div>
                     <div className="text-sm text-muted-foreground">{service.description}</div>
                   </div>
                 </div>
               ))}
             </div>
           </motion.div>
 
           {/* Actions */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.7 }}
             className="text-center"
           >
             <Button onClick={handleNewBooking} size="lg" className="px-8">
               <Home className="w-4 h-4 mr-2" />
               Book Another Flight
             </Button>
           </motion.div>
         </div>
       </div>
     </div>
   );
 };
 
 export default Confirmation;