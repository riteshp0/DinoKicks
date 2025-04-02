import { db } from "./db";
import {
  products,
  quizzes,
  quizQuestions,
  quizOptions,
  InsertProduct,
  InsertQuiz,
  InsertQuizQuestion,
  InsertQuizOption
} from "@shared/schema";

export async function initializeDatabase() {
  try {
    // Check if we already have products
    const existingProducts = await db.select().from(products);
    
    if (existingProducts.length === 0) {
      console.log('Initializing database with sample data...');
      
      // Sample products data
      const productData: InsertProduct[] = [
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
          stock: 22
        },
        {
          name: "Brontoboots",
          description: "Heavy-duty comfort inspired by the gentle giants of the dinosaur world.",
          price: 139.99,
          imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
          imageUrls: [
            "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
          ],
          category: "Walking",
          collection: "Herbivore Collection",
          colors: ["#D2B48C", "#008080", "#2E8B57"],
          sizes: ["7", "8", "9", "10", "11", "12"],
          isFeatured: false,
          badge: "",
          dinoFacts: "Inspired by the mighty Brontosaurus, these boots feature extra cushioning to support your weight, just like the Brontosaurus' sturdy legs supported its massive body. The footprint tread pattern is based on actual fossilized Brontosaurus tracks.",
          stock: 15
        },
        {
          name: "Pterodactyl Flight",
          description: "Lightweight runners that make you feel like you're flying.",
          price: 159.99,
          imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
          imageUrls: [
            "https://images.unsplash.com/photo-1552346154-21d32810aba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw0fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1579298245158-33e8f568f7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1543508282-6319a3e2621f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw1fHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
          ],
          category: "Running",
          collection: "Sky Series",
          colors: ["#39FF14", "#ADD8E6", "#FF5714"],
          sizes: ["6", "7", "8", "9", "10", "11"],
          isFeatured: false,
          badge: "LIGHT",
          dinoFacts: "Inspired by the flying Pterodactyl, these ultralight shoes feature an aerodynamic design. The uppers are made with a special mesh pattern that mimics the wing membrane of pterosaurs. The wing-like tongue helps create a snug, comfortable fit.",
          stock: 12
        },
        {
          name: "Parasaurolophus Pumps",
          description: "Make a statement with these bold, crest-inspired athletic shoes.",
          price: 134.99,
          imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
          imageUrls: [
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzfHxkaW5vc2F1ciUyMHRoZW1lZCUyMHNuZWFrZXJzfGVufDB8fHx8MTY5NzUyNDA2MHww&ixlib=rb-4.0.3&q=80&w=1080",
            "https://images.unsplash.com/photo-1465479423260-c4afc24172c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxzbmVha2VyJTIwbGlmZXN0eWxlJTIwcGhvdG9zfGVufDB8fHx8MTY5NzUyNDI3NHww&ixlib=rb-4.0.3&q=80&w=1080"
          ],
          category: "Basketball",
          collection: "Herbivore Collection",
          colors: ["#FF5714", "#008080", "#39FF14"],
          sizes: ["7", "8", "9", "10", "11", "12", "13"],
          isFeatured: false,
          badge: "",
          dinoFacts: "These shoes feature a distinctive high-top design inspired by the Parasaurolophus's famous cranial crest. The crest served as a resonating chamber, and these shoes are designed with acoustic-inspired cushioning. Side panels feature patterns inspired by Parasaurolophus fossil skin impressions.",
          stock: 16
        }
      ];

      // Insert products
      await db.insert(products).values(productData);
      console.log(`Inserted ${productData.length} products`);
      
      // Initialize quiz
      const quizData: InsertQuiz = {
        name: "Which Dino Kick Are You?",
        description: "Find your perfect prehistoric pair!"
      };
      
      const [quiz] = await db.insert(quizzes).values(quizData).returning();
      console.log(`Created quiz: ${quiz.name}`);
      
      // Quiz questions
      const questionData: InsertQuizQuestion[] = [
        {
          quizId: quiz.id,
          question: "What's your favorite dinosaur?",
          order: 1
        },
        {
          quizId: quiz.id,
          question: "How would you describe your style?",
          order: 2
        },
        {
          quizId: quiz.id,
          question: "When do you typically wear sneakers?",
          order: 3
        }
      ];
      
      // Insert questions and track their IDs
      const questionIds = [];
      for (const question of questionData) {
        const [inserted] = await db.insert(quizQuestions).values(question).returning();
        questionIds.push(inserted.id);
      }
      
      console.log(`Created ${questionIds.length} quiz questions`);
      
      // Get product IDs for reference in options
      const allProducts = await db.select({ id: products.id }).from(products);
      const productIds = allProducts.map(p => p.id);
      
      // Options for Question 1
      const options1: InsertQuizOption[] = [
        {
          questionId: questionIds[0],
          text: "T-Rex - fierce and powerful",
          productId: productIds[0], // T-Rex Trappers
          order: 1
        },
        {
          questionId: questionIds[0],
          text: "Velociraptor - fast and agile",
          productId: productIds[1], // Volcano Velociraptors
          order: 2
        },
        {
          questionId: questionIds[0],
          text: "Stegosaurus - unique and sturdy",
          productId: productIds[2], // Stegosaurus Steppers
          order: 3
        },
        {
          questionId: questionIds[0],
          text: "Pterodactyl - high-flying and free",
          productId: productIds[4], // Pterodactyl Flight
          order: 4
        }
      ];
      
      // Options for Question 2
      const options2: InsertQuizOption[] = [
        {
          questionId: questionIds[1],
          text: "Bold and bright - I want to stand out!",
          productId: productIds[0], // T-Rex Trappers
          order: 1
        },
        {
          questionId: questionIds[1],
          text: "Sleek and sporty - performance matters",
          productId: productIds[1], // Volcano Velociraptors
          order: 2
        },
        {
          questionId: questionIds[1],
          text: "Earthy and natural - comfort is key",
          productId: productIds[3], // Brontoboots
          order: 3
        },
        {
          questionId: questionIds[1],
          text: "Unique and eye-catching - I set trends",
          productId: productIds[5], // Parasaurolophus Pumps
          order: 4
        }
      ];
      
      // Options for Question 3
      const options3: InsertQuizOption[] = [
        {
          questionId: questionIds[2],
          text: "Working out or running",
          productId: productIds[4], // Pterodactyl Flight
          order: 1
        },
        {
          questionId: questionIds[2],
          text: "Casual everyday wear",
          productId: productIds[2], // Stegosaurus Steppers
          order: 2
        },
        {
          questionId: questionIds[2],
          text: "Playing sports with friends",
          productId: productIds[1], // Volcano Velociraptors
          order: 3
        },
        {
          questionId: questionIds[2],
          text: "Making a fashion statement",
          productId: productIds[0], // T-Rex Trappers
          order: 4
        }
      ];
      
      // Insert all options
      await db.insert(quizOptions).values([...options1, ...options2, ...options3]);
      console.log('Added quiz options');
      
      console.log('Database initialization complete!');
    } else {
      console.log(`Database already contains ${existingProducts.length} products. Skipping initialization.`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}