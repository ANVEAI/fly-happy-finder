import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  ArrowLeftRight,
  Calendar,
  Users,
  Search,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { airports } from '@/data/mockData';
import { useBooking } from '@/context/BookingContext';
import { Airport } from '@/types/booking';
import { format } from 'date-fns';

const FlightSearchForm = () => {
  const navigate = useNavigate();
  const { searchParams, setSearchParams } = useBooking();
  const [dateOpen, setDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);
  const [passengersOpen, setPassengersOpen] = useState(false);

  const tripTypes = [
    { value: 'one-way', label: 'One Way' },
    { value: 'round-trip', label: 'Round Trip' },
    { value: 'multi-city', label: 'Multi City' },
  ];

  const classTypes = [
    { value: 'economy', label: 'Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' },
  ];

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

  const updatePassengers = (type: 'adults' | 'children' | 'infants', delta: number) => {
    const newValue = searchParams.passengers[type] + delta;
    if (type === 'adults' && newValue < 1) return;
    if (newValue < 0) return;
    if (type === 'infants' && newValue > searchParams.passengers.adults) return;

    setSearchParams({
      ...searchParams,
      passengers: {
        ...searchParams.passengers,
        [type]: newValue,
      },
    });
  };

  const totalPassengers =
    searchParams.passengers.adults +
    searchParams.passengers.children +
    searchParams.passengers.infants;

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
      {/* Trip Type Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tripTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSearchParams({ ...searchParams, tripType: type.value as any })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${searchParams.tripType === type.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            {type.label}
          </button>
        ))}
        <div className="flex-1" />
        {classTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSearchParams({ ...searchParams, class: type.value as any })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${searchParams.class === type.value
                ? 'bg-secondary text-secondary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
          >
            {type.label}
          </button>
        ))}
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
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button className="input-flight w-full flex items-center gap-2 text-left">
                <Calendar className="w-5 h-5 text-primary" />
                {searchParams.departDate ? (
                  <span className="font-semibold">
                    {format(searchParams.departDate, 'dd MMM')}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Select date</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={searchParams.departDate || undefined}
                onSelect={(date) => {
                  setSearchParams({ ...searchParams, departDate: date || null });
                  setDateOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date (for round trip) */}
        {searchParams.tripType === 'round-trip' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-muted-foreground mb-2">Return</label>
            <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
              <PopoverTrigger asChild>
                <button className="input-flight w-full flex items-center gap-2 text-left">
                  <Calendar className="w-5 h-5 text-accent" />
                  {searchParams.returnDate ? (
                    <span className="font-semibold">
                      {format(searchParams.returnDate, 'dd MMM')}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Select date</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={searchParams.returnDate || undefined}
                  onSelect={(date) => {
                    setSearchParams({ ...searchParams, returnDate: date || null });
                    setReturnDateOpen(false);
                  }}
                  disabled={(date) =>
                    date < new Date() ||
                    (searchParams.departDate ? date < searchParams.departDate : false)
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Passengers */}
        <div className={searchParams.tripType === 'round-trip' ? 'md:col-span-1' : 'md:col-span-2'}>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Travellers</label>
          <Popover open={passengersOpen} onOpenChange={setPassengersOpen}>
            <PopoverTrigger asChild>
              <button className="input-flight w-full flex items-center gap-2 text-left">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold">{totalPassengers}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="end">
              <div className="space-y-4">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-muted-foreground">12+ years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updatePassengers('adults', -1)}
                      disabled={searchParams.passengers.adults <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {searchParams.passengers.adults}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updatePassengers('adults', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-muted-foreground">2-11 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updatePassengers('children', -1)}
                      disabled={searchParams.passengers.children <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {searchParams.passengers.children}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updatePassengers('children', 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Infants */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Infants</div>
                    <div className="text-sm text-muted-foreground">Under 2 years</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updatePassengers('infants', -1)}
                      disabled={searchParams.passengers.infants <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {searchParams.passengers.infants}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updatePassengers('infants', 1)}
                      disabled={searchParams.passengers.infants >= searchParams.passengers.adults}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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