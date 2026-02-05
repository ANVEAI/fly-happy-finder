 import { useState, useEffect, useMemo } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { 
   ArrowLeft, 
   SlidersHorizontal, 
   ArrowUpDown,
   Plane,
   X
 } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { Checkbox } from '@/components/ui/checkbox';
 import { Slider } from '@/components/ui/slider';
 import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
 import Header from '@/components/Header';
 import FlightCard from '@/components/FlightCard';
 import { useBooking } from '@/context/BookingContext';
 import { generateFlights, airlines } from '@/data/mockData';
 import { Flight } from '@/types/booking';
 import { format } from 'date-fns';
 
 type SortOption = 'price-low' | 'price-high' | 'duration' | 'departure';
 
 const FlightResults = () => {
   const navigate = useNavigate();
   const { searchParams, setSelectedFlight } = useBooking();
   const [flights, setFlights] = useState<Flight[]>([]);
   const [loading, setLoading] = useState(true);
   const [sortBy, setSortBy] = useState<SortOption>('price-low');
   const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
   const [stopsFilter, setStopsFilter] = useState<number[]>([]);
   const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
   const [isFilterOpen, setIsFilterOpen] = useState(false);
 
   useEffect(() => {
     if (!searchParams.from || !searchParams.to || !searchParams.departDate) {
       navigate('/');
       return;
     }
 
     // Simulate loading
     setLoading(true);
     setTimeout(() => {
       const generatedFlights = generateFlights(
         searchParams.from!,
         searchParams.to!,
         format(searchParams.departDate!, 'yyyy-MM-dd')
       );
       setFlights(generatedFlights);
       
       // Set initial price range based on flights
       const prices = generatedFlights.map(f => f.price);
       setPriceRange([Math.min(...prices), Math.max(...prices)]);
       
       setLoading(false);
     }, 1500);
   }, [searchParams, navigate]);
 
   const filteredAndSortedFlights = useMemo(() => {
     let result = [...flights];
 
     // Filter by airlines
     if (selectedAirlines.length > 0) {
       result = result.filter(f => selectedAirlines.includes(f.airline));
     }
 
     // Filter by stops
     if (stopsFilter.length > 0) {
       result = result.filter(f => stopsFilter.includes(f.stops));
     }
 
     // Filter by price
     result = result.filter(f => f.price >= priceRange[0] && f.price <= priceRange[1]);
 
     // Sort
     switch (sortBy) {
       case 'price-low':
         result.sort((a, b) => a.price - b.price);
         break;
       case 'price-high':
         result.sort((a, b) => b.price - a.price);
         break;
       case 'duration':
         result.sort((a, b) => {
           const aDuration = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1]);
           const bDuration = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1]);
           return aDuration - bDuration;
         });
         break;
       case 'departure':
         result.sort((a, b) => a.departure.time.localeCompare(b.departure.time));
         break;
     }
 
     return result;
   }, [flights, selectedAirlines, stopsFilter, priceRange, sortBy]);
 
   const handleSelectFlight = (flight: Flight) => {
     setSelectedFlight(flight);
     navigate('/passenger-details');
   };
 
   const toggleAirline = (airline: string) => {
     setSelectedAirlines(prev =>
       prev.includes(airline)
         ? prev.filter(a => a !== airline)
         : [...prev, airline]
     );
   };
 
   const toggleStops = (stops: number) => {
     setStopsFilter(prev =>
       prev.includes(stops)
         ? prev.filter(s => s !== stops)
         : [...prev, stops]
     );
   };
 
   const clearFilters = () => {
     setSelectedAirlines([]);
     setStopsFilter([]);
     if (flights.length > 0) {
       const prices = flights.map(f => f.price);
       setPriceRange([Math.min(...prices), Math.max(...prices)]);
     }
   };
 
   const FilterContent = () => (
     <div className="space-y-6">
       {/* Airlines */}
       <div>
         <h4 className="font-semibold mb-3">Airlines</h4>
         <div className="space-y-2">
           {airlines.map((airline) => (
             <label key={airline.code} className="flex items-center gap-2 cursor-pointer">
               <Checkbox
                 checked={selectedAirlines.includes(airline.name)}
                 onCheckedChange={() => toggleAirline(airline.name)}
               />
               <span className="text-sm">{airline.name}</span>
             </label>
           ))}
         </div>
       </div>
 
       {/* Stops */}
       <div>
         <h4 className="font-semibold mb-3">Stops</h4>
         <div className="space-y-2">
           {[0, 1, 2].map((stops) => (
             <label key={stops} className="flex items-center gap-2 cursor-pointer">
               <Checkbox
                 checked={stopsFilter.includes(stops)}
                 onCheckedChange={() => toggleStops(stops)}
               />
               <span className="text-sm">
                 {stops === 0 ? 'Non-stop' : `${stops} Stop${stops > 1 ? 's' : ''}`}
               </span>
             </label>
           ))}
         </div>
       </div>
 
       {/* Price Range */}
       <div>
         <h4 className="font-semibold mb-3">Price Range</h4>
         <div className="px-2">
           <Slider
             min={Math.min(...flights.map(f => f.price))}
             max={Math.max(...flights.map(f => f.price))}
             step={100}
             value={priceRange}
             onValueChange={(value) => setPriceRange(value as [number, number])}
             className="mb-2"
           />
           <div className="flex justify-between text-sm text-muted-foreground">
             <span>₹{priceRange[0].toLocaleString()}</span>
             <span>₹{priceRange[1].toLocaleString()}</span>
           </div>
         </div>
       </div>
 
       <Button variant="outline" onClick={clearFilters} className="w-full">
         Clear All Filters
       </Button>
     </div>
   );
 
   if (!searchParams.from || !searchParams.to) {
     return null;
   }
 
   return (
     <div className="min-h-screen bg-background">
       <Header />
 
       {/* Route Header */}
       <div className="bg-secondary text-secondary-foreground pt-24 pb-8">
         <div className="container mx-auto px-4">
           <Button
             variant="ghost"
             className="text-secondary-foreground/80 mb-4 hover:text-secondary-foreground"
             onClick={() => navigate('/')}
           >
             <ArrowLeft className="w-4 h-4 mr-2" />
             Modify Search
           </Button>
 
           <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-3">
               <div className="text-center">
                 <div className="text-2xl font-bold">{searchParams.from.code}</div>
                 <div className="text-sm opacity-80">{searchParams.from.city}</div>
               </div>
               <Plane className="w-6 h-6 rotate-90 opacity-60" />
               <div className="text-center">
                 <div className="text-2xl font-bold">{searchParams.to.code}</div>
                 <div className="text-sm opacity-80">{searchParams.to.city}</div>
               </div>
             </div>
 
             <div className="flex-1" />
 
             <div className="text-right">
               <div className="text-sm opacity-80">
                 {format(searchParams.departDate!, 'EEE, dd MMM yyyy')}
               </div>
               <div className="text-sm">
                 {searchParams.passengers.adults + searchParams.passengers.children} Traveller(s), {searchParams.class}
               </div>
             </div>
           </div>
         </div>
       </div>
 
       <div className="container mx-auto px-4 py-8">
         <div className="flex gap-8">
           {/* Desktop Filters */}
           <div className="hidden lg:block w-64 flex-shrink-0">
             <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-semibold text-lg">Filters</h3>
                 {(selectedAirlines.length > 0 || stopsFilter.length > 0) && (
                   <Button variant="ghost" size="sm" onClick={clearFilters}>
                     Clear
                   </Button>
                 )}
               </div>
               <FilterContent />
             </div>
           </div>
 
           {/* Main Content */}
           <div className="flex-1">
             {/* Sort & Filter Bar */}
             <div className="flex items-center justify-between mb-6">
               <div className="text-sm text-muted-foreground">
                 {loading ? 'Searching...' : `${filteredAndSortedFlights.length} flights found`}
               </div>
 
               <div className="flex items-center gap-4">
                 {/* Mobile Filter Button */}
                 <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                   <SheetTrigger asChild>
                     <Button variant="outline" className="lg:hidden">
                       <SlidersHorizontal className="w-4 h-4 mr-2" />
                       Filters
                     </Button>
                   </SheetTrigger>
                   <SheetContent>
                     <SheetHeader>
                       <SheetTitle>Filters</SheetTitle>
                     </SheetHeader>
                     <div className="mt-6">
                       <FilterContent />
                     </div>
                   </SheetContent>
                 </Sheet>
 
                 {/* Sort Dropdown */}
                 <div className="flex items-center gap-2">
                   <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value as SortOption)}
                     className="bg-card border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                   >
                     <option value="price-low">Price: Low to High</option>
                     <option value="price-high">Price: High to Low</option>
                     <option value="duration">Duration: Shortest</option>
                     <option value="departure">Departure: Earliest</option>
                   </select>
                 </div>
               </div>
             </div>
 
             {/* Active Filters */}
             {(selectedAirlines.length > 0 || stopsFilter.length > 0) && (
               <div className="flex flex-wrap gap-2 mb-4">
                 {selectedAirlines.map(airline => (
                   <span
                     key={airline}
                     className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                   >
                     {airline}
                     <button onClick={() => toggleAirline(airline)}>
                       <X className="w-3 h-3" />
                     </button>
                   </span>
                 ))}
                 {stopsFilter.map(stops => (
                   <span
                     key={stops}
                     className="inline-flex items-center gap-1 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm"
                   >
                     {stops === 0 ? 'Non-stop' : `${stops} Stop`}
                     <button onClick={() => toggleStops(stops)}>
                       <X className="w-3 h-3" />
                     </button>
                   </span>
                 ))}
               </div>
             )}
 
             {/* Flight List */}
             {loading ? (
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-muted rounded-lg" />
                       <div className="flex-1 space-y-2">
                         <div className="h-4 bg-muted rounded w-1/4" />
                         <div className="h-3 bg-muted rounded w-1/3" />
                       </div>
                       <div className="w-24 h-10 bg-muted rounded" />
                     </div>
                   </div>
                 ))}
               </div>
             ) : filteredAndSortedFlights.length === 0 ? (
               <div className="text-center py-12">
                 <Plane className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                 <h3 className="text-lg font-semibold mb-2">No flights found</h3>
                 <p className="text-muted-foreground">
                   Try adjusting your filters or search criteria
                 </p>
                 <Button onClick={clearFilters} className="mt-4">
                   Clear Filters
                 </Button>
               </div>
             ) : (
               <div className="space-y-4">
                 {filteredAndSortedFlights.map((flight, index) => (
                   <FlightCard
                     key={flight.id}
                     flight={flight}
                     onSelect={handleSelectFlight}
                     index={index}
                   />
                 ))}
               </div>
             )}
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default FlightResults;