import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import bcrypt from "bcrypt";

const foodSeeds = [
  { name: "Greek salad", price: 12, category: "Salad", image: "1722865444288food_1.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg salad", price: 18, category: "Salad", image: "1722865514626food_2.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Clover Salad", price: 16, category: "Salad", image: "1722865628915food_3.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Salad", price: 24, category: "Salad", image: "1722865668073food_4.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Lasagna Rolls", price: 14, category: "Rolls", image: "1722865738489food_5.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Peri Peri Rolls", price: 12, category: "Rolls", image: "1722865934153food_6.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Rolls", price: 20, category: "Rolls", image: "1722865976487food_7.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg Rolls", price: 15, category: "Rolls", image: "1722866043779food_8.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Ripple Ice Cream", price: 14, category: "Deserts", image: "1722866109947food_9.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Fruit Ice Cream", price: 22, category: "Deserts", image: "1722866148130food_10.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Jar Ice Cream", price: 10, category: "Deserts", image: "1722866329894food_11.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vanilla Ice Cream", price: 12, category: "Deserts", image: "1722866385025food_12.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Sandwich", price: 12, category: "Sandwich", image: "1722866412882food_13.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vegan Sandwich", price: 18, category: "Sandwich", image: "1722866469319food_14.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Grilled Sandwich", price: 16, category: "Sandwich", image: "1722866504992food_15.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Bread Sandwich", price: 24, category: "Sandwich", image: "1722866560218food_16.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cup Cake", price: 14, category: "Cake", image: "1722866610567food_17.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Vegan Cake", price: 12, category: "Cake", image: "1722866647952food_18.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Butterscotch Cake", price: 20, category: "Cake", image: "1722866694357food_19.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Sliced Cake", price: 15, category: "Cake", image: "1722866729053food_20.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Garlic Mushroom", price: 14, category: "Pure Veg", image: "1722866777756food_21.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Fried Cauliflower", price: 22, category: "Pure Veg", image: "1722866830901food_22.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Mix Veg Pulao", price: 10, category: "Pure Veg", image: "1722866871307food_23.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Rice Zucchini", price: 12, category: "Pure Veg", image: "1722866909328food_24.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cheese Pasta", price: 12, category: "Pasta", image: "1722866948105food_25.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Tomato Pasta", price: 18, category: "Pasta", image: "1722867018540food_26.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Creamy Pasta", price: 16, category: "Pasta", image: "1722867053413food_27.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Chicken Pasta", price: 24, category: "Pasta", image: "1722867110108food_28.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Buttter Noodles", price: 14, category: "Noodles", image: "1722867144188food_29.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Veg Noodles", price: 12, category: "Noodles", image: "1722867222977food_30.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Somen Noodles", price: 20, category: "Noodles", image: "1722867254829food_31.png", description: "Food provides essential nutrients for overall health and well-being" },
  { name: "Cooked Noodles", price: 15, category: "Noodles", image: "1722867630288food_32.png", description: "Food provides essential nutrients for overall health and well-being" }
];

export const connectDB = async () => {
  let mongoUrl = process.env.MONGO_URL;

  if (!mongoUrl) {
    console.log("No MONGO_URL found in environment variables. Starting mongodb-memory-server...");
    const mongoServer = await MongoMemoryServer.create();
    mongoUrl = mongoServer.getUri();
    console.log(`mongodb-memory-server started at: ${mongoUrl}`);
  }

  await mongoose
    .connect(mongoUrl)
    .then(async () => {
      console.log("DB Connected");
      
      // Auto-seed admin user
      const adminEmail = "admin@tomato.com";
      const adminExists = await userModel.findOne({ email: adminEmail });
      if (!adminExists) {
        console.log("Seeding default admin user...");
        const saltVal = process.env.SALT ? Number(process.env.SALT) : 10;
        const salt = await bcrypt.genSalt(saltVal);
        const hashedPassword = await bcrypt.hash("adminpassword123", salt);
        const newAdmin = new userModel({
          name: "Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin"
        });
        await newAdmin.save();
        console.log("Admin user seeded successfully. (Email: admin@tomato.com, Password: adminpassword123)");
      }

      // Auto-seed food items
      const foodCount = await foodModel.countDocuments({});
      if (foodCount === 0) {
        console.log("Seeding default food items...");
        await foodModel.insertMany(foodSeeds);
        console.log(`Successfully seeded ${foodSeeds.length} food items.`);
      }
    })
    .catch((err) => console.error("Database connection error:", err));
};
