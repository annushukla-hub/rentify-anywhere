import { useState } from 'react';
import { RentalCard } from '@/components/feature/RentalCard';
import { mockRentals } from '@/mocks/rentals';
import { Wrench } from 'lucide-react';

const Equipment = () => {
  const equipment = mockRentals.filter(rental => rental.category === 'equipment');

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-light mb-4">
            <Wrench className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Equipment Rentals</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From construction tools to photography gear - rent professional equipment for any project
          </p>
        </div>

        {/* Equipment Types */}
        <div className="mb-8 flex flex-wrap gap-3 justify-center">
          {['All', 'Construction', 'Photography', 'Audio/Video', 'Sports', 'Party'].map((type) => (
            <button
              key={type}
              className="px-5 py-2 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium"
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{equipment.length}</span> items
          </p>
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {equipment.map((rental) => (
            <RentalCard key={rental.id} rental={rental} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Equipment;
