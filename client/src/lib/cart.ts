import { apiRequest, queryClient } from "./queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

// Make sure we have a session ID for cart identification
export const ensureSessionId = (): string => {
  let sessionId = localStorage.getItem("sessionId");
  
  if (!sessionId) {
    // Generate a pseudo-UUID
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    localStorage.setItem("sessionId", sessionId);
  }
  
  return sessionId;
};

// Get cart data from the API
export const useCart = () => {
  // Ensure we have a session ID before fetching cart
  const sessionId = ensureSessionId();
  
  return useQuery({
    queryKey: ["/api/cart"],
    staleTime: 0,
    // Force a refetch when the component mounts
    refetchOnMount: true,
    // Make sure the session ID is evaluated here which helps ensure it exists
    meta: {
      sessionId
    }
  });
};

// Add item to cart
export const useAddToCart = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ 
      productId, 
      quantity, 
      color, 
      size 
    }: { 
      productId: number, 
      quantity: number, 
      color: string, 
      size: string 
    }) => {
      // Ensure we have a session ID
      ensureSessionId();
      
      return apiRequest("POST", "/api/cart/items", {
        productId,
        quantity,
        color,
        size,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not add to cart. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Update cart item quantity
export const useUpdateCartItem = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      return apiRequest("PUT", `/api/cart/items/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    }
  });
};

// Remove item from cart
export const useRemoveFromCart = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cart/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove cart item",
        variant: "destructive",
      });
    }
  });
};

// Calculate cart totals
export const calculateCartTotals = (items: any[] = []) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  return {
    subtotal,
    shipping,
    tax,
    total
  };
};
