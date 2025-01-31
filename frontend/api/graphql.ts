import { ApolloServer } from 'apollo-server-micro';
import { schema } from '@/core/graphql/schema';
import { createContext } from '@/core/graphql/context';
import { ApolloServerPluginLandingPageDisabled } from 'apollo-server-core';
import { createComplexityPlugin } from 'graphql-query-complexity-apollo-plugin';
import { fieldExtensionsEstimator, simpleEstimator } from 'graphql-query-complexity';
import Cors from 'micro-cors';
import { GraphQLError } from 'graphql';

const cors = Cors();

const apolloServer: ApolloServer = new ApolloServer({
    schema,
    context: createContext,
    introspection: true,
    csrfPrevention: true,
    playground: false,
    tracing: process.env.NODE_ENV === 'development',
    plugins: [
        ApolloServerPluginLandingPageDisabled(),
        createComplexityPlugin({
            schema,
            estimators: [
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 1 }),
            ],
            maximumComplexity: 75,
            onComplete: (complexity) => {
                // TODO Remove this in production
                console.log('Query Complexity:', complexity);
            },
            createError: (max, actual) => {
                return new GraphQLError(`query complexity limit exceeded`);
            },
        }),
    ],
}); // TODO set introspection to false in production

const startServer = apolloServer.start();

export default cors(async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        res.end();
        return false;
    }
    await startServer;

    await apolloServer.createHandler({
        path: '/api/graphql',
    })(req, res);
});

export const config = {
    api: {
        bodyParser: false,
    },
};
