import mongoose from "mongoose";

export const dbConnection = async () => {
  const uri = process.env.DATABASE_URI;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection established!");
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
  }
};
