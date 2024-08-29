import mongoose, { model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { LogRequestData, LogData } from '../../types/log';
const { Schema } = mongoose;

const logRequestDataSchema = new Schema<LogRequestData>(
  {
    url: { type: String, required: true },
    method: {
      type: String,
      enum: ['GET', 'POST', 'PATCH', 'DELETE'],
      required: true,
    },
    ip: { type: String, required: true },
    body: { type: Object },
    headers: { type: Object },
  },
  { _id: false }
);

export const logSchema = new Schema(
  {
    level: {
      type: String,
      required: true,
      enum: ['info', 'warn', 'error', 'critical'],
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    responseCode: {
      type: Number,
      required: true,
    },
    request: {
      type: logRequestDataSchema,
      required: true,
    },
  },
  { versionKey: false }
);

logSchema.plugin(paginate);

export const getLogModelForMonth = async (collectionName: string) => {
  const db = mongoose.connection.db;

  // Check if the collection exists
  const collections = await db
    .listCollections({ name: collectionName })
    .toArray();

  if (collections.length === 0) {
    // Create the collection with zstd compression
    await db.createCollection(collectionName, {
      storageEngine: {
        wiredTiger: {
          configString: 'block_compressor=zstd',
        },
      },
    });
    console.log(`Created collection ${collectionName} with zstd compression.`);
  }

  // Return the Mongoose model for the collection
  return model<LogDocument, mongoose.PaginateModel<LogDocument>>(
    collectionName,
    logSchema,
    collectionName
  );
};

interface LogDocument extends mongoose.Document, LogData {}
