import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const ReviewsSection = () => {
  const reviews = [
    {
      name: "Sarah Al-Rashid",
      location: "Jeddah",
      rating: 5,
      review: "Absolutely delicious—fresh, full of flavor, and tasted truly authentic. The Chicken Tikka was perfectly spiced and the service was exceptional. Will definitely be back!",
      dish: "Chicken Tikka"
    },
    {
      name: "Ahmed Hassan", 
      location: "Riyadh",
      rating: 5,
      review: "Recommended spot for South Indian foodies! My favorites are Chicken Tikka, Tandoori, and Kulcha. The portions are generous and the prices very reasonable.",
      dish: "Tandoori & Kulcha"
    },
    {
      name: "Fatima Khan",
      location: "Jeddah",
      rating: 5,
      review: "Staff made sure everything was perfect, from seating to service—attention to detail really stood out. The Royal Tandoori with Biryani Rice was phenomenal!",
      dish: "Royal Tandoori with Biryani"
    },
    {
      name: "Omar Abdullah",
      location: "Makkah",
      rating: 5,
      review: "Family-friendly atmosphere with authentic flavors. The restaurant maintains excellent hygiene standards and the packaging for takeout is neat and professional.",
      dish: "Family Dinner"
    }
  ];

  return (
    <section id="reviews" className="py-20 bg-gradient-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
            What Our <span className="gradient-text">Guests Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Don't just take our word for it - hear from our valued customers about their dining experiences
          </p>
          
          {/* TripAdvisor Rating */}
          <div className="flex justify-center items-center gap-4 mt-8 p-6 bg-card rounded-xl shadow-soft inline-block">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-golden-yellow text-golden-yellow" />
                ))}
              </div>
              <p className="font-montserrat font-bold text-2xl text-foreground">5.0/5</p>
              <p className="text-muted-foreground text-sm">TripAdvisor Rating</p>
            </div>
            <div className="w-px h-16 bg-border"></div>
            <div className="text-center">
              <p className="font-montserrat font-bold text-2xl text-foreground">4+</p>
              <p className="text-muted-foreground text-sm">Verified Reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review, index) => (
            <Card key={index} className="hover-lift bg-card border-border/50 shadow-soft relative overflow-hidden">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10">
                  <Quote className="w-12 h-12 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-golden-yellow text-golden-yellow" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                </div>

                {/* Review Text */}
                <blockquote className="text-foreground mb-6 leading-relaxed">
                  "{review.review}"
                </blockquote>

                {/* Favorite Dish */}
                <div className="bg-gradient-accent/10 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-foreground">
                    Favorite Dish: <span className="text-primary">{review.dish}</span>
                  </p>
                </div>

                {/* Reviewer Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-montserrat font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Verified Customer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero p-8 rounded-2xl shadow-warm text-primary-foreground max-w-2xl mx-auto">
            <h3 className="font-montserrat font-bold text-2xl mb-4">
              Join Our Happy Customers
            </h3>
            <p className="text-primary-foreground/90 mb-6">
              Experience the authentic flavors and exceptional service that have earned us a 5-star rating on TripAdvisor
            </p>
            <p className="text-primary-foreground/80 text-lg">
              "Every meal is a celebration of authentic Indian cuisine" ⭐⭐⭐⭐⭐
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;