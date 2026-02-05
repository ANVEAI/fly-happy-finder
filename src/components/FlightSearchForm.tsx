import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  ArrowLeftRight,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBooking } from '@/context/BookingContext';
import { format, parse, isValid } from 'date-fns';

const FlightSearchForm = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useBooking();

  // Local state for text inputs to allow free typing before validation/commit
  const [departDateStr, setDepartDateStr] = useState('');
  const [returnDateStr, setReturnDateStr] = useState('');

  const swapAirports = () => {
    const tempFrom = searchParams.from;
    setSearchParams({
      ...searchParams,
      from: searchParams.to,
      to: tempFrom,
    });
  };

  const handleSearch = () => {
    if (searchParams.from && searchParams.to && searchParams.departDate) {
      navigate('/flights');
    }
  };

  const updatePassengers = (type: 'adults' | 'children' | 'infants', value: string) => {
    const num = parseInt(value) || 0;
    if (num < 0) return;

    setSearchParams({
      ...searchParams,
      passengers: {
        ...searchParams.passengers,
        [type]: num,
      },
    });
  };

  const handleDateChange = (dateString: string, type: 'depart' | 'return') => {
    if (type === 'depart') setDepartDateStr(dateString);
    else setReturnDateStr(dateString);

    // Try to parse date (assuming format YYYY-MM-DD for simplicity in text input, or allow user to type)
    // Using simple new Date() for "freely type" requirement often implies a standard format or loose parsing.
    // Let's try to parse YYYY-MM-DD
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      if (type === 'depart') setSearchParams({ ...searchParams, departDate: date });
      else setSearchParams({ ...searchParams, returnDate: date });
    }
  };

  const handleFromChange = (value: string) => {
    setSearchParams({
      ...searchParams,
      from: value ? {
        code: value.substring(0, 3).toUpperCase(),
        city: value,
        name: `${value} International Airport`,
        country: 'Unknown'
      } : null
    });
  };

  const handleToChange = (value: string) => {
    setSearchParams({
      ...searchParams,
      to: value ? {
        code: value.substring(0, 3).toUpperCase(),
        city: value,
        name: `${value} International Airport`,
        country: 'Unknown'
      } : null
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="search-card w-full max-w-5xl mx-auto"
    >
      {/* Trip Type & Class Selection - Text Inputs */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Trip Type</label>
          <Input
            placeholder="e.g. One Way, Round Trip"
            value={searchParams.tripType}
            onChange={(e) => setSearchParams({ ...searchParams, tripType: e.target.value as any })}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Class</label>
          <Input
            placeholder="e.g. Economy, Business"
            value={searchParams.class}
            onChange={(e) => setSearchParams({ ...searchParams, class: e.target.value as any })}
          />
        </div>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* From */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-muted-foreground mb-2">From</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary rotate-45" />
            <Input
              placeholder="From City"
              className="pl-10 h-14 text-lg"
              value={searchParams.from?.city || ''}
              onChange={(e) => handleFromChange(e.target.value)}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="md:col-span-1 flex justify-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            onClick={swapAirports}
          >
            <ArrowLeftRight className="w-5 h-5" />
          </Button>
        </div>

        {/* To */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-muted-foreground mb-2">To</label>
          <div className="relative">
            <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent -rotate-45" />
            <Input
              placeholder="To City"
              className="pl-10 h-14 text-lg"
              value={searchParams.to?.city || ''}
              onChange={(e) => handleToChange(e.target.value)}
            />
          </div>
        </div>

        {/* Departure Date */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Departure</label>
          <Input
            placeholder="YYYY-MM-DD"
            className="h-14"
            onChange={(e) => handleDateChange(e.target.value, 'depart')}
          />
        </div>

        {/* Return Date */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Return</label>
          <Input
            placeholder="YYYY-MM-DD"
            className="h-14"
            onChange={(e) => handleDateChange(e.target.value, 'return')}
            disabled={searchParams.tripType !== 'round-trip'}
          />
        </div>
      </div>

      {/* Passengers - Text Inputs */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Adults (12+)</label>
          <Input
            type="text"
            placeholder="Number of adults"
            value={searchParams.passengers.adults}
            onChange={(e) => updatePassengers('adults', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Children (2-11)</label>
          <Input
            type="text"
            placeholder="Number of children"
            value={searchParams.passengers.children}
            onChange={(e) => updatePassengers('children', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Infants (&lt;2)</label>
          <Input
            type="text"
            placeholder="Number of infants"
            value={searchParams.passengers.infants}
            onChange={(e) => updatePassengers('infants', e.target.value)}
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6 flex justify-center">
        <Button
          size="lg"
          className="px-12 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          onClick={handleSearch}
          disabled={!searchParams.from || !searchParams.to || !searchParams.departDate}
        >
          <Search className="w-5 h-5 mr-2" />
          Search Flights
        </Button>
      </div>
    </motion.div>
  );
};

export default FlightSearchForm;