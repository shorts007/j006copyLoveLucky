import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20, "Phone number must be less than 20 digits"),
  specialInstructions: z.string().max(500, "Instructions must be less than 500 characters").optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderType: "takeaway" as "takeaway" | "pickup",
    specialInstructions: "",
  });

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
                Add items to your cart before checking out
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validate form data
      const validatedData = checkoutSchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        specialInstructions: formData.specialInstructions,
      });

      // Call backend function to create order securely
      const { data, error: fnError } = await supabase.functions.invoke("place-order", {
        body: {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          orderType: formData.orderType,
          specialInstructions: validatedData.specialInstructions || null,
          items: items.map((item) => ({
            menu_item_id: item.id,
            item_name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      });

      if (fnError) throw fnError;

      toast({
        title: "Order placed successfully! 🎉",
        description: `Order #${String(data?.orderId || "").slice(0, 8)} - We'll contact you at ${validatedData.phone} to confirm.`,
      });

      clearCart();
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to place order. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-32 pb-20 bg-gradient-card min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/cart")}
              className="gap-2 mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Button>

            <h1 className="font-montserrat font-bold text-4xl mb-8">
              <span className="gradient-text">Checkout</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          setErrors({ ...errors, name: "" });
                        }}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          setErrors({ ...errors, email: "" });
                        }}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        placeholder="+966 XX XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          setErrors({ ...errors, phone: "" });
                        }}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Order Type *</Label>
                      <RadioGroup
                        value={formData.orderType}
                        onValueChange={(value: "takeaway" | "pickup") =>
                          setFormData({ ...formData, orderType: value })
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="takeaway" id="takeaway" />
                          <Label htmlFor="takeaway" className="cursor-pointer">
                            Takeaway
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup" className="cursor-pointer">
                            Pickup
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instructions">Special Instructions</Label>
                      <Textarea
                        id="instructions"
                        value={formData.specialInstructions}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            specialInstructions: e.target.value,
                          });
                          setErrors({ ...errors, specialInstructions: "" });
                        }}
                        placeholder="Any special requests? (e.g., no onions, extra spicy)"
                        maxLength={500}
                        className={errors.specialInstructions ? "border-destructive" : ""}
                      />
                      {errors.specialInstructions && (
                        <p className="text-sm text-destructive">{errors.specialInstructions}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formData.specialInstructions.length}/500 characters
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Placing Order..." : "Place Order"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between pb-4 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold">
                          SAR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="mt-4 bg-gradient-hero text-primary-foreground">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-montserrat">Total:</span>
                      <span className="text-3xl font-bold">
                        SAR {getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
