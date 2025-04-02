import { 
  Product, InsertProduct, 
  Order, InsertOrder, 
  OrderItem, InsertOrderItem,
  Cart, InsertCart,
  CartItem, InsertCartItem,
  Quiz, InsertQuiz,
  QuizQuestion, InsertQuizQuestion,
  QuizOption, InsertQuizOption,
  products,
  orders,
  orderItems,
  carts,
  cartItems,
  quizzes,
  quizQuestions,
  quizOptions
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for all storage methods
export interface IStorage {
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductsByCollection(collection: string): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Order items methods
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;

  // Cart methods
  getCart(sessionId: string): Promise<Cart | undefined>;
  createCart(cart: InsertCart): Promise<Cart>;
  deleteCart(id: number): Promise<boolean>;

  // Cart items methods
  getCartItems(cartId: number): Promise<CartItem[]>;
  getCartItem(cartId: number, productId: number, color: string, size: string): Promise<CartItem | undefined>;
  createCartItem(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  deleteCartItem(id: number): Promise<boolean>;

  // Quiz methods
  getQuizzes(): Promise<Quiz[]>;
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizWithQuestionsAndOptions(id: number): Promise<{ 
    quiz: Quiz, 
    questions: (QuizQuestion & { options: QuizOption[] })[] 
  } | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;

  // Quiz questions and options methods
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  getQuizOptions(questionId: number): Promise<QuizOption[]>;
  createQuizOption(option: InsertQuizOption): Promise<QuizOption>;
}

// Implementation of the storage interface using in-memory maps
export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private carts: Map<number, Cart>;
  private cartItems: Map<number, CartItem>;
  private quizzes: Map<number, Quiz>;
  private quizQuestions: Map<number, QuizQuestion>;
  private quizOptions: Map<number, QuizOption>;
  
  // Keep track of the current IDs
  private currentIds: {
    product: number;
    order: number;
    orderItem: number;
    cart: number;
    cartItem: number;
    quiz: number;
    quizQuestion: number;
    quizOption: number;
  };

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.carts = new Map();
    this.cartItems = new Map();
    this.quizzes = new Map();
    this.quizQuestions = new Map();
    this.quizOptions = new Map();
    
    this.currentIds = {
      product: 1,
      order: 1,
      orderItem: 1,
      cart: 1,
      cartItem: 1,
      quiz: 1,
      quizQuestion: 1,
      quizOption: 1
    };

    // Initialize with some products
    this.initializeProducts();
    this.initializeQuiz();
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.isFeatured);
  }

  async getProductsByCollection(collection: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.collection.toLowerCase() === collection.toLowerCase()
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentIds.product++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentIds.order++;
    const order: Order = { 
      ...insertOrder, 
      id, 
      createdAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Order items methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.currentIds.orderItem++;
    const orderItem: OrderItem = { ...insertOrderItem, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  // Cart methods
  async getCart(sessionId: string): Promise<Cart | undefined> {
    return Array.from(this.carts.values()).find(
      cart => cart.sessionId === sessionId
    );
  }

  async createCart(insertCart: InsertCart): Promise<Cart> {
    const id = this.currentIds.cart++;
    const cart: Cart = { 
      ...insertCart, 
      id, 
      createdAt: new Date()
    };
    this.carts.set(id, cart);
    return cart;
  }

  async deleteCart(id: number): Promise<boolean> {
    return this.carts.delete(id);
  }

  // Cart items methods
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      item => item.cartId === cartId
    );
  }

  async getCartItem(cartId: number, productId: number, color: string, size: string): Promise<CartItem | undefined> {
    return Array.from(this.cartItems.values()).find(
      item => item.cartId === cartId && 
             item.productId === productId && 
             item.color === color &&
             item.size === size
    );
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const id = this.currentIds.cartItem++;
    const cartItem: CartItem = { ...insertCartItem, id };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;

    const updatedCartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async getQuizWithQuestionsAndOptions(id: number): Promise<{ 
    quiz: Quiz, 
    questions: (QuizQuestion & { options: QuizOption[] })[] 
  } | undefined> {
    const quiz = await this.getQuiz(id);
    if (!quiz) return undefined;

    const questions = await this.getQuizQuestions(id);
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await this.getQuizOptions(question.id);
        return { ...question, options };
      })
    );

    return {
      quiz,
      questions: questionsWithOptions
    };
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentIds.quiz++;
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }

  // Quiz questions and options methods
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values())
      .filter(question => question.quizId === quizId)
      .sort((a, b) => a.order - b.order);
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const id = this.currentIds.quizQuestion++;
    const question: QuizQuestion = { ...insertQuestion, id };
    this.quizQuestions.set(id, question);
    return question;
  }

  async getQuizOptions(questionId: number): Promise<QuizOption[]> {
    return Array.from(this.quizOptions.values())
      .filter(option => option.questionId === questionId)
      .sort((a, b) => a.order - b.order);
  }

  async createQuizOption(insertOption: InsertQuizOption): Promise<QuizOption> {
    const id = this.currentIds.quizOption++;
    const option: QuizOption = { ...insertOption, id };
    this.quizOptions.set(id, option);
    return option;
  }

  // Initialize products
  private initializeProducts() {
    const products: InsertProduct[] = [
      {
        name: "T-Rex Trappers",
        description: "Dominate the urban jungle with these fierce T-Rex inspired kicks.",
        price: 129.99,
        imageUrl: "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
        imageUrls: [
          "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080"
        ],
        category: "Running",
        collection: "T-Rex Line",
        colors: ["#39FF14", "#FF5714", "#008080"],
        sizes: ["7", "8", "9", "10", "11", "12", "13", "14"],
        isFeatured: true,
        badge: "HOT!",
        dinoFacts: "These fierce kicks are inspired by the king of dinosaurs, the mighty Tyrannosaurus Rex! Grip pattern inspired by authentic T-Rex footprints. Scale-textured side panels for durability and style. Custom \"bite mark\" sole design provides superior traction.",
        stock: 25
      },
      {
        name: "Volcano Velociraptors",
        description: "Speed and agility inspired by the fastest dinosaurs ever known.",
        price: 149.99,
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
        imageUrls: [
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
        ],
        category: "Running",
        collection: "Raptor Series",
        colors: ["#FF5714", "#2E8B57", "#D2B48C"],
        sizes: ["7", "8", "9", "10", "11", "12"],
        isFeatured: true,
        badge: "NEW",
        dinoFacts: "Inspired by the lightning-fast Velociraptor, these shoes feature a special claw-shaped traction pattern for optimal grip. The streamlined design mimics a raptor's aerodynamic body for maximum speed. Side panels feature a scale pattern based on actual velociraptor fossil discoveries.",
        stock: 18
      },
      {
        name: "Stegosaurus Steppers",
        description: "Armored comfort with spikes inspired by Stegosaurus plates.",
        price: 119.99,
        imageUrl: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
        imageUrls: [
          "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1465479423260-c4afc24172c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
        ],
        category: "Casual",
        collection: "Herbivore Collection",
        colors: ["#008080", "#39FF14", "#D2B48C"],
        sizes: ["6", "7", "8", "9", "10", "11", "12"],
        isFeatured: true,
        badge: "",
        dinoFacts: "The unique design of these shoes is inspired by the armored plates of the Stegosaurus. The heel guard is modeled after the thagomizer (tail spikes) that protected this dinosaur from predators. Extra cushioning in the sole mimics the sturdy build of this herbivore.",
        stock: 20
      },
      {
        name: "Brontobasics",
        description: "Classic comfort with the gentle giant's stability and support.",
        price: 99.99,
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
        imageUrls: [
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
        ],
        category: "Casual",
        collection: "Herbivore Collection",
        colors: ["#2E8B57", "#D2B48C", "#008080"],
        sizes: ["7", "8", "9", "10", "11", "12", "13"],
        isFeatured: true,
        badge: "",
        dinoFacts: "Named after the gentle giant Brontosaurus, these shoes provide maximum support and stability. The wide base mimics the sturdy stance of these massive dinosaurs. Special cushioning system absorbs impact just like the Brontosaurus' padded feet would have.",
        stock: 30
      },
      {
        name: "Pterodactyl Flyers",
        description: "Lightweight shoes designed for maximum speed and minimal weight.",
        price: 139.99,
        imageUrl: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
        imageUrls: [
          "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
        ],
        category: "Running",
        collection: "Flying Dinosaurs",
        colors: ["#39FF14", "#008080", "#FF5714"],
        sizes: ["7", "8", "9", "10", "11", "12"],
        isFeatured: false,
        badge: "LIMITED",
        dinoFacts: "Inspired by the flying Pterodactyl, these shoes are our lightest model ever. The unique wing-like flaps on the sides provide better airflow and cooling. The thin, flexible sole mimics the adaptable feet of these prehistoric flyers.",
        stock: 15
      },
      {
        name: "Triceratops Treads",
        description: "Rugged, durable shoes with triple-reinforced protection.",
        price: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
        imageUrls: [
          "https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
        ],
        category: "Trail",
        collection: "Herbivore Collection",
        colors: ["#D2B48C", "#2E8B57", "#FF5714"],
        sizes: ["8", "9", "10", "11", "12", "13"],
        isFeatured: false,
        badge: "",
        dinoFacts: "Inspired by the triple-horned Triceratops, these shoes feature three reinforced protection points. The tough exterior is modeled after the Triceratops' famous frill. Special resistant material pays homage to this dinosaur's defensive capabilities.",
        stock: 22
      }
    ];

    // Add products to the map
    products.forEach(product => {
      this.createProduct(product);
    });
  }

  // Initialize quiz data
  private async initializeQuiz() {
    // Create the quiz
    const quiz = await this.createQuiz({
      name: "Which Dino Kick Are You?",
      description: "Take our quick quiz to discover your perfect prehistoric match!"
    });

    // Create questions and options
    const questions = [
      {
        question: "What's your preferred terrain?",
        options: [
          { text: "Rugged Trails", productId: 6 },
          { text: "Urban Jungle", productId: 1 },
          { text: "Forest Paths", productId: 3 },
          { text: "Track & Field", productId: 2 }
        ]
      },
      {
        question: "What's your spirit dinosaur?",
        options: [
          { text: "T-Rex - Powerful and Dominant", productId: 1 },
          { text: "Velociraptor - Fast and Smart", productId: 2 },
          { text: "Triceratops - Strong and Protective", productId: 6 },
          { text: "Pterodactyl - Light and Free", productId: 5 }
        ]
      },
      {
        question: "What's your favorite color?",
        options: [
          { text: "Neon Green", productId: 1 },
          { text: "Volcanic Orange", productId: 2 },
          { text: "Deep Teal", productId: 3 },
          { text: "Jungle Green", productId: 4 }
        ]
      }
    ];

    for (let i = 0; i < questions.length; i++) {
      const question = await this.createQuizQuestion({
        quizId: quiz.id,
        question: questions[i].question,
        order: i + 1
      });

      for (let j = 0; j < questions[i].options.length; j++) {
        await this.createQuizOption({
          questionId: question.id,
          text: questions[i].options[j].text,
          productId: questions[i].options[j].productId,
          order: j + 1
        });
      }
    }
  }
}

// DatabaseStorage implements IStorage using PostgreSQL and Drizzle ORM
export class DatabaseStorage implements IStorage {
  // Product methods
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.isFeatured, true));
  }

  async getProductsByCollection(collection: string): Promise<Product[]> {
    return db.select().from(products).where(
      eq(products.collection, collection)
    );
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(
      eq(products.category, category)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(updates)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return !!result.rowCount && result.rowCount > 0;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // Order items methods
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [orderItem] = await db.insert(orderItems).values(insertOrderItem).returning();
    return orderItem;
  }

  // Cart methods
  async getCart(sessionId: string): Promise<Cart | undefined> {
    const [cart] = await db.select().from(carts).where(eq(carts.sessionId, sessionId));
    return cart;
  }

  async createCart(insertCart: InsertCart): Promise<Cart> {
    const [cart] = await db.insert(carts).values(insertCart).returning();
    return cart;
  }

  async deleteCart(id: number): Promise<boolean> {
    const result = await db.delete(carts).where(eq(carts.id, id));
    return !!result.rowCount && result.rowCount > 0;
  }

  // Cart items methods
  async getCartItems(cartId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async getCartItem(cartId: number, productId: number, color: string, size: string): Promise<CartItem | undefined> {
    const [cartItem] = await db.select().from(cartItems).where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId),
        eq(cartItems.color, color),
        eq(cartItems.size, size)
      )
    );
    return cartItem;
  }

  async createCartItem(insertCartItem: InsertCartItem): Promise<CartItem> {
    const [cartItem] = await db.insert(cartItems).values(insertCartItem).returning();
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedCartItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedCartItem;
  }

  async deleteCartItem(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return !!result.rowCount && result.rowCount > 0;
  }

  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    return db.select().from(quizzes);
  }

  async getQuiz(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz;
  }

  async getQuizWithQuestionsAndOptions(id: number): Promise<{ 
    quiz: Quiz, 
    questions: (QuizQuestion & { options: QuizOption[] })[] 
  } | undefined> {
    const quiz = await this.getQuiz(id);
    if (!quiz) return undefined;

    const questions = await this.getQuizQuestions(id);
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await this.getQuizOptions(question.id);
        return { ...question, options };
      })
    );

    return {
      quiz,
      questions: questionsWithOptions
    };
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db.insert(quizzes).values(insertQuiz).returning();
    return quiz;
  }

  // Quiz questions and options methods
  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return db.select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);
  }

  async createQuizQuestion(insertQuestion: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db.insert(quizQuestions).values(insertQuestion).returning();
    return question;
  }

  async getQuizOptions(questionId: number): Promise<QuizOption[]> {
    return db.select()
      .from(quizOptions)
      .where(eq(quizOptions.questionId, questionId))
      .orderBy(quizOptions.order);
  }

  async createQuizOption(insertOption: InsertQuizOption): Promise<QuizOption> {
    const [option] = await db.insert(quizOptions).values(insertOption).returning();
    return option;
  }
}

// Use the database storage
export const storage = new DatabaseStorage();
