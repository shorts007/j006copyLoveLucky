import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, Users, Award } from "lucide-react";
import restaurantInterior from "@/assets/restaurant-interior.jpg";

const AboutSection = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Authentic Flavors", 
      description: "Traditional recipes passed down through generations, using the finest spices and ingredients"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Family Atmosphere",
      description: "Warm, welcoming environment perfect for families, friends, and special occasions"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Fresh Daily",
      description: "All dishes prepared fresh daily with generous portions and reasonable prices"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Prime Location",
      description: "Conveniently located in Al-Baghdadiyah Al-Sharqiyah, easily accessible from anywhere in Jeddah"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
              About <span className="gradient-text">Lucky Darbar</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Welcome to Lucky Darbar Indian Family Restaurant, where culinary traditions meet modern hospitality. 
              Located in the heart of Jeddah, we've been serving authentic Indian and Chinese cuisine that brings 
              families together and creates lasting memories.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our journey began with a simple mission: to serve fresh, flavorful food in a warm, family-friendly 
              environment. Every dish is crafted with care, using traditional cooking methods and the finest spices 
              to ensure an authentic taste experience that keeps our guests coming back.
            </p>

            {/* Opening Hours */}
            <Card className="mb-8 bg-gradient-card border-border/50 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-hero rounded-lg text-primary-foreground">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-montserrat font-semibold text-xl">Opening Hours</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-foreground">Monday - Sunday</p>
                    <p className="text-muted-foreground">7:00 AM - 12:30 AM</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">All Week</p>
                    <p className="text-muted-foreground">Breakfast • Lunch • Dinner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <p className="font-montserrat font-bold text-2xl text-primary">5★</p>
                <p className="text-sm text-muted-foreground">TripAdvisor</p>
              </div>
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <p className="font-montserrat font-bold text-2xl text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Menu Items</p>
              </div>
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <p className="font-montserrat font-bold text-2xl text-primary">17.5</p>
                <p className="text-sm text-muted-foreground">Hours Daily</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="animate-slide-up">
            <div className="relative">
              <img 
                src={restaurantInterior} 
                alt="Lucky Darbar Restaurant Interior" 
                className="w-full h-[500px] object-cover rounded-2xl shadow-warm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift bg-card border-border/50 shadow-soft text-center">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-hero rounded-xl text-primary-foreground">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-montserrat font-semibold text-lg mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;