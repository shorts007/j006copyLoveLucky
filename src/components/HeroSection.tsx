import { Button } from "@/components/ui/button";
import { Star, Award, Users, X } from "lucide-react";
import heroFood from "@/assets/hero-food.jpg";
import { useState, useEffect } from "react";

interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  discountPercentage?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  createdAt: string;
}

const HeroSection = () => {
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [showCampaign, setShowCampaign] = useState(true);

  useEffect(() => {
    // Get campaigns from localStorage (simulating admin panel data)
    const savedCampaigns = localStorage.getItem('campaigns');
    console.log('Checking for campaigns:', savedCampaigns);
    
    if (savedCampaigns) {
      const campaigns: Campaign[] = JSON.parse(savedCampaigns);
      const currentDate = new Date().toISOString().split('T')[0];
      console.log('Current date:', currentDate);
      console.log('Available campaigns:', campaigns);
      
      // Find an active campaign that's within valid date range
      const validCampaign = campaigns.find(campaign => {
        console.log(`Checking campaign: ${campaign.title}, active: ${campaign.isActive}, validFrom: ${campaign.validFrom}, validTo: ${campaign.validTo}`);
        return campaign.isActive && 
               campaign.validFrom <= currentDate && 
               campaign.validTo >= currentDate;
      });
      
      console.log('Valid campaign found:', validCampaign);
      if (validCampaign) {
        setActiveCampaign(validCampaign);
      }
    } else {
      console.log('No campaigns found in localStorage');
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  console.log('Rendering hero section, activeCampaign:', activeCampaign, 'showCampaign:', showCampaign);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Campaign Banner */}
      {activeCampaign && showCampaign && (
        <div 
          className="absolute top-0 left-0 right-0 z-50 p-4 text-center shadow-lg"
          style={{ 
            backgroundColor: activeCampaign.backgroundColor,
            color: activeCampaign.textColor 
          }}
        >
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">{activeCampaign.title}</h3>
              <p className="text-sm opacity-90 mb-2">{activeCampaign.description}</p>
              {activeCampaign.discountPercentage && (
                <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                  {activeCampaign.discountPercentage}% OFF
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm"
                className="border-current text-current hover:bg-white/20"
                onClick={() => scrollToSection('booking')}
              >
                {activeCampaign.buttonText}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCampaign(false)}
              className="text-current hover:bg-white/20 ml-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${heroFood})`
        }}
      />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 text-center text-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-golden-yellow text-golden-yellow" />
              ))}
            </div>
            <span className="text-golden-yellow font-semibold">5/5 TripAdvisor Rating</span>
          </div>

          <h1 className="font-montserrat font-bold text-5xl md:text-7xl mb-6 leading-tight">
            <span className="gradient-text">Lucky Darbar</span>
            <br />
            <span className="text-3xl md:text-5xl text-white/90">Indian Family Restaurant</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Experience the authentic flavors of India and China in the heart of Jeddah. 
            From tandoori delights to aromatic biryanis, every dish tells a story.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              variant="hero" 
              size="xl" 
              className="min-w-[200px]"
              onClick={() => scrollToSection('booking')}
            >
              Reserve Your Table
            </Button>
            <Button 
              variant="golden" 
              size="xl" 
              className="min-w-[200px]"
              onClick={() => scrollToSection('menu')}
            >
              Explore Menu
            </Button>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover-lift">
              <Award className="w-12 h-12 text-golden-yellow mb-4" />
              <h3 className="font-montserrat font-semibold text-xl mb-2">Authentic Cuisine</h3>
              <p className="text-white/80 text-center">Traditional Indian & Chinese flavors crafted with generations of expertise</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover-lift">
              <Users className="w-12 h-12 text-golden-yellow mb-4" />
              <h3 className="font-montserrat font-semibold text-xl mb-2">Family Friendly</h3>
              <p className="text-white/80 text-center">Warm atmosphere perfect for families, friends, and special celebrations</p>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-sm rounded-xl hover-lift">
              <Star className="w-12 h-12 text-golden-yellow mb-4" />
              <h3 className="font-montserrat font-semibold text-xl mb-2">Exceptional Service</h3>
              <p className="text-white/80 text-center">Attentive staff ensuring every detail of your dining experience is perfect</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 bg-golden-yellow/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute bottom-32 right-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-32 h-32 bg-tandoori-orange/20 rounded-full blur-xl"></div>
      </div>
    </section>
  );
};

export default HeroSection;