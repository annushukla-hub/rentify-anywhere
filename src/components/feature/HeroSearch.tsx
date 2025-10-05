import { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HeroSearch = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [location, setLocation] = useState('');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'property', label: 'Properties' },
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'electronics', label: 'Electronics' },
  ];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (location) params.set('location', location);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-xl border p-6 md:p-8 animate-scale-in">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Category Select */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">What to rent?</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Where?</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, state or zip code"
                className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-3 bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg hover:shadow-glow flex items-center justify-center gap-2"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-muted-foreground mb-3">Popular categories:</p>
          <div className="flex flex-wrap gap-2">
            {categories.slice(1).map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setCategory(cat.value);
                  setTimeout(handleSearch, 100);
                }}
                className="px-4 py-2 text-sm rounded-full border hover:border-primary hover:bg-primary-light hover:text-primary transition-colors"
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
