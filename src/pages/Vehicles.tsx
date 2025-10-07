import { useState } from 'react';
import { RentalCard } from '@/components/feature/RentalCard';
import { mockRentals } from '@/mocks/rentals';
import { Car } from 'lucide-react';

const Vehicles = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const allVehicles = mockRentals.filter(rental => rental.category === 'vehicle');
  const vehicles = selectedType === 'all' 
    ? allVehicles 
    : allVehicles.filter(rental => rental.subCategory === selectedType.toLowerCase());

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light mb-4">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Vehicle Rentals</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Rent cars, motorcycles, SUVs, and more for your next adventure
          </p>
        </div>

        {/* Vehicle Types */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {['All', 'Car', 'SUV', 'Motorcycle', 'Truck', 'Luxury'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type.toLowerCase())}
              className={`px-5 py-2 rounded-full transition-colors text-sm font-medium ${
                selectedType === type.toLowerCase()
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{vehicles.length}</span> vehicles
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((rental) => (
            <RentalCard key={rental.id} rental={rental} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
