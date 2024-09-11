import { MongoClient } from "mongodb"
import { readFileSync } from "fs"
import { join } from "path"
import dotenv from "dotenv"

dotenv.config()

// MongoDB connection URI and Database details
const uri = process.env.MONGO_URI
const dbName = "sudoku"
const collectionName = "puzzles"

// Connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(uri)
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    return client
  } catch (err) {
    console.error("MongoDB Connection Error:", err)
    process.exit(1)
  }
}

// Function to insert puzzles from the text file into MongoDB
async function insertPuzzlesFromFile(filePath) {
  const client = await connectToMongoDB()
  const db = client.db(dbName)
  const collection = db.collection(collectionName)

  const fileData = readFileSync(filePath, "utf8")
  const lines = fileData.split("\n")

  const puzzles = []

  for (let i = 0; i < 1000; i++) {
    if (lines[i]) {
      const parts = lines[i].trim().split(/\s+/) // Split based on whitespace
      if (parts.length === 3) {
        puzzles.push({
          puzzle: parts[1],
          difficulty: parseFloat(parts[2])
        })
      }
    }
  }

  // Insert data into MongoDB
  await collection.insertMany(puzzles)
  console.log("Data inserted successfully!")

  // Close the client
  await client.close()
}

// Call the function with your file path
const filePath = join(process.env.PUZZLES_FILE_PATH) // Adjust the file path as necessary
insertPuzzlesFromFile(filePath)
