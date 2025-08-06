import mongoose from "mongoose";

const connnectToDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log("Successfully connected to DB");
  } catch (err) {
    console.log("Could not connect to DB");
    console.log(err);
  }
};

export default connnectToDB;
