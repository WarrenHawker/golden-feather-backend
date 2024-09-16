import mongoose, { model, PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

// LogData interface that matches the structure of the logSchema
export interface LogData {
  logLevel: 'info' | 'error' | 'critical';
  timestamp: string;
  responseTimeMS: number | null;
  url: string;
  method: string;
  code: number;
  headers: {
    userAgent: string;
    referer?: string | null;
    contentType?: string;
    authorization?: 'present' | 'absent';
  };
  message?: string;
  detailedMessage?: string;
  ip?: string;
  body?: any;
  userId?: string;
  stackTrace?: string;
  captchaResult?: string;
}

// LogDocument that extends mongoose.Document and LogData
interface LogDocument extends mongoose.Document, LogData {}

// Log schema definition
export const logSchema = new Schema<LogDocument>(
  {
    logLevel: { type: String, required: true },
    timestamp: { type: String, required: true },
    responseTimeMS: { type: Number || null },
    url: { type: String, required: true },
    method: { type: String, required: true },
    code: { type: Number, required: true },
    headers: {
      userAgent: { type: String, required: true },
      referer: { type: String || null },
      contentType: { type: String },
      authorization: { type: String },
    },
    message: { type: String },
    detailedMessage: { type: String },
    captchaResult: { type: String },
    ip: { type: String },
    body: { type: mongoose.Schema.Types.Mixed },
    userId: { type: String },
  },
  { versionKey: false }
);

// Apply the pagination plugin to the schema
logSchema.plugin(paginate);

// Function to return the paginated model for the specified collection
export const getLogModelForMonth = async (
  collectionName: string
): Promise<PaginateModel<LogDocument>> => {
  const db = mongoose.connection.db;

  try {
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
    }

    // Return the Mongoose model for the collection
    return model<LogDocument, PaginateModel<LogDocument>>(
      collectionName,
      logSchema,
      collectionName
    );
  } catch (error) {
    console.error(`Error creating collection ${collectionName}:`, error);
    throw error; // Rethrow error to be handled by calling code
  }
};
