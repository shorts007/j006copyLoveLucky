import { useState, useEffect } from "react";
import { MapPin, Phone, Clock, Instagram, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('restaurantSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      contact: {
        phone: '+966 12 631 6360',
        address: 'Al-Kamal Street, Al-Baghdadiyah Al-Sharqiyah, Jeddah 22241, Saudi Arabia'
      }
    };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem('restaurantSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const openInstagram = () => {
    window.open('https://instagram.com/luckydarbarest', '_blank');
  };

  const callRestaurant = () => {
    const phoneNumber = settings.contact.phone.replace(/\s/g, '');
    window.open(`tel:${phoneNumber}`);
  };

  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Lucky+Darbar+JABA7986+Al-Kamal+Street+Jeddah', '_blank');
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-montserrat font-bold">LD</span>
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-lg">Lucky Darbar</h3>
                <p className="text-sm text-background/80">Indian Family Restaurant</p>
              </div>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              Serving authentic Indian and Chinese cuisine in Jeddah since our opening. 
              Experience the warmth of family dining with traditional flavors.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-golden-yellow">⭐</span>
                ))}
              </div>
              <span className="text-sm text-background/80">5/5 TripAdvisor</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-montserrat font-semibold text-lg">Contact Us</h4>
            <div className="space-y-3">
              <button 
                onClick={callRestaurant}
                className="flex items-center gap-3 text-background/80 hover:text-background transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">{settings.contact.phone}</span>
              </button>
              <button 
                onClick={openGoogleMaps}
                className="flex items-start gap-3 text-background/80 hover:text-background transition-colors text-left"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">
                  {settings.contact.address}
                </span>
              </button>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-4">
            <h4 className="font-montserrat font-semibold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Opening Hours
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-background/80">Monday - Sunday</span>
                <span className="text-background">7:00 AM - 12:30 AM</span>
              </div>
              <div className="text-sm text-background/70">
                <p>🌅 Breakfast Available</p>
                <p>🍽️ Lunch & Dinner Served</p>
                <p>📱 Takeout & Delivery</p>
              </div>
            </div>
          </div>

          {/* Quick Links & Social */}
          <div className="space-y-4">
            <h4 className="font-montserrat font-semibold text-lg">Follow Us</h4>
            <button 
              onClick={openInstagram}
              className="flex items-center gap-3 text-background/80 hover:text-background transition-colors"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm">@luckydarbarest</span>
            </button>
            
            <div className="space-y-2 text-sm text-background/70">
              <p>🥘 Signature Dishes:</p>
              <ul className="space-y-1 ml-4">
                <li>• Chicken Tikka</li>
                <li>• Tandoori Specialties</li>
                <li>• Royal Biryani</li>
                <li>• Fresh Kulcha</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-background/70">
              <p>© {currentYear} Lucky Darbar Indian Family Restaurant. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-background/70">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-spice-red fill-current" />
              <span>for authentic flavors</span>
            </div>
          </div>
          <div className="text-center mt-4 text-xs text-background/60">
            <p>Search "Lucky Darbar JABA7986" on Google Maps for precise navigation</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;