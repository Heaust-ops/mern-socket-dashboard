import dotenv from 'dotenv';

dotenv.config();

// DECLARE ALL VARIABLES
const SERVER_PORT = process.env.SERVER_PORT || 5000;

// Set the MongoDB URL based on the NODE_ENV
const MONGO_URL = `mongodb://mongodb:27017/app`;

//CREATE CONFIG OBJECT
const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};

config.mongo.url = MONGO_URL;
config.server.port = SERVER_PORT;

//EXPORT
export default config;
