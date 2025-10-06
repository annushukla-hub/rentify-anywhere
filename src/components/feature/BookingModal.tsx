import { useState } from 'react';
import { RentalItem } from '@/types/rental';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BookingModalProps {
  rental: RentalItem;
  isOpen: boolean;
  onClose: () => void;
  transactionType: 'rent' | 'buy';
}

export const BookingModal = ({ rental, isOpen, onClose, transactionType }: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    if (transactionType === 'buy') {
      return rental.buyPrice || 0;
    }

    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (rental.priceUnit) {
      case 'daily':
        return rental.price * days;
      case 'weekly':
        return rental.price * Math.ceil(days / 7);
      case 'monthly':
        return rental.price * Math.ceil(days / 30);
      case 'hourly':
        return rental.price * days * 24;
      default:
        return 0;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to book');
      navigate('/auth/signin');
      return;
    }

    if (transactionType === 'rent' && (!startDate || !endDate)) {
      toast.error('Please select dates');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('bookings').insert({
        listing_id: rental.id,
        renter_id: user.id,
        transaction_type: transactionType,
        start_date: transactionType === 'rent' ? startDate : new Date().toISOString(),
        end_date: transactionType === 'rent' ? endDate : null,
        total_price: calculateTotal(),
        notes: notes || null,
      });

      if (error) throw error;

      toast.success(transactionType === 'buy' ? 'Purchase initiated!' : 'Booking request sent!');
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transactionType === 'buy' ? 'Purchase' : 'Book'} {rental.title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {transactionType === 'rent' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special requests or questions..."
              className="w-full px-4 py-2 rounded-lg border bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">${calculateTotal().toFixed(2)}</p>
                {transactionType === 'rent' && startDate && endDate && (
                  <p className="text-xs text-muted-foreground">
                    {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Processing...' : transactionType === 'buy' ? 'Purchase' : 'Book Now'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
