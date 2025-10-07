import { RentalItem } from '@/types/rental';
import { MapPin, Star, Heart, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BookingModal } from './BookingModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface RentalCardProps {
  rental: RentalItem;
  variant?: 'grid' | 'list';
}

export const RentalCard = ({ rental, variant = 'grid' }: RentalCardProps) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'rent' | 'buy'>('rent');

  useEffect(() => {
    if (user) {
      checkFavoriteStatus();
    }
  }, [user, rental.id]);

  const checkFavoriteStatus = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('listing_id', rental.id)
      .single();

    setIsFavorite(!!data);
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', rental.id);

      if (!error) {
        setIsFavorite(false);
        toast.success('Removed from favorites');
      }
    } else {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          listing_id: rental.id,
        });

      if (!error) {
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    }
  };

  const handleBookClick = (type: 'rent' | 'buy') => {
    setTransactionType(type);
    setBookingModalOpen(true);
  };

  if (variant === 'list') {
    return (
      <>
        <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 animate-fade-in">
          <div className="relative w-full md:w-72 h-64 md:h-48 flex-shrink-0">
            <img
              src={rental.image}
              alt={rental.title}
              className="w-full h-full object-cover rounded-xl"
            />
            <button
              onClick={toggleFavorite}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:scale-110 transition-transform"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
              />
            </button>
            {rental.instantBooking && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                Instant Book
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-semibold mb-1 hover:text-primary transition-colors cursor-pointer">
                  {rental.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{rental.location}</span>
                  {rental.distance && <span>• {rental.distance} mi</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rental.rating}</span>
                <span className="text-sm text-muted-foreground">({rental.reviewCount})</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {rental.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {rental.features.slice(0, 4).map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs bg-muted rounded-full flex items-center gap-1"
                >
                  <span>{feature.icon}</span>
                  <span>{feature.label}</span>
                </span>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-3">
                {rental.hasDelivery && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" />
                    Free Delivery
                  </span>
                )}
                {rental.hasInsurance && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-primary" />
                    Insurance
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  {rental.listingType === 'both' || rental.listingType === 'rent' ? (
                    <>
                      <p className="text-2xl font-bold text-primary">
                        ${rental.price}
                      </p>
                      <p className="text-xs text-muted-foreground">per {rental.priceUnit.replace('ly', '')}</p>
                    </>
                  ) : (
                    <p className="text-2xl font-bold text-primary">
                      ${rental.buyPrice}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {(rental.listingType === 'rent' || rental.listingType === 'both') && (
                    <button 
                      onClick={() => handleBookClick('rent')}
                      className="px-6 py-2 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium shadow-md whitespace-nowrap"
                    >
                      Rent Now
                    </button>
                  )}
                  {(rental.listingType === 'buy' || rental.listingType === 'both') && (
                    <button 
                      onClick={() => handleBookClick('buy')}
                      className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors font-medium shadow-md whitespace-nowrap"
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <BookingModal
          rental={rental}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          transactionType={transactionType}
        />
      </>
    );
  }

  return (
    <>
      <div className="group rounded-2xl border bg-card overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in">
        <div className="relative h-56 overflow-hidden">
          <img
            src={rental.image}
            alt={rental.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <button
            onClick={toggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/90 backdrop-blur-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`}
            />
          </button>
          {rental.instantBooking && (
            <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full shadow-md">
              Instant Book
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
              {rental.title}
            </h3>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{rental.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{rental.location}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {rental.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-muted rounded-full"
              >
                {feature.icon} {feature.label}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {rental.listingType === 'both' || rental.listingType === 'rent' ? (
                <>
                  <p className="text-2xl font-bold text-primary">
                    ${rental.price}
                  </p>
                  <p className="text-xs text-muted-foreground">per {rental.priceUnit.replace('ly', '')}</p>
                </>
              ) : (
                <p className="text-2xl font-bold text-primary">
                  ${rental.buyPrice}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {(rental.listingType === 'rent' || rental.listingType === 'both') && (
                <button 
                  onClick={() => handleBookClick('rent')}
                  className="px-5 py-2 bg-gradient-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium text-sm shadow-md"
                >
                  Rent
                </button>
              )}
              {(rental.listingType === 'buy' || rental.listingType === 'both') && (
                <button 
                  onClick={() => handleBookClick('buy')}
                  className="px-5 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors font-medium text-sm shadow-md"
                >
                  Buy
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <BookingModal
        rental={rental}
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        transactionType={transactionType}
      />
    </>
  );
};
