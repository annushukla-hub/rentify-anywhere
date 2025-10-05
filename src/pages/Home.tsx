import { HeroSearch } from '@/components/feature/HeroSearch';
import { RentalCard } from '@/components/feature/RentalCard';
import { mockRentals } from '@/mocks/rentals';
import { TrendingUp, Shield, Clock, Award, Search } from 'lucide-react';

const Home = () => {
  const featuredRentals = mockRentals.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Rent Anything,
              <br />
              <span className="text-secondary">Anywhere</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              From properties and vehicles to equipment and electronics - your trusted marketplace for all rentals
            </p>
          </div>

          <HeroSearch />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center animate-slide-up">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-sm text-muted-foreground">Active Listings</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">5K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Rentals</h2>
            <p className="text-lg text-muted-foreground">Discover our handpicked selection of top-rated rentals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredRentals.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))}
          </div>

          <div className="text-center">
            <a
              href="/browse"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg"
            >
              View All Rentals
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow animate-slide-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-light flex items-center justify-center">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Search</h3>
              <p className="text-muted-foreground">Browse thousands of rental listings in your area</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/20 flex items-center justify-center">
                <Clock className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Book</h3>
              <p className="text-muted-foreground">Choose your dates and confirm your reservation</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-lg transition-shadow animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/20 flex items-center justify-center">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Enjoy</h3>
              <p className="text-muted-foreground">Pick up your rental and start your adventure</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Rentify?</h2>
            <p className="text-lg text-muted-foreground">Your trusted partner for secure and convenient rentals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">Protected transactions with secure payment processing</p>
            </div>

            <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Verified Listings</h3>
              <p className="text-sm text-muted-foreground">All rentals are verified for quality and authenticity</p>
            </div>

            <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Round-the-clock customer service for your convenience</p>
            </div>

            <div className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
              <TrendingUp className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
              <p className="text-sm text-muted-foreground">Competitive rates with transparent pricing</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
