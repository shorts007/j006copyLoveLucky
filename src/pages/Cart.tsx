import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-32 pb-20 bg-gradient-card min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
              <h1 className="font-montserrat font-bold text-3xl mb-4">
                Your cart is empty
              </h1>
              <p className="text-muted-foreground mb-8">
                Add some delicious items to get started
              </p>
              <Button onClick={() => navigate("/order")} size="lg">
                Browse Menu
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-20 bg-gradient-card min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <Button
                variant="outline"
                onClick={() => navigate("/order")}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </div>

            <h1 className="font-montserrat font-bold text-4xl mb-8">
              Your <span className="gradient-text">Cart</span>
            </h1>

            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-montserrat font-semibold text-lg mb-2">
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold">
                          SAR {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value) || 1)
                          }
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-right min-w-[100px]">
                        <p className="font-bold text-lg">
                          SAR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-hero text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-montserrat">Total:</span>
                  <span className="text-3xl font-bold">
                    SAR {getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => navigate("/checkout")}
                  size="lg"
                  className="w-full bg-white text-primary hover:bg-white/90"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
