import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import { insertCartItemSchema, insertCartSchema, insertOrderItemSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Product routes
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/featured", async (_req, res) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.get("/api/collections/:collection", async (req, res) => {
    try {
      const { collection } = req.params;
      const products = await storage.getProductsByCollection(collection);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching collection" });
    }
  });

  app.get("/api/categories/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      // Use session ID from cookie or generate a new one
      let sessionId = req.headers["x-session-id"] as string;
      if (!sessionId) {
        sessionId = randomUUID();
        res.setHeader("X-Session-ID", sessionId);
      }

      // Get or create cart
      let cart = await storage.getCart(sessionId);
      if (!cart) {
        cart = await storage.createCart({
          sessionId,
          userId: null
        });
      }

      // Get cart items with product details
      const cartItems = await storage.getCartItems(cart.id);
      
      // Fetch product details for each cart item
      const cartItemsWithDetails = await Promise.all(
        cartItems.map(async (item) => {
          const product = await storage.getProduct(item.productId);
          return {
            ...item,
            product
          };
        })
      );

      res.json({
        cart,
        items: cartItemsWithDetails
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching cart" });
    }
  });

  app.post("/api/cart/items", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }

      // Validate request body
      const validatedData = insertCartItemSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid cart item data" });
      }

      // Get or create cart
      let cart = await storage.getCart(sessionId);
      if (!cart) {
        cart = await storage.createCart({
          sessionId,
          userId: null
        });
      }

      const { productId, quantity, color, size } = validatedData.data;

      // Check if product exists
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Check if item already exists in cart
      const existingItem = await storage.getCartItem(cart.id, productId, color, size);
      
      let cartItem;
      if (existingItem) {
        // Update quantity
        cartItem = await storage.updateCartItemQuantity(
          existingItem.id, 
          existingItem.quantity + quantity
        );
      } else {
        // Create new cart item
        cartItem = await storage.createCartItem({
          cartId: cart.id,
          productId,
          quantity,
          color,
          size
        });
      }

      res.status(201).json(cartItem);
    } catch (error) {
      res.status(500).json({ message: "Error adding item to cart" });
    }
  });

  app.put("/api/cart/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      // Validate request body
      const quantitySchema = z.object({
        quantity: z.number().min(1)
      });
      
      const validatedData = quantitySchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid quantity" });
      }

      const { quantity } = validatedData.data;

      const updatedItem = await storage.updateCartItemQuantity(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Error updating cart item" });
    }
  });

  app.delete("/api/cart/items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const result = await storage.deleteCartItem(id);
      if (!result) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error removing item from cart" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertOrderSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: "Invalid order data" });
      }

      // Create order
      const order = await storage.createOrder(validatedData.data);

      // Add order items if provided
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const validatedItem = insertOrderItemSchema.safeParse({
            ...item,
            orderId: order.id
          });
          
          if (validatedItem.success) {
            await storage.createOrderItem(validatedItem.data);
          }
        }
      }

      // Get order with items
      const orderItems = await storage.getOrderItems(order.id);

      res.status(201).json({
        ...order,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid order ID" });
      }

      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const orderItems = await storage.getOrderItems(order.id);

      res.json({
        ...order,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  // Quiz routes
  app.get("/api/quizzes", async (_req, res) => {
    try {
      const quizzes = await storage.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quizzes" });
    }
  });

  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quiz ID" });
      }

      const quizData = await storage.getQuizWithQuestionsAndOptions(id);
      if (!quizData) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      res.json(quizData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching quiz" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
