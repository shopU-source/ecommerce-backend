import mongoose from "mongoose";

const connectionToDB = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);
    if (connection) {
      console.log(`Connected to DB: ${connection.host}`);
    } else {
      console.log("Database connection failed");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectionToDB;
