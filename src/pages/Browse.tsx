import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RentalCard } from '@/components/feature/RentalCard';
import { supabase } from '@/integrations/supabase/client';
import { RentalItem, RentalCategory, ListingType } from '@/types/rental';
import { Search, Grid3x3, List, MapPin } from 'lucide-react';

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [listings, setListings] = useState<RentalItem[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<RentalItem[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'all');
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        profiles:owner_id (
          full_name,
          avatar_url,
          verified
        )
      `)
      .eq('available', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading listings:', error);
      setLoading(false);
      return;
    }

    const transformedListings: RentalItem[] = (data || []).map((listing: any) => ({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      category: listing.category as RentalCategory,
      subCategory: listing.sub_category,
      location: listing.location,
      price: listing.rent_price || listing.buy_price || 0,
      priceUnit: listing.rent_unit as any || 'daily',
      image: listing.images?.[0] || '/placeholder.svg',
      rating: 4.5,
      reviewCount: 0,
      condition: listing.condition as any,
      features: Array.isArray(listing.features) ? listing.features : [],
      hasDelivery: listing.has_delivery || false,
      hasInsurance: listing.has_insurance || false,
      instantBooking: listing.instant_booking || false,
      listingType: listing.listing_type as ListingType,
      buyPrice: listing.buy_price || undefined,
      owner: {
        name: listing.profiles?.full_name || 'Unknown',
        avatar: listing.profiles?.avatar_url || '/placeholder.svg',
        verified: listing.profiles?.verified || false,
      },
    }));

    setListings(transformedListings);
    setLoading(false);
  };

  const categories = [
    { value: 'all', label: 'All Categories', count: listings.length },
    { value: 'property', label: 'Properties', count: listings.filter(r => r.category === 'property').length },
    { value: 'vehicle', label: 'Vehicles', count: listings.filter(r => r.category === 'vehicle').length },
    { value: 'equipment', label: 'Equipment', count: listings.filter(r => r.category === 'equipment').length },
  ];

  useEffect(() => {
    let results = [...listings];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      results = results.filter(rental => rental.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      results = results.filter(rental =>
        rental.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rental.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        results.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        break;
    }

    setFilteredRentals(results);
  }, [listings, selectedCategory, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Rentals</h1>
          <p className="text-muted-foreground">Discover the perfect rental for your needs</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location or keyword..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border bg-card focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex gap-2 border rounded-xl p-1 bg-muted/30">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filteredRentals.length}</span> results
          </p>
        </div>

        {/* Rental Grid/List */}
        {filteredRentals.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'flex flex-col gap-6'
            }
          >
            {filteredRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} variant={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary-hover transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
