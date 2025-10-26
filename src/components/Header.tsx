import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Clock, MapPin, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('restaurantSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      contact: {
        phone: '+966 12 631 6360',
        address: 'Al-Kamal Street, Jeddah'
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top bar with contact info */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-muted-foreground border-b border-border/50">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>{settings.contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Open Daily: 7:00 AM - 12:30 AM</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{settings.contact.address.split(',')[0]}, Jeddah</span>
          </div>
        </div>

        {/* Main navigation */}
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-montserrat font-bold text-lg">LD</span>
            </div>
            <div>
              <h1 className="font-montserrat font-bold text-xl text-foreground">Lucky Darbar</h1>
              <p className="text-sm text-muted-foreground">Indian Family Restaurant</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Menu
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('reviews')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Reviews
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Contact
            </button>
            {user && !isAdmin && (
              <a 
                href="/setup"
                className="text-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
              >
                <Shield className="w-4 h-4" />
                Setup
              </a>
            )}
            {isAdmin && (
              <a 
                href="/admin"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Admin
              </a>
            )}
            {!user && (
              <a 
                href="/auth"
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                Login
              </a>
            )}
            <a href="/order">
              <Button variant="default" size="lg">
                Order Online
              </Button>
            </a>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => scrollToSection('booking')}
            >
              Book Table
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Menu
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('reviews')}
                className="text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                Contact
              </button>
              {user && !isAdmin && (
                <a href="/setup" className="w-full">
                  <Button variant="outline" size="lg" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Setup Admin
                  </Button>
                </a>
              )}
              {isAdmin && (
                <a href="/admin" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">
                    Admin Panel
                  </Button>
                </a>
              )}
              {!user && (
                <a href="/auth" className="w-full">
                  <Button variant="outline" size="lg" className="w-full">
                    Login
                  </Button>
                </a>
              )}
              <a href="/order" className="w-full">
                <Button variant="default" size="lg" className="w-full">
                  Order Online
                </Button>
              </a>
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={() => scrollToSection('booking')}
              >
                Book Table
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;