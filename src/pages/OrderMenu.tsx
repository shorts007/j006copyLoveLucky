import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, ArrowLeft, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image_url?: string;
  is_popular: boolean;
}

const OrderMenu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);
  const { addToCart, getTotalItems, items, updateQuantity, removeFromCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .not("price", "is", null)
      .order("category")
      .order("display_order");

    if (data) {
      setMenuItems(data);
      const uniqueCategories = ["All", ...new Set(data.map((item) => item.category))];
      setCategories(uniqueCategories);
    }
  };

  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const getItemQuantity = (itemId: string) => {
    const cartItem = items.find((item) => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const handleIncreaseQuantity = (item: MenuItem) => {
    const currentQuantity = getItemQuantity(item.id);
    if (currentQuantity > 0) {
      updateQuantity(item.id, currentQuantity + 1);
    } else {
      handleAddToCart(item);
    }
  };

  const handleDecreaseQuantity = (itemId: string) => {
    const currentQuantity = getItemQuantity(itemId);
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    } else if (currentQuantity === 1) {
      removeFromCart(itemId);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-20 bg-gradient-card min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Button
              onClick={() => navigate("/cart")}
              className="gap-2 relative"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
              {getTotalItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-destructive">
                  {getTotalItems()}
                </Badge>
              )}
            </Button>
          </div>

          <div className="text-center mb-12">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">
              Order <span className="gradient-text">Online</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our menu and place your order for takeaway or pickup
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover-lift overflow-hidden">
                {item.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-montserrat font-semibold text-xl">
                      {item.name}
                    </h3>
                    {item.is_popular && (
                      <Badge variant="destructive">Popular</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-2xl text-primary">
                      SAR {item.price.toFixed(2)}
                    </span>
                    {getItemQuantity(item.id) > 0 ? (
                      <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDecreaseQuantity(item.id)}
                          className="h-8 w-8"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold min-w-[2rem] text-center">
                          {getItemQuantity(item.id)}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleIncreaseQuantity(item)}
                          className="h-8 w-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No items available in this category
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderMenu;
