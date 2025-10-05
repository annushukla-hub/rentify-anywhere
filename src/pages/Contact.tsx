import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Have questions? We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border bg-card">
              <Mail className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Email Us</h3>
              <a href="mailto:support@rentify.com" className="text-muted-foreground hover:text-primary">
                support@rentify.com
              </a>
            </div>

            <div className="p-6 rounded-2xl border bg-card">
              <Phone className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary">
                +1 (234) 567-890
              </a>
            </div>

            <div className="p-6 rounded-2xl border bg-card">
              <MapPin className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-muted-foreground">
                123 Rental Street<br />
                San Francisco, CA 94102
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 rounded-2xl border bg-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity font-semibold shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
