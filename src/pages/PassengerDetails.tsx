 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { ArrowLeft, ArrowRight, User, Utensils, Briefcase, Shield } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
 import Header from '@/components/Header';
 import BookingSteps from '@/components/BookingSteps';
 import SeatMap from '@/components/SeatMap';
 import PriceSummary from '@/components/PriceSummary';
 import { useBooking } from '@/context/BookingContext';
 import { meals, baggageOptions } from '@/data/mockData';
 import { Passenger } from '@/types/booking';
 
 const steps = [
   { id: 1, label: 'Flight', description: 'Select flight' },
   { id: 2, label: 'Passengers', description: 'Enter details' },
   { id: 3, label: 'Payment', description: 'Complete booking' },
   { id: 4, label: 'Confirmation', description: 'Get ticket' },
 ];
 
 const PassengerDetails = () => {
   const navigate = useNavigate();
   const { searchParams, selectedFlight, passengers, setPassengers, addOns, setAddOns } = useBooking();
   const [activeTab, setActiveTab] = useState('details');
   const [errors, setErrors] = useState<Record<string, string>>({});
 
   const totalPassengers = searchParams.passengers.adults + searchParams.passengers.children;
 
   useEffect(() => {
     if (!selectedFlight) {
       navigate('/');
       return;
     }
 
     // Initialize passengers if empty
     if (passengers.length === 0) {
       const initialPassengers: Passenger[] = [];
       
       for (let i = 0; i < searchParams.passengers.adults; i++) {
         initialPassengers.push({
           id: `adult-${i}`,
           title: 'Mr',
           firstName: '',
           lastName: '',
           age: 30,
           type: 'adult',
           email: i === 0 ? '' : undefined,
           phone: i === 0 ? '' : undefined,
         });
       }
       
       for (let i = 0; i < searchParams.passengers.children; i++) {
         initialPassengers.push({
           id: `child-${i}`,
           title: 'Master',
           firstName: '',
           lastName: '',
           age: 8,
           type: 'child',
         });
       }
 
       setPassengers(initialPassengers);
     }
   }, [selectedFlight, navigate, passengers.length, searchParams.passengers, setPassengers]);
 
   const updatePassenger = (id: string, field: keyof Passenger, value: any) => {
     setPassengers(
       passengers.map((p) => (p.id === id ? { ...p, [field]: value } : p))
     );
     // Clear error when user types
     if (errors[`${id}-${field}`]) {
       setErrors((prev) => {
         const newErrors = { ...prev };
         delete newErrors[`${id}-${field}`];
         return newErrors;
       });
     }
   };
 
   const updateMeal = (passengerId: string, mealId: string, price: number) => {
     const existingMealIndex = addOns.meals.findIndex((m) => m.passengerId === passengerId);
     const newMeals = [...addOns.meals];
     
     if (existingMealIndex >= 0) {
       if (mealId === 'none') {
         newMeals.splice(existingMealIndex, 1);
       } else {
         newMeals[existingMealIndex] = { passengerId, mealId, price };
       }
     } else if (mealId !== 'none') {
       newMeals.push({ passengerId, mealId, price });
     }
     
     setAddOns({ ...addOns, meals: newMeals });
   };
 
   const updateBaggage = (passengerId: string, baggageId: string, price: number) => {
     const existingIndex = addOns.baggage.findIndex((b) => b.passengerId === passengerId);
     const newBaggage = [...addOns.baggage];
     
     if (existingIndex >= 0) {
       if (baggageId === 'none') {
         newBaggage.splice(existingIndex, 1);
       } else {
         newBaggage[existingIndex] = { passengerId, baggageId, price };
       }
     } else if (baggageId !== 'none') {
       newBaggage.push({ passengerId, baggageId, price });
     }
     
     setAddOns({ ...addOns, baggage: newBaggage });
   };
 
   const validateForm = () => {
     const newErrors: Record<string, string> = {};
     
     passengers.forEach((p) => {
       if (!p.firstName.trim()) {
         newErrors[`${p.id}-firstName`] = 'First name is required';
       }
       if (!p.lastName.trim()) {
         newErrors[`${p.id}-lastName`] = 'Last name is required';
       }
       if (p.type === 'adult' && p.email !== undefined && !p.email.trim()) {
         newErrors[`${p.id}-email`] = 'Email is required';
       }
       if (p.type === 'adult' && p.phone !== undefined && !p.phone.trim()) {
         newErrors[`${p.id}-phone`] = 'Phone is required';
       }
     });
 
     setErrors(newErrors);
     return Object.keys(newErrors).length === 0;
   };
 
   const handleContinue = () => {
     if (validateForm()) {
       navigate('/payment');
     }
   };
 
   if (!selectedFlight) {
     return null;
   }
 
   return (
     <div className="min-h-screen bg-background">
       <Header />
 
       {/* Steps Header */}
       <div className="bg-card border-b pt-20">
         <div className="container mx-auto px-4">
           <BookingSteps currentStep={2} steps={steps} />
         </div>
       </div>
 
       <div className="container mx-auto px-4 py-8">
         <div className="flex flex-col lg:flex-row gap-8">
           {/* Main Content */}
           <div className="flex-1">
             <Button
               variant="ghost"
               className="mb-6"
               onClick={() => navigate('/flights')}
             >
               <ArrowLeft className="w-4 h-4 mr-2" />
               Back to Flights
             </Button>
 
             <Tabs value={activeTab} onValueChange={setActiveTab}>
               <TabsList className="grid w-full grid-cols-3 mb-6">
                 <TabsTrigger value="details" className="gap-2">
                   <User className="w-4 h-4" />
                   Traveller Details
                 </TabsTrigger>
                 <TabsTrigger value="seats" className="gap-2">
                   <Briefcase className="w-4 h-4" />
                   Seat Selection
                 </TabsTrigger>
                 <TabsTrigger value="addons" className="gap-2">
                   <Utensils className="w-4 h-4" />
                   Add-ons
                 </TabsTrigger>
               </TabsList>
 
               {/* Traveller Details Tab */}
               <TabsContent value="details">
                 <div className="space-y-6">
                   {passengers.map((passenger, index) => (
                     <motion.div
                       key={passenger.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.1 }}
                       className="bg-card rounded-xl p-6 shadow-card"
                     >
                       <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                         <User className="w-5 h-5 text-primary" />
                         {passenger.type === 'adult' ? 'Adult' : 'Child'} {index + 1}
                         {index === 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Primary Contact</span>}
                       </h3>
 
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                         <div>
                           <Label>Title</Label>
                           <Select
                             value={passenger.title}
                             onValueChange={(value) => updatePassenger(passenger.id, 'title', value)}
                           >
                             <SelectTrigger>
                               <SelectValue />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="Mr">Mr</SelectItem>
                               <SelectItem value="Mrs">Mrs</SelectItem>
                               <SelectItem value="Ms">Ms</SelectItem>
                               <SelectItem value="Master">Master</SelectItem>
                               <SelectItem value="Miss">Miss</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
 
                         <div>
                           <Label>First Name</Label>
                           <Input
                             placeholder="First name"
                             value={passenger.firstName}
                             onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                             className={errors[`${passenger.id}-firstName`] ? 'border-destructive' : ''}
                           />
                           {errors[`${passenger.id}-firstName`] && (
                             <p className="text-destructive text-xs mt-1">{errors[`${passenger.id}-firstName`]}</p>
                           )}
                         </div>
 
                         <div>
                           <Label>Last Name</Label>
                           <Input
                             placeholder="Last name"
                             value={passenger.lastName}
                             onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                             className={errors[`${passenger.id}-lastName`] ? 'border-destructive' : ''}
                           />
                           {errors[`${passenger.id}-lastName`] && (
                             <p className="text-destructive text-xs mt-1">{errors[`${passenger.id}-lastName`]}</p>
                           )}
                         </div>
 
                         <div>
                           <Label>Age</Label>
                           <Input
                             type="number"
                             min={passenger.type === 'adult' ? 12 : 2}
                             max={passenger.type === 'adult' ? 120 : 11}
                             value={passenger.age}
                             onChange={(e) => updatePassenger(passenger.id, 'age', parseInt(e.target.value))}
                           />
                         </div>
                       </div>
 
                       {/* Contact info for primary passenger */}
                       {index === 0 && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                           <div>
                             <Label>Email</Label>
                             <Input
                               type="email"
                               placeholder="email@example.com"
                               value={passenger.email || ''}
                               onChange={(e) => updatePassenger(passenger.id, 'email', e.target.value)}
                               className={errors[`${passenger.id}-email`] ? 'border-destructive' : ''}
                             />
                             {errors[`${passenger.id}-email`] && (
                               <p className="text-destructive text-xs mt-1">{errors[`${passenger.id}-email`]}</p>
                             )}
                           </div>
                           <div>
                             <Label>Phone</Label>
                             <Input
                               type="tel"
                               placeholder="+91 98765 43210"
                               value={passenger.phone || ''}
                               onChange={(e) => updatePassenger(passenger.id, 'phone', e.target.value)}
                               className={errors[`${passenger.id}-phone`] ? 'border-destructive' : ''}
                             />
                             {errors[`${passenger.id}-phone`] && (
                               <p className="text-destructive text-xs mt-1">{errors[`${passenger.id}-phone`]}</p>
                             )}
                           </div>
                         </div>
                       )}
                     </motion.div>
                   ))}
                 </div>
               </TabsContent>
 
               {/* Seat Selection Tab */}
               <TabsContent value="seats">
                 <SeatMap passengerCount={totalPassengers} />
               </TabsContent>
 
               {/* Add-ons Tab */}
               <TabsContent value="addons">
                 <div className="space-y-6">
                   {/* Meals */}
                   <div className="bg-card rounded-xl p-6 shadow-card">
                     <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                       <Utensils className="w-5 h-5 text-primary" />
                       Meal Preferences
                     </h3>
                     
                     <div className="space-y-4">
                       {passengers.map((passenger) => (
                         <div key={passenger.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-muted/50 rounded-lg">
                           <div className="md:w-40">
                             <span className="font-medium">
                               {passenger.firstName || `${passenger.type === 'adult' ? 'Adult' : 'Child'}`}
                             </span>
                           </div>
                           <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                             <button
                               onClick={() => updateMeal(passenger.id, 'none', 0)}
                               className={`p-3 rounded-lg border text-sm transition-colors ${
                                 !addOns.meals.find((m) => m.passengerId === passenger.id)
                                   ? 'border-primary bg-primary/10'
                                   : 'border-border hover:border-primary/50'
                               }`}
                             >
                               No Meal
                             </button>
                             {meals.map((meal) => (
                               <button
                                 key={meal.id}
                                 onClick={() => updateMeal(passenger.id, meal.id, meal.price)}
                                 className={`p-3 rounded-lg border text-sm transition-colors ${
                                   addOns.meals.find((m) => m.passengerId === passenger.id && m.mealId === meal.id)
                                     ? 'border-primary bg-primary/10'
                                     : 'border-border hover:border-primary/50'
                                 }`}
                               >
                                 <div className="font-medium">{meal.name}</div>
                                 <div className="text-muted-foreground">₹{meal.price}</div>
                               </button>
                             ))}
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
 
                   {/* Baggage */}
                   <div className="bg-card rounded-xl p-6 shadow-card">
                     <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-primary" />
                       Extra Baggage
                     </h3>
                     
                     <div className="space-y-4">
                       {passengers.map((passenger) => (
                         <div key={passenger.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-muted/50 rounded-lg">
                           <div className="md:w-40">
                             <span className="font-medium">
                               {passenger.firstName || `${passenger.type === 'adult' ? 'Adult' : 'Child'}`}
                             </span>
                           </div>
                           <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-2">
                             {baggageOptions.map((option) => (
                               <button
                                 key={option.id}
                                 onClick={() => updateBaggage(passenger.id, option.id, option.price)}
                                 className={`p-3 rounded-lg border text-sm transition-colors ${
                                   (option.id === 'none' && !addOns.baggage.find((b) => b.passengerId === passenger.id)) ||
                                   addOns.baggage.find((b) => b.passengerId === passenger.id && b.baggageId === option.id)
                                     ? 'border-primary bg-primary/10'
                                     : 'border-border hover:border-primary/50'
                                 }`}
                               >
                                 <div className="font-medium text-xs">{option.name}</div>
                                 {option.price > 0 && (
                                   <div className="text-muted-foreground">₹{option.price}</div>
                                 )}
                               </button>
                             ))}
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
 
                   {/* Travel Insurance */}
                   <div className="bg-card rounded-xl p-6 shadow-card">
                     <div className="flex items-start justify-between">
                       <div className="flex items-start gap-4">
                         <div className="p-3 rounded-xl bg-success/10 text-success">
                           <Shield className="w-6 h-6" />
                         </div>
                         <div>
                           <h3 className="font-semibold text-lg">Travel Insurance</h3>
                           <p className="text-sm text-muted-foreground mt-1">
                             Get covered for trip cancellation, delays, and medical emergencies.
                             ₹299 per person.
                           </p>
                         </div>
                       </div>
                       <Switch
                         checked={addOns.insurance}
                         onCheckedChange={(checked) => setAddOns({ ...addOns, insurance: checked })}
                       />
                     </div>
                   </div>
                 </div>
               </TabsContent>
             </Tabs>
 
             {/* Continue Button */}
             <div className="mt-8 flex justify-end">
               <Button size="lg" onClick={handleContinue} className="px-8">
                 Continue to Payment
                 <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
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
 
 export default PassengerDetails;