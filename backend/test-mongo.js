// Test MongoDB connection
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dewdunuc1990_db_user:OGzaMfgY6Q041wjs@smartcampus.eylks8s.mongodb.net/smartcampus?appName=SmartCampus";

async function testConnection() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        
        const database = client.db("smartcampus");
        const collections = await database.listCollections().toArray();
        console.log("Collections:", collections.map(c => c.name));
        
        // Test inserting a document
        const resources = database.collection("resources");
        const testDoc = {
            name: "Test Resource",
            type: "Lecture Hall",
            capacity: 100,
            location: "Engineering Building",
            status: "Active",
            description: "Test resource for connection verification"
        };
        
        const result = await resources.insertOne(testDoc);
        console.log("Inserted document with ID:", result.insertedId);
        
        // Verify it was inserted
        const count = await resources.countDocuments();
        console.log("Total resources in collection:", count);
        
    } catch (error) {
        console.error("MongoDB connection error:", error);
    } finally {
        await client.close();
    }
}

testConnection();
