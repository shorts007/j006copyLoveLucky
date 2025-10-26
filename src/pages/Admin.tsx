import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, Phone, Mail, Search, Filter, Plus, Settings, MapPin, Globe, Image, Edit, Trash2, Eye, ArrowLeft, UtensilsCrossed, Crown, Flame, Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

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

interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon_name: string;
  is_popular: boolean;
  is_signature: boolean;
  display_order: number;
  price?: number | string;
  image_url?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: string;
  total_amount: number;
  status: string;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  item_name: string;
  quantity: number;
  price: number;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [isMenuItemDialogOpen, setIsMenuItemDialogOpen] = useState(false);
  const [isMenuCategoryDialogOpen, setIsMenuCategoryDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingMenuCategory, setEditingMenuCategory] = useState<MenuCategory | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<{ [orderId: string]: OrderItem[] }>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    category: '',
    icon_name: 'UtensilsCrossed',
    is_popular: false,
    is_signature: false,
    display_order: 0,
    price: '',
    image_url: ''
  });
  const [newMenuCategory, setNewMenuCategory] = useState({
    name: '',
    description: '',
    display_order: 0
  });
  const [bookings, setBookings] = useState<Booking[]>([
    // Sample data for demonstration
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      phone: '+966 55 123 4567',
      email: 'ahmed@example.com',
      date: '2024-01-15',
      time: '7:30 PM',
      guests: '4',
      specialRequests: 'Birthday celebration, need cake arrangement',
      status: 'confirmed',
      createdAt: '2024-01-10T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Mohammad',
      phone: '+966 50 987 6543',
      email: 'sarah@example.com',
      date: '2024-01-16',
      time: '8:00 PM',
      guests: '2',
      specialRequests: 'Vegetarian options preferred',
      status: 'pending',
      createdAt: '2024-01-11T14:15:00Z'
    },
    {
      id: '3',
      name: 'Hassan Abdullah',
      phone: '+966 53 456 7890',
      date: '2024-01-17',
      time: '7:00 PM',
      guests: '6',
      specialRequests: '',
      status: 'confirmed',
      createdAt: '2024-01-12T09:45:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBooking, setNewBooking] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    guests: '',
    specialRequests: ''
  });

  // Campaigns state
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const savedCampaigns = localStorage.getItem('campaigns');
    return savedCampaigns ? JSON.parse(savedCampaigns) : [
      {
        id: '1',
        title: 'Grand Opening Special',
        description: 'Celebrate our grand opening with exclusive deals on authentic Pakistani cuisine!',
        imageUrl: '/api/placeholder/400/200',
        discountPercentage: 25,
        validFrom: '2024-01-15',
        validTo: '2024-02-15',
        isActive: true,
        backgroundColor: '#FF6B6B',
        textColor: '#FFFFFF',
        buttonText: 'Order Now',
        createdAt: '2024-01-10T10:30:00Z'
      },
      {
        id: '2',
        title: 'Weekend Family Feast',
        description: 'Special family packages available every weekend. Perfect for family gatherings!',
        discountPercentage: 15,
        validFrom: '2024-01-20',
        validTo: '2024-03-20',
        isActive: true,
        backgroundColor: '#4ECDC4',
        textColor: '#FFFFFF',
        buttonText: 'Book Table',
        createdAt: '2024-01-12T14:20:00Z'
      }
    ];
  });

  const [isAddCampaignDialogOpen, setIsAddCampaignDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    imageUrl: '',
    discountPercentage: '',
    validFrom: '',
    validTo: '',
    backgroundColor: '#FF6B6B',
    textColor: '#FFFFFF',
    buttonText: 'Learn More'
  });

  // Restaurant settings state
  const [restaurantSettings, setRestaurantSettings] = useState(() => {
    const savedSettings = localStorage.getItem('restaurantSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      contact: {
        phone: '+966 12 631 6360',
        email: 'info@luckydarbar.com',
        address: 'Al-Kamal Street, Al-Baghdadiyah Al-Sharqiyah, Jeddah 22241, Saudi Arabia',
        website: 'www.luckydarbar.com'
      },
      hours: {
        monday: { open: '07:00', close: '00:30', closed: false },
        tuesday: { open: '07:00', close: '00:30', closed: false },
        wednesday: { open: '07:00', close: '00:30', closed: false },
        thursday: { open: '07:00', close: '00:30', closed: false },
        friday: { open: '07:00', close: '00:30', closed: false },
        saturday: { open: '07:00', close: '00:30', closed: false },
        sunday: { open: '07:00', close: '00:30', closed: false }
      }
    };
  });

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.phone.includes(searchTerm) ||
                         booking.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    toast({ title: `Booking ${newStatus}` });
  };

  const addNewBooking = () => {
    if (!newBooking.name || !newBooking.phone || !newBooking.date || !newBooking.time || !newBooking.guests) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const booking: Booking = {
      id: Date.now().toString(),
      name: newBooking.name,
      phone: newBooking.phone,
      email: newBooking.email || undefined,
      date: newBooking.date,
      time: newBooking.time,
      guests: newBooking.guests,
      specialRequests: newBooking.specialRequests || undefined,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [booking, ...prev]);
    toast({ title: "Booking created successfully" });
    setNewBooking({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      guests: '',
      specialRequests: ''
    });
    setIsAddDialogOpen(false);
  };

  const addNewCampaign = () => {
    if (!newCampaign.title || !newCampaign.description || !newCampaign.validFrom || !newCampaign.validTo) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const campaign: Campaign = {
      id: Date.now().toString(),
      title: newCampaign.title,
      description: newCampaign.description,
      imageUrl: newCampaign.imageUrl || undefined,
      discountPercentage: newCampaign.discountPercentage ? parseInt(newCampaign.discountPercentage) : undefined,
      validFrom: newCampaign.validFrom,
      validTo: newCampaign.validTo,
      isActive: true,
      backgroundColor: newCampaign.backgroundColor,
      textColor: newCampaign.textColor,
      buttonText: newCampaign.buttonText,
      createdAt: new Date().toISOString()
    };

    if (editingCampaign) {
      setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...campaign, id: editingCampaign.id } : c));
      setEditingCampaign(null);
      toast({ title: "Changes have been updated successfully" });
    } else {
      setCampaigns(prev => [campaign, ...prev]);
      toast({ title: "Campaign added successfully" });
    }

    setNewCampaign({
      title: '',
      description: '',
      imageUrl: '',
      discountPercentage: '',
      validFrom: '',
      validTo: '',
      backgroundColor: '#FF6B6B',
      textColor: '#FFFFFF',
      buttonText: 'Learn More'
    });
    setIsAddCampaignDialogOpen(false);
  };

  const editCampaign = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setNewCampaign({
      title: campaign.title,
      description: campaign.description,
      imageUrl: campaign.imageUrl || '',
      discountPercentage: campaign.discountPercentage?.toString() || '',
      validFrom: campaign.validFrom,
      validTo: campaign.validTo,
      backgroundColor: campaign.backgroundColor,
      textColor: campaign.textColor,
      buttonText: campaign.buttonText
    });
    setIsAddCampaignDialogOpen(true);
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    toast({ title: "Campaign deleted successfully" });
  };

  const toggleCampaignStatus = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    setCampaigns(prev => prev.map(c => 
      c.id === campaignId ? { ...c, isActive: !c.isActive } : c
    ));
    toast({ title: campaign?.isActive ? "Campaign deactivated" : "Campaign activated" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusCount = (status: string) => {
    return bookings.filter(booking => booking.status === status).length;
  };

  const updateRestaurantSettings = (section: 'contact' | 'hours', field: string, value: any) => {
    setRestaurantSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setIsSavingSettings(false); // Re-enable save button when changes are made
  };

  const updateHours = (day: string, field: string, value: string | boolean) => {
    setRestaurantSettings(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day as keyof typeof prev.hours],
          [field]: value
        }
      }
    }));
    setIsSavingSettings(false); // Re-enable save button when changes are made
  };

  const saveRestaurantSettings = () => {
    localStorage.setItem('restaurantSettings', JSON.stringify(restaurantSettings));
    setIsSavingSettings(true);
    toast({ title: "Changes have been updated successfully" });
  };

  // Save campaigns to localStorage whenever campaigns state changes
  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Save restaurant settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('restaurantSettings', JSON.stringify(restaurantSettings));
  }, [restaurantSettings]);

  // Auth guard - redirect if not admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({ 
        title: "Access Denied", 
        description: "You need admin privileges to access this page.",
        variant: "destructive" 
      });
      navigate('/auth');
    }
  }, [loading, isAdmin, navigate, toast]);

  // Fetch menu items and categories
  useEffect(() => {
    if (isAdmin) {
      fetchMenuItems();
      fetchMenuCategories();
      fetchOrders();
    }
  }, [isAdmin]);

  // Realtime subscription for orders
  useEffect(() => {
    if (!isAdmin) return;

    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          fetchOrders(); // Refresh orders list
        }
      )
      .subscribe();

    const orderItemsChannel = supabase
      .channel('order-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items'
        },
        (payload) => {
          console.log('Order items change detected:', payload);
          if (payload.new && 'order_id' in payload.new) {
            fetchOrderItems(payload.new.order_id as string);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(orderItemsChannel);
    };
  }, [isAdmin]);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('display_order');
    
    if (error) {
      toast({ title: "Error fetching menu items", variant: "destructive" });
    } else if (data) {
      setMenuItems(data);
    }
  };

  const fetchMenuCategories = async () => {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .order('display_order');
    
    if (error) {
      toast({ title: "Error fetching menu categories", variant: "destructive" });
    } else if (data) {
      setMenuCategories(data);
    }
  };

  const addOrUpdateMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.description || !newMenuItem.category) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const itemData = {
      name: newMenuItem.name,
      description: newMenuItem.description,
      category: newMenuItem.category,
      icon_name: newMenuItem.icon_name,
      is_popular: newMenuItem.is_popular,
      is_signature: newMenuItem.is_signature,
      display_order: newMenuItem.display_order,
      price: newMenuItem.price ? parseFloat(newMenuItem.price.toString()) : null,
      image_url: newMenuItem.image_url || null
    };

    if (editingMenuItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingMenuItem.id);
      
      if (error) {
        toast({ title: "Error updating menu item", variant: "destructive" });
      } else {
        toast({ title: "Changes have been updated successfully" });
        fetchMenuItems();
      }
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert([itemData]);
      
      if (error) {
        toast({ title: "Error adding menu item", variant: "destructive" });
      } else {
        toast({ title: "Menu item added successfully" });
        fetchMenuItems();
      }
    }

    setNewMenuItem({
      name: '',
      description: '',
      category: '',
      icon_name: 'UtensilsCrossed',
      is_popular: false,
      is_signature: false,
      display_order: 0,
      price: '',
      image_url: ''
    });
    setEditingMenuItem(null);
    setIsMenuItemDialogOpen(false);
  };

  const deleteMenuItem = async (id: string) => {
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: "Error deleting menu item", variant: "destructive" });
    } else {
      toast({ title: "Menu item deleted successfully" });
      fetchMenuItems();
    }
  };

  const editMenuItem = (item: MenuItem) => {
    setEditingMenuItem(item);
    setNewMenuItem({
      name: item.name,
      description: item.description,
      category: item.category,
      icon_name: item.icon_name,
      is_popular: item.is_popular,
      is_signature: item.is_signature,
      display_order: item.display_order,
      price: item.price?.toString() || '',
      image_url: item.image_url || ''
    });
    setIsMenuItemDialogOpen(true);
  };

  const addOrUpdateMenuCategory = async () => {
    if (!newMenuCategory.name || !newMenuCategory.description) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (editingMenuCategory) {
      const { error } = await supabase
        .from('menu_categories')
        .update(newMenuCategory)
        .eq('id', editingMenuCategory.id);
      
      if (error) {
        toast({ title: "Error updating menu category", variant: "destructive" });
      } else {
        toast({ title: "Changes have been updated successfully" });
        fetchMenuCategories();
      }
    } else {
      const { error } = await supabase
        .from('menu_categories')
        .insert([newMenuCategory]);
      
      if (error) {
        toast({ title: "Error adding menu category", variant: "destructive" });
      } else {
        toast({ title: "Menu category added successfully" });
        fetchMenuCategories();
      }
    }

    setNewMenuCategory({
      name: '',
      description: '',
      display_order: 0
    });
    setEditingMenuCategory(null);
    setIsMenuCategoryDialogOpen(false);
  };

  const deleteMenuCategory = async (id: string) => {
    const { error } = await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast({ title: "Error deleting menu category", variant: "destructive" });
    } else {
      toast({ title: "Menu category deleted successfully" });
      fetchMenuCategories();
    }
  };

  const editMenuCategory = (category: MenuCategory) => {
    setEditingMenuCategory(category);
    setNewMenuCategory({
      name: category.name,
      description: category.description,
      display_order: category.display_order
    });
    setIsMenuCategoryDialogOpen(true);
  };

  const iconOptions = [
    { value: 'UtensilsCrossed', label: 'Utensils', icon: UtensilsCrossed },
    { value: 'Crown', label: 'Crown', icon: Crown },
    { value: 'Flame', label: 'Flame', icon: Flame },
    { value: 'Heart', label: 'Heart', icon: Heart },
    { value: 'Sparkles', label: 'Sparkles', icon: Sparkles }
  ];

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: "Error fetching orders", variant: "destructive" });
    } else if (data) {
      setOrders(data);
      // Fetch order items for each order
      data.forEach(order => fetchOrderItems(order.id));
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (error) {
      console.error("Error fetching order items:", error);
    } else if (data) {
      setOrderItems(prev => ({ ...prev, [orderId]: data }));
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);
    
    if (error) {
      toast({ title: "Error updating order status", variant: "destructive" });
    } else {
      toast({ title: `Order status updated to ${newStatus}` });
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                         order.customer_phone.includes(orderSearchTerm) ||
                         order.customer_email.toLowerCase().includes(orderSearchTerm.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ready': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getOrderStatusCount = (status: string) => {
    return orders.filter(order => order.status === status).length;
  };

  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render admin panel if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Website
            </Button>
          </div>
          <h1 className="font-montserrat font-bold text-4xl mb-2">
            Lucky Darbar <span className="gradient-text">Admin Panel</span>
          </h1>
          <p className="text-muted-foreground text-lg">Manage restaurant bookings and settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Booking Management</h2>
                <p className="text-muted-foreground">Manage restaurant bookings and reservations</p>
              </div>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Booking
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Booking</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Customer Name *</Label>
                        <Input
                          id="name"
                          value={newBooking.name}
                          onChange={(e) => setNewBooking(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter customer name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={newBooking.phone}
                          onChange={(e) => setNewBooking(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+966 XX XXX XXXX"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newBooking.email}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="customer@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newBooking.date}
                          onChange={(e) => setNewBooking(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Time *</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newBooking.time}
                          onChange={(e) => setNewBooking(prev => ({ ...prev, time: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guests">Guests *</Label>
                        <Input
                          id="guests"
                          type="number"
                          min="1"
                          max="20"
                          value={newBooking.guests}
                          onChange={(e) => setNewBooking(prev => ({ ...prev, guests: e.target.value }))}
                          placeholder="2"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="special">Special Requests (Optional)</Label>
                      <Textarea
                        id="special"
                        value={newBooking.specialRequests}
                        onChange={(e) => setNewBooking(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder="Any special dietary requirements, celebration, or seating preferences..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNewBooking}>
                        Create Booking
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-3xl font-bold">{bookings.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="text-3xl font-bold text-green-600">{getStatusCount('confirmed')}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                      <p className="text-3xl font-bold text-red-600">{getStatusCount('cancelled')}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by name, phone, or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={statusFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('all')}
                      size="sm"
                    >
                      All
                    </Button>
                    <Button
                      variant={statusFilter === 'pending' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('pending')}
                      size="sm"
                    >
                      Pending
                    </Button>
                    <Button
                      variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('confirmed')}
                      size="sm"
                    >
                      Confirmed
                    </Button>
                    <Button
                      variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                      onClick={() => setStatusFilter('cancelled')}
                      size="sm"
                    >
                      Cancelled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bookings List */}
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <Card key={booking.id} className="shadow-soft border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{booking.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {booking.phone}
                          </div>
                          {booking.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Mail className="w-3 h-3" />
                              {booking.email}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{booking.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {booking.time}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium mb-2">{booking.guests} Guests</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                        </div>

                        <div>
                          {booking.specialRequests && (
                            <div>
                              <p className="text-sm font-medium mb-1">Special Requests:</p>
                              <p className="text-sm text-muted-foreground">{booking.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        )}
                        {booking.status === 'cancelled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No bookings found</h3>
                  <p className="text-muted-foreground">No bookings match your current filters.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Online Orders Management</h2>
                <p className="text-muted-foreground">Monitor and manage online orders with complete lifecycle</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Total</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{getOrderStatusCount('pending')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Confirmed</p>
                    <p className="text-2xl font-bold text-blue-600">{getOrderStatusCount('confirmed')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Preparing</p>
                    <p className="text-2xl font-bold text-purple-600">{getOrderStatusCount('preparing')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Ready</p>
                    <p className="text-2xl font-bold text-teal-600">{getOrderStatusCount('ready')}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Completed</p>
                    <p className="text-2xl font-bold text-green-600">{getOrderStatusCount('completed')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by customer name, phone, or email..."
                        value={orderSearchTerm}
                        onChange={(e) => setOrderSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant={orderStatusFilter === 'all' ? 'default' : 'outline'}
                      onClick={() => setOrderStatusFilter('all')}
                      size="sm"
                    >
                      All
                    </Button>
                    <Button
                      variant={orderStatusFilter === 'pending' ? 'default' : 'outline'}
                      onClick={() => setOrderStatusFilter('pending')}
                      size="sm"
                    >
                      Pending
                    </Button>
                    <Button
                      variant={orderStatusFilter === 'confirmed' ? 'default' : 'outline'}
                      onClick={() => setOrderStatusFilter('confirmed')}
                      size="sm"
                    >
                      Confirmed
                    </Button>
                    <Button
                      variant={orderStatusFilter === 'preparing' ? 'default' : 'outline'}
                      onClick={() => setOrderStatusFilter('preparing')}
                      size="sm"
                    >
                      Preparing
                    </Button>
                    <Button
                      variant={orderStatusFilter === 'ready' ? 'default' : 'outline'}
                      onClick={() => setOrderStatusFilter('ready')}
                      size="sm"
                    >
                      Ready
                    </Button>
                    <Button
                      variant={orderStatusFilter === 'completed' ? 'default' : 'outline'}
                      onClick={() => setOrderStatusFilter('completed')}
                      size="sm"
                    >
                      Completed
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="shadow-soft border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{order.customer_name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {order.customer_phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Mail className="w-3 h-3" />
                              {order.customer_email}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Order Type</p>
                            <p className="font-medium capitalize">{order.order_type}</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-2xl font-bold text-primary">SAR {Number(order.total_amount).toFixed(2)}</p>
                            <Badge className={`mt-2 ${getOrderStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      {order.special_instructions && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm font-medium mb-1">Special Instructions:</p>
                          <p className="text-sm text-muted-foreground">{order.special_instructions}</p>
                        </div>
                      )}

                      {/* Quick Status Update Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        {order.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                              Confirm Order
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                              Cancel
                            </Button>
                          </>
                        )}
                        {order.status === 'confirmed' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                            Mark as Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                            Complete Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No orders found</h3>
                  <p className="text-muted-foreground">No orders match your current filters.</p>
                </CardContent>
              </Card>
            )}

            {/* Order Detail Dialog */}
            <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
              <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Order Details</DialogTitle>
                </DialogHeader>
                {selectedOrder && (
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Customer Name</Label>
                        <p className="font-medium">{selectedOrder.customer_name}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Order Type</Label>
                        <p className="font-medium capitalize">{selectedOrder.order_type}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Phone</Label>
                        <p className="font-medium">{selectedOrder.customer_phone}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedOrder.customer_email}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Order Date</Label>
                        <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <Badge className={getOrderStatusColor(selectedOrder.status)}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </div>
                    </div>

                    {selectedOrder.special_instructions && (
                      <div>
                        <Label className="text-muted-foreground">Special Instructions</Label>
                        <p className="font-medium mt-1">{selectedOrder.special_instructions}</p>
                      </div>
                    )}

                    <div>
                      <Label className="text-muted-foreground mb-3 block">Order Items</Label>
                      <div className="space-y-2">
                        {orderItems[selectedOrder.id]?.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                            <div>
                              <p className="font-medium">{item.item_name}</p>
                              <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-bold">SAR {(Number(item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold">Total Amount</p>
                        <p className="text-2xl font-bold text-primary">SAR {Number(selectedOrder.total_amount).toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" variant="outline" onClick={() => setIsOrderDetailOpen(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Campaign Management</h2>
                <p className="text-muted-foreground">Create and manage promotional campaigns and advertisements</p>
              </div>
              <Dialog open={isAddCampaignDialogOpen} onOpenChange={setIsAddCampaignDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    {editingCampaign ? 'Edit Campaign' : 'Create Campaign'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-title">Campaign Title *</Label>
                      <Input
                        id="campaign-title"
                        value={newCampaign.title}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter campaign title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-description">Description *</Label>
                      <Textarea
                        id="campaign-description"
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Enter campaign description"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="campaign-image">Image URL (Optional)</Label>
                      <Input
                        id="campaign-image"
                        value={newCampaign.imageUrl}
                        onChange={(e) => setNewCampaign(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="discount">Discount % (Optional)</Label>
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max="100"
                          value={newCampaign.discountPercentage}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, discountPercentage: e.target.value }))}
                          placeholder="25"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="button-text">Button Text</Label>
                        <Input
                          id="button-text"
                          value={newCampaign.buttonText}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, buttonText: e.target.value }))}
                          placeholder="Learn More"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="valid-from">Valid From *</Label>
                        <Input
                          id="valid-from"
                          type="date"
                          value={newCampaign.validFrom}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, validFrom: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="valid-to">Valid To *</Label>
                        <Input
                          id="valid-to"
                          type="date"
                          value={newCampaign.validTo}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, validTo: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bg-color">Background Color</Label>
                        <Input
                          id="bg-color"
                          type="color"
                          value={newCampaign.backgroundColor}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, backgroundColor: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="text-color">Text Color</Label>
                        <Input
                          id="text-color"
                          type="color"
                          value={newCampaign.textColor}
                          onChange={(e) => setNewCampaign(prev => ({ ...prev, textColor: e.target.value }))}
                        />
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div 
                        className="p-6 rounded-lg text-center"
                        style={{ 
                          backgroundColor: newCampaign.backgroundColor,
                          color: newCampaign.textColor 
                        }}
                      >
                        <h3 className="text-xl font-bold mb-2">{newCampaign.title || 'Campaign Title'}</h3>
                        <p className="mb-4">{newCampaign.description || 'Campaign description will appear here'}</p>
                        {newCampaign.discountPercentage && (
                          <p className="text-lg font-bold mb-4">{newCampaign.discountPercentage}% OFF</p>
                        )}
                        <Button variant="outline" style={{ borderColor: newCampaign.textColor, color: newCampaign.textColor }}>
                          {newCampaign.buttonText}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => {
                        setIsAddCampaignDialogOpen(false);
                        setEditingCampaign(null);
                        setNewCampaign({
                          title: '',
                          description: '',
                          imageUrl: '',
                          discountPercentage: '',
                          validFrom: '',
                          validTo: '',
                          backgroundColor: '#FF6B6B',
                          textColor: '#FFFFFF',
                          buttonText: 'Learn More'
                        });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={addNewCampaign}>
                        {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Campaign Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Campaigns</p>
                      <p className="text-3xl font-bold">{campaigns.length}</p>
                    </div>
                    <Image className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Campaigns</p>
                      <p className="text-3xl font-bold text-green-600">
                        {campaigns.filter(c => c.isActive).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Inactive Campaigns</p>
                      <p className="text-3xl font-bold text-gray-600">
                        {campaigns.filter(c => !c.isActive).length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="shadow-soft border-border/50">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-xl">{campaign.title}</h3>
                              <Badge className={campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {campaign.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              {campaign.discountPercentage && (
                                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                                  {campaign.discountPercentage}% OFF
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3">{campaign.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Valid From: </span>
                                <span className="text-muted-foreground">{campaign.validFrom}</span>
                              </div>
                              <div>
                                <span className="font-medium">Valid To: </span>
                                <span className="text-muted-foreground">{campaign.validTo}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Preview */}
                          <div 
                            className="w-64 p-4 rounded-lg text-center flex-shrink-0"
                            style={{ 
                              backgroundColor: campaign.backgroundColor,
                              color: campaign.textColor 
                            }}
                          >
                            <h4 className="font-bold mb-2">{campaign.title}</h4>
                            <p className="text-sm mb-2 line-clamp-2">{campaign.description}</p>
                            {campaign.discountPercentage && (
                              <p className="font-bold mb-2">{campaign.discountPercentage}% OFF</p>
                            )}
                            <Button 
                              size="sm" 
                              variant="outline" 
                              style={{ borderColor: campaign.textColor, color: campaign.textColor }}
                            >
                              {campaign.buttonText}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleCampaignStatus(campaign.id)}
                        >
                          {campaign.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editCampaign(campaign)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteCampaign(campaign.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {campaigns.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No campaigns found</h3>
                  <p className="text-muted-foreground">Create your first campaign to get started.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={restaurantSettings.contact.phone}
                      onChange={(e) => updateRestaurantSettings('contact', 'phone', e.target.value)}
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={restaurantSettings.contact.email}
                      onChange={(e) => updateRestaurantSettings('contact', 'email', e.target.value)}
                      placeholder="info@restaurant.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={restaurantSettings.contact.address}
                    onChange={(e) => updateRestaurantSettings('contact', 'address', e.target.value)}
                    placeholder="Full restaurant address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={restaurantSettings.contact.website}
                    onChange={(e) => updateRestaurantSettings('contact', 'website', e.target.value)}
                    placeholder="www.yourrestaurant.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(restaurantSettings.hours).map(([day, hours]: [string, any]) => (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-24 font-medium capitalize">
                      {day}
                    </div>
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => updateHours(day, 'closed', !e.target.checked)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">Open</span>
                      </div>
                      {!hours.closed && (
                        <>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">From:</Label>
                            <Input
                              type="time"
                              value={hours.open}
                              onChange={(e) => updateHours(day, 'open', e.target.value)}
                              className="w-32"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">To:</Label>
                            <Input
                              type="time"
                              value={hours.close}
                              onChange={(e) => updateHours(day, 'close', e.target.value)}
                              className="w-32"
                            />
                          </div>
                        </>
                      )}
                      {hours.closed && (
                        <span className="text-sm text-muted-foreground">Closed</span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                className="flex items-center gap-2" 
                onClick={saveRestaurantSettings}
                disabled={isSavingSettings}
              >
                <Settings className="w-4 h-4" />
                {isSavingSettings ? 'Settings Saved' : 'Save Settings'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="space-y-6">
            <div className="space-y-8">
              {/* Menu Items Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Menu Items</h2>
                    <p className="text-muted-foreground">Manage signature dishes and menu items</p>
                  </div>
                  <Dialog open={isMenuItemDialogOpen} onOpenChange={(open) => {
                    setIsMenuItemDialogOpen(open);
                    if (!open) {
                      setEditingMenuItem(null);
                      setNewMenuItem({
                        name: '',
                        description: '',
                        category: '',
                        icon_name: 'UtensilsCrossed',
                        is_popular: false,
                        is_signature: false,
                        display_order: 0,
                        price: '',
                        image_url: ''
                      });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Menu Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>{editingMenuItem ? 'Edit' : 'Add'} Menu Item</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="item-name">Item Name *</Label>
                            <Input
                              id="item-name"
                              value={newMenuItem.name}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter item name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item-category">Category *</Label>
                            <Input
                              id="item-category"
                              value={newMenuItem.category}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, category: e.target.value }))}
                              placeholder="e.g., Signature, Royal"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="item-description">Description *</Label>
                          <Textarea
                            id="item-description"
                            value={newMenuItem.description}
                            onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter item description"
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="item-icon">Icon</Label>
                            <select
                              id="item-icon"
                              value={newMenuItem.icon_name}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, icon_name: e.target.value }))}
                              className="w-full px-3 py-2 border rounded-md bg-background"
                            >
                              {iconOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item-order">Display Order</Label>
                            <Input
                              id="item-order"
                              type="number"
                              value={newMenuItem.display_order}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="item-price">Price (SAR)</Label>
                            <Input
                              id="item-price"
                              type="number"
                              step="0.01"
                              value={newMenuItem.price}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: e.target.value }))}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="item-image">Image URL</Label>
                            <Input
                              id="item-image"
                              type="url"
                              value={newMenuItem.image_url}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, image_url: e.target.value }))}
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="item-popular"
                              checked={newMenuItem.is_popular}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, is_popular: e.target.checked }))}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="item-popular">Popular</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="item-signature"
                              checked={newMenuItem.is_signature}
                              onChange={(e) => setNewMenuItem(prev => ({ ...prev, is_signature: e.target.checked }))}
                              className="w-4 h-4"
                            />
                            <Label htmlFor="item-signature">Signature Dish</Label>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setIsMenuItemDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addOrUpdateMenuItem}>
                            {editingMenuItem ? 'Update' : 'Add'} Item
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item) => (
                    <Card key={item.id} className="hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">{item.category}</Badge>
                            {item.is_popular && <Badge variant="destructive">Popular</Badge>}
                            {item.is_signature && <Badge>Signature</Badge>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => editMenuItem(item)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteMenuItem(item.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <div className="mt-3 text-xs text-muted-foreground">Order: {item.display_order}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Menu Categories Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Menu Categories</h2>
                    <p className="text-muted-foreground">Manage menu category sections</p>
                  </div>
                  <Dialog open={isMenuCategoryDialogOpen} onOpenChange={(open) => {
                    setIsMenuCategoryDialogOpen(open);
                    if (!open) {
                      setEditingMenuCategory(null);
                      setNewMenuCategory({
                        name: '',
                        description: '',
                        display_order: 0
                      });
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{editingMenuCategory ? 'Edit' : 'Add'} Menu Category</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="cat-name">Category Name *</Label>
                          <Input
                            id="cat-name"
                            value={newMenuCategory.name}
                            onChange={(e) => setNewMenuCategory(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Indian Cuisine"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cat-description">Description *</Label>
                          <Textarea
                            id="cat-description"
                            value={newMenuCategory.description}
                            onChange={(e) => setNewMenuCategory(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Enter category description"
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cat-order">Display Order</Label>
                          <Input
                            id="cat-order"
                            type="number"
                            value={newMenuCategory.display_order}
                            onChange={(e) => setNewMenuCategory(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                            placeholder="0"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setIsMenuCategoryDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={addOrUpdateMenuCategory}>
                            {editingMenuCategory ? 'Update' : 'Add'} Category
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuCategories.map((category) => (
                    <Card key={category.id} className="hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => editMenuCategory(category)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteMenuCategory(category.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <div className="mt-3 text-xs text-muted-foreground">Order: {category.display_order}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;