import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Phone, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookingSection = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('restaurantSettings');
    return stored ? JSON.parse(stored) : {
      phone: "+966 12 631 6360",
      hours: {
        monday: { open: "07:00", close: "00:30", closed: false },
        tuesday: { open: "07:00", close: "00:30", closed: false },
        wednesday: { open: "07:00", close: "00:30", closed: false },
        thursday: { open: "07:00", close: "00:30", closed: false },
        friday: { open: "07:00", close: "00:30", closed: false },
        saturday: { open: "07:00", close: "00:30", closed: false },
        sunday: { open: "07:00", close: "00:30", closed: false }
      }
    };
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: "",
    specialRequests: ""
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.guests) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, phone, date, time, and number of guests are required.",
        variant: "destructive"
      });
      return;
    }

    // In a real application, this would send data to a booking system
    toast({
      title: "Booking Request Submitted!",
      description: "We'll confirm your reservation within 2 hours. Thank you for choosing Lucky Darbar!",
    });

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      guests: "",
      specialRequests: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const timeSlots = [
    "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM",
    "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM",
    "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM",
    "9:00 PM", "9:30 PM", "10:00 PM", "10:30 PM", "11:00 PM", "11:30 PM", "12:00 AM"
  ];

  const guestOptions = Array.from({ length: 20 }, (_, i) => (i + 1).toString());

  return (
    <section id="booking" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
            Reserve Your <span className="gradient-text">Table</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Secure your dining experience at Lucky Darbar. We're open daily
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Booking Form */}
          <Card className="shadow-warm border-border/50">
            <CardHeader>
              <CardTitle className="font-montserrat text-2xl flex items-center gap-3">
                <div className="p-2 bg-gradient-hero rounded-lg text-primary-foreground">
                  <Calendar className="w-6 h-6" />
                </div>
                Make a Reservation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+966 XX XXX XXXX"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email (Optional)
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Reservation Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Preferred Time *
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Number of Guests */}
                <div className="space-y-2">
                  <Label>Number of Guests *</Label>
                  <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                    <SelectContent>
                      {guestOptions.map((num) => (
                        <SelectItem key={num} value={num}>
                          {num} {num === '1' ? 'Guest' : 'Guests'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="requests" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Special Requests (Optional)
                  </Label>
                  <Textarea
                    id="requests"
                    value={formData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    placeholder="Any dietary restrictions, seating preferences, or special occasions..."
                    rows={3}
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  Confirm Reservation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <h3 className="font-montserrat font-semibold text-xl mb-4 flex items-center gap-3">
                  <div className="p-2 bg-gradient-hero rounded-lg text-primary-foreground">
                    <Phone className="w-5 h-5" />
                  </div>
                  Direct Booking
                </h3>
                <p className="text-muted-foreground mb-4">
                  Prefer to call? Speak directly with our friendly staff for immediate confirmation.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-card rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">{settings.phone}</p>
                      <p className="text-sm text-muted-foreground">Available during business hours</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gradient-card rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Daily: {settings.hours.monday.open} - {settings.hours.monday.close}</p>
                      <p className="text-sm text-muted-foreground">Open 7 days a week</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft border-border/50">
              <CardContent className="p-6">
                <h3 className="font-montserrat font-semibold text-xl mb-4">
                  Booking Guidelines
                </h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Reservations confirmed within 2 hours during business hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Large groups (8+ people) recommended to call directly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Special dietary requirements can be accommodated with advance notice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Cancellation policy: 2 hours advance notice appreciated</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;