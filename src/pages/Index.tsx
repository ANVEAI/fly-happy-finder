 import { motion } from 'framer-motion';
 import { Plane, Shield, Clock, CreditCard, Star, MapPin } from 'lucide-react';
 import Header from '@/components/Header';
 import FlightSearchForm from '@/components/FlightSearchForm';
 
 const popularDestinations = [
   { city: 'Goa', code: 'GOI', price: '₹2,499', image: '🏖️' },
   { city: 'Mumbai', code: 'BOM', price: '₹2,899', image: '🌆' },
   { city: 'Bangalore', code: 'BLR', price: '₹3,199', image: '🏙️' },
   { city: 'Jaipur', code: 'JAI', price: '₹2,299', image: '🏰' },
 ];
 
 const features = [
   {
     icon: Shield,
     title: 'Secure Booking',
     description: 'Your payments are 100% safe with our encrypted checkout.',
   },
   {
     icon: Clock,
     title: 'Instant Confirmation',
     description: 'Get your e-ticket instantly after booking.',
   },
   {
     icon: CreditCard,
     title: 'Easy Payments',
     description: 'Multiple payment options including UPI, cards & wallets.',
   },
   {
     icon: Star,
     title: 'Best Prices',
     description: 'Price match guarantee on all domestic flights.',
   },
 ];
 
 const Index = () => {
   return (
     <div className="min-h-screen bg-background">
       <Header />
 
       {/* Hero Section */}
       <section className="relative min-h-[85vh] bg-hero overflow-hidden">
         {/* Animated Plane */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <motion.div
             initial={{ x: '-100%', y: 0 }}
             animate={{ x: '100vw', y: [0, -30, 0] }}
             transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
             className="absolute top-32 text-4xl opacity-20"
           >
             ✈️
           </motion.div>
         </div>
 
         {/* Decorative Elements */}
         <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
         <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
 
         <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
           {/* Hero Content */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center mb-12"
           >
             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
               Book Your Next
               <span className="block text-gradient bg-gradient-to-r from-orange-300 to-orange-100">
                 Adventure
               </span>
             </h1>
             <p className="text-lg text-white/80 max-w-2xl mx-auto">
               Search and compare flights from 100+ airlines. Get the best deals on domestic and international flights.
             </p>
           </motion.div>
 
           {/* Search Form */}
           <FlightSearchForm />
         </div>
 
         {/* Wave Decoration */}
         <div className="absolute bottom-0 left-0 right-0">
           <svg viewBox="0 0 1440 120" fill="none" className="w-full">
             <path
               d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
               fill="hsl(var(--background))"
             />
           </svg>
         </div>
       </section>
 
       {/* Popular Destinations */}
       <section className="py-16">
         <div className="container mx-auto px-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             className="text-center mb-12"
           >
             <h2 className="text-3xl font-bold text-foreground mb-2">
               Popular Destinations
             </h2>
             <p className="text-muted-foreground">
               Explore our most booked flight routes
             </p>
           </motion.div>
 
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {popularDestinations.map((dest, index) => (
               <motion.div
                 key={dest.code}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="group cursor-pointer"
               >
                 <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all group-hover:-translate-y-1">
                   <div className="text-5xl mb-4">{dest.image}</div>
                   <div className="flex items-center gap-1 text-muted-foreground mb-1">
                     <MapPin className="w-3 h-3" />
                     <span className="text-xs">{dest.code}</span>
                   </div>
                   <h3 className="text-lg font-semibold text-foreground mb-1">
                     {dest.city}
                   </h3>
                   <p className="text-sm text-primary font-medium">
                     From {dest.price}
                   </p>
                 </div>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Features */}
       <section className="py-16 bg-muted/50">
         <div className="container mx-auto px-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             className="text-center mb-12"
           >
             <h2 className="text-3xl font-bold text-foreground mb-2">
               Why Book With Us
             </h2>
             <p className="text-muted-foreground">
               Experience hassle-free booking with amazing benefits
             </p>
           </motion.div>
 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {features.map((feature, index) => (
               <motion.div
                 key={feature.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="bg-card rounded-xl p-6 shadow-card text-center"
               >
                 <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                   <feature.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-lg font-semibold text-foreground mb-2">
                   {feature.title}
                 </h3>
                 <p className="text-sm text-muted-foreground">
                   {feature.description}
                 </p>
               </motion.div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Footer */}
       <footer className="bg-secondary text-secondary-foreground py-12">
         <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2">
               <Plane className="w-6 h-6" />
               <span className="text-xl font-bold">SkyBook</span>
             </div>
             <p className="text-sm text-secondary-foreground/70">
               © 2024 SkyBook. All rights reserved. ✈️ Happy travels!
             </p>
           </div>
         </div>
       </footer>
     </div>
   );
 };
 
 export default Index;
