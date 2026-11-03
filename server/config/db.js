import mongoose from 'mongoose';

export let isConnectedToMongo = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';

  try {
    mongoose.set('strictQuery', false);
    // Connect with a 2-second timeout to quickly detect if local mongo exists
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnectedToMongo = true;
    console.log(`✅ [MongoDB] Connected successfully to: ${uri}`);
  } catch (err) {
    isConnectedToMongo = false;
    console.log(`ℹ️ [MongoDB] Live MongoDB server not reachable at ${uri}`);
    console.log(`🚀 [Express & MERN Backend] Running with in-memory Mongo Document Engine fallback.`);
    console.log(`   (Provide MONGODB_URI in .env to connect to MongoDB Atlas or local MongoDB)`);
  }
}

