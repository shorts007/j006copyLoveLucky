import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Navigation, Instagram, Globe } from "lucide-react";

const ContactSection = () => {
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

  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Lucky+Darbar+JABA7986+Al-Kamal+Street+Jeddah', '_blank');
  };

  const callRestaurant = () => {
    const phoneNumber = settings.contact.phone.replace(/\s/g, '');
    window.open(`tel:${phoneNumber}`);
  };

  const openInstagram = () => {
    window.open('https://instagram.com/luckydarbarest', '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
            Visit <span className="gradient-text">Lucky Darbar</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Find us in the heart of Jeddah's Al-Baghdadiyah Al-Sharqiyah district, easily accessible and ready to serve you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="hover-lift shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-hero rounded-xl text-primary-foreground flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-montserrat font-semibold text-xl mb-2 text-foreground">
                      Our Location
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {settings.contact.address}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={openGoogleMaps}
                      className="hover-lift"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-hero rounded-xl text-primary-foreground flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-montserrat font-semibold text-xl mb-2 text-foreground">
                      Contact Us
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      For reservations, inquiries, or takeout orders
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={callRestaurant}
                      className="hover-lift"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      {settings.contact.phone}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-soft border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-hero rounded-xl text-primary-foreground flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-montserrat font-semibold text-xl mb-2 text-foreground">
                      Opening Hours
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Monday - Sunday</span>
                        <span className="font-medium text-foreground">7:00 AM - 12:30 AM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Service Hours</span>
                        <span className="font-medium text-foreground">17.5 Hours Daily</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        Serving Breakfast, Lunch & Dinner every day of the week
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift shadow-soft border-border/50">
              <CardContent className="p-6">
                <h3 className="font-montserrat font-semibold text-xl mb-4 text-foreground">
                  Follow Us
                </h3>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={openInstagram}
                    className="hover-lift"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    @luckydarbarest
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  See our latest dishes, behind-the-scenes content, and special announcements
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Map and Directions */}
          <div className="space-y-6">
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <h3 className="font-montserrat font-semibold text-xl mb-4 text-foreground">
                  Find Us on the Map
                </h3>
                
                {/* Embedded Map */}
                <div className="bg-muted rounded-lg p-8 text-center mb-6">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2 text-foreground">Lucky Darbar Location</h4>
                  <p className="text-muted-foreground mb-4">
                    {settings.contact.address.split(',').slice(0, 2).join(', ')}
                  </p>
                  <Button 
                    variant="hero" 
                    onClick={openGoogleMaps}
                    className="hover-lift"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Open in Google Maps
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    Search "Lucky Darbar JABA7986" for precise navigation
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg text-foreground">Getting Here</h4>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Located in the popular Al-Baghdadiyah Al-Sharqiyah district</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Easily accessible by car with nearby parking available</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Public transportation connections to major Jeddah areas</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span>Delivery available throughout Jeddah for takeout orders</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero p-8 rounded-2xl shadow-warm text-primary-foreground max-w-2xl mx-auto">
            <h3 className="font-montserrat font-bold text-2xl mb-4">
              Ready to Dine With Us?
            </h3>
            <p className="text-primary-foreground/90 mb-6">
              Whether you're planning a family dinner, business lunch, or special celebration, we're here to serve you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={callRestaurant}
                className="hover-lift"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={openGoogleMaps}
                className="hover-lift"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;