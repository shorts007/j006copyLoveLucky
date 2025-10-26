import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Flame, Heart, UtensilsCrossed, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_name: string;
  is_popular: boolean;
  is_signature: boolean;
  display_order: number;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

const MenuSection = () => {
  const [signatures, setSignatures] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('restaurantSettings');
    return stored ? JSON.parse(stored) : { phone: "+966 12 631 6360" };
  });

  useEffect(() => {
    fetchMenuItems();
    fetchMenuCategories();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('restaurantSettings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_signature', true)
      .order('display_order');
    
    if (data) setSignatures(data);
  };

  const fetchMenuCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order');
    
    if (data) setCategories(data);
  };

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: JSX.Element } = {
      Crown: <Crown className="w-5 h-5" />,
      Flame: <Flame className="w-5 h-5" />,
      Heart: <Heart className="w-5 h-5" />,
      UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
      Sparkles: <Sparkles className="w-5 h-5" />
    };
    return icons[iconName] || <UtensilsCrossed className="w-5 h-5" />;
  };

  return (
    <section id="menu" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
            Our <span className="gradient-text">Signature Menu</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover our carefully crafted dishes that have made Lucky Darbar a favorite among food lovers in Jeddah
          </p>
        </div>

        {/* Signature Dishes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {signatures.map((dish) => (
            <Card key={dish.id} className="hover-lift bg-card border-border/50 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-hero rounded-lg text-primary-foreground">
                      {getIcon(dish.icon_name)}
                    </div>
                    <div>
                      <h3 className="font-montserrat font-semibold text-xl text-foreground">
                        {dish.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1">
                        {dish.category}
                      </Badge>
                    </div>
                  </div>
                  {dish.is_popular && (
                    <Badge variant="destructive" className="bg-gradient-accent text-foreground">
                      Popular
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {dish.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Menu Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="hover-lift bg-card border-border/50 shadow-soft">
              <CardContent className="p-6 text-center">
                <h3 className="font-montserrat font-semibold text-xl mb-3 text-foreground">
                  {category.name}
                </h3>
                <p className="text-muted-foreground mb-4 text-sm">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero p-8 rounded-2xl shadow-warm text-primary-foreground">
            <h3 className="font-montserrat font-bold text-2xl mb-4">
              Experience Our Full Menu
            </h3>
            <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
              From breakfast favorites to dinner specialties, explore our complete menu featuring over 50 authentic dishes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.location.href = '/order'}
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Order Online Now
              </Button>
              <span className="text-primary-foreground/80 text-lg font-medium flex items-center justify-center">
                📞 Call for detailed menu: {settings.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;