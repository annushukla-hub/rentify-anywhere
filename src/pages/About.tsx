import { Shield, Users, Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Rentify</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted marketplace for renting anything, anywhere
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-lg text-muted-foreground mb-8">
            Rentify is a comprehensive rental marketplace that connects people who have things to rent
            with people who need them. From properties and vehicles to equipment and electronics,
            we make renting safe, simple, and affordable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
            <div className="p-6 rounded-2xl border bg-card">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground">
                All transactions are protected with secure payment processing and insurance options.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community First</h3>
              <p className="text-muted-foreground">
                Building a trusted community of renters and owners with verified profiles and reviews.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                Making rental accessible to everyone while promoting sustainable consumption.
              </p>
            </div>

            <div className="p-6 rounded-2xl border bg-card">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Customer Care</h3>
              <p className="text-muted-foreground">
                24/7 support team ready to help with any questions or concerns you may have.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-4 mt-16">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Founded in 2024, Rentify started with a simple idea: why buy when you can rent? We noticed
            that many people owned items they rarely used, while others needed those same items but
            couldn't justify the purchase cost.
          </p>
          <p className="text-muted-foreground mb-4">
            Today, we've grown into a thriving marketplace with thousands of listings across multiple
            categories, serving communities in over 50 cities nationwide.
          </p>

          <h2 className="text-3xl font-bold mb-4 mt-16">Join Us</h2>
          <p className="text-muted-foreground mb-8">
            Whether you're looking to rent something you need or make money from items you own,
            Rentify is here to help. Join our growing community today and experience the future
            of rental marketplaces.
          </p>

          <div className="text-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
