 import { useState } from 'react';
 import { Link, useLocation } from 'react-router-dom';
 import { Plane, Menu, X, User, Phone, HelpCircle } from 'lucide-react';
 import { Button } from '@/components/ui/button';
 import { motion, AnimatePresence } from 'framer-motion';
 
 const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const location = useLocation();
   const isHomePage = location.pathname === '/';
 
   return (
     <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
       isHomePage ? 'bg-transparent' : 'bg-card shadow-card'
     }`}>
       <div className="container mx-auto px-4">
         <div className="flex items-center justify-between h-16 md:h-20">
           {/* Logo */}
           <Link to="/" className="flex items-center gap-2 group">
             <div className={`p-2 rounded-xl transition-colors ${
               isHomePage ? 'bg-white/20' : 'bg-primary/10'
             }`}>
               <Plane className={`w-6 h-6 transition-transform group-hover:rotate-12 ${
                 isHomePage ? 'text-white' : 'text-primary'
               }`} />
             </div>
             <span className={`text-xl font-bold ${
               isHomePage ? 'text-white' : 'text-foreground'
             }`}>
               SkyBook
             </span>
           </Link>
 
           {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center gap-6">
             <Link 
               to="/" 
               className={`text-sm font-medium transition-colors hover:text-primary ${
                 isHomePage ? 'text-white/80 hover:text-white' : 'text-muted-foreground'
               }`}
             >
               Flights
             </Link>
             <span className={`text-sm ${isHomePage ? 'text-white/50' : 'text-muted-foreground/50'}`}>
               Hotels
             </span>
             <span className={`text-sm ${isHomePage ? 'text-white/50' : 'text-muted-foreground/50'}`}>
               Holidays
             </span>
           </nav>
 
           {/* Desktop Actions */}
           <div className="hidden md:flex items-center gap-4">
             <Button 
               variant="ghost" 
               size="sm"
               className={isHomePage ? 'text-white hover:bg-white/10' : ''}
             >
               <Phone className="w-4 h-4 mr-2" />
               Support
             </Button>
             <Button 
               variant={isHomePage ? 'outline' : 'default'}
               size="sm"
               className={isHomePage ? 'border-white/30 text-white hover:bg-white/10' : ''}
             >
               <User className="w-4 h-4 mr-2" />
               Login
             </Button>
           </div>
 
           {/* Mobile Menu Button */}
           <Button
             variant="ghost"
             size="icon"
             className={`md:hidden ${isHomePage ? 'text-white' : ''}`}
             onClick={() => setIsMenuOpen(!isMenuOpen)}
           >
             {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </Button>
         </div>
       </div>
 
       {/* Mobile Menu */}
       <AnimatePresence>
         {isMenuOpen && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: 'auto' }}
             exit={{ opacity: 0, height: 0 }}
             className="md:hidden bg-card border-t"
           >
             <div className="container mx-auto px-4 py-4 space-y-4">
               <Link to="/" className="block py-2 text-foreground font-medium">
                 Flights
               </Link>
               <span className="block py-2 text-muted-foreground">Hotels</span>
               <span className="block py-2 text-muted-foreground">Holidays</span>
               <hr className="border-border" />
               <Button variant="outline" className="w-full justify-start">
                 <Phone className="w-4 h-4 mr-2" />
                 Support
               </Button>
               <Button className="w-full">
                 <User className="w-4 h-4 mr-2" />
                 Login / Sign Up
               </Button>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </header>
   );
 };
 
 export default Header;