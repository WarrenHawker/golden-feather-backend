import mongoose from 'mongoose';

const initializeMongoDatabase = async () => {
  const mongodb = process.env.MONGO_DB || 'mongodb://localhost:8080';

  // Connect to the MongoDB server
  await mongoose.connect(mongodb, {
    dbName: 'golden_feather',
  });

  const db = mongoose.connection;
};

export default initializeMongoDatabase;
