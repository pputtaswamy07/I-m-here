import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import {connectDB} from './config/db.js';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import {getUserFromToken} from './middleware/auth.js';


dotenv.config();

const app = express();

app.use(cors());        
app.use(express.json());

await connectDB();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()]
});

await server.start();

app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = getUserFromToken(req);
        return { user };
      }
    })
  );

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
})