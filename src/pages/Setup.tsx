import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, ArrowLeft, CheckCircle2 } from "lucide-react";

const Setup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading } = useAuth();
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  const handleBootstrapAdmin = async () => {
    if (!user?.email) {
      toast({
        title: "Not logged in",
        description: "Please log in first to become an admin.",
        variant: "destructive",
      });
      return;
    }

    setIsBootstrapping(true);
    try {
      const { error } = await supabase.rpc('bootstrap_admin', {
        user_email: user.email
      });

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "You are now an admin. Refreshing...",
      });

      // Refresh the page to update auth state
      setTimeout(() => {
        window.location.href = '/admin';
      }, 1500);
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to grant admin access. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBootstrapping(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mb-4">
            <Shield className="text-primary-foreground w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-montserrat">
            Admin Setup
          </CardTitle>
          <CardDescription>
            Grant yourself admin access to manage the restaurant
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user ? (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                You need to be logged in to become an admin.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Go to Login
              </Button>
            </div>
          ) : isAdmin ? (
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <p className="font-semibold mb-2">You're already an admin!</p>
                <p className="text-sm text-muted-foreground mb-4">
                  You have full access to the admin panel.
                </p>
              </div>
              <Button onClick={() => navigate('/admin')} className="w-full">
                Go to Admin Panel
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Current Account:</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Click below to grant admin privileges to your account. This is typically a one-time setup.
                </p>
              </div>

              <Button 
                onClick={handleBootstrapAdmin}
                disabled={isBootstrapping}
                className="w-full"
                size="lg"
              >
                {isBootstrapping ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Granting Admin Access...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Become Admin
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;
