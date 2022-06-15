import { connectionPlugin, fieldAuthorizePlugin, makeSchema } from 'nexus';
import { join } from 'path';
import { applyMiddleware } from 'graphql-middleware';
import { permissions } from '@/graphql/permissions';
import * as types from '@/graphql/types'; // These are the two files (models and resolvers)

const baseSchema = makeSchema({
    types,
    outputs: {
        typegen: join(
            process.cwd(),
            'node_modules',
            '@types',
            'nexus-typegen',
            'index.d.ts'
        ),
        schema: join(process.cwd(), 'graphql', 'schema.graphql'),
    },
    contextType: {
        export: 'Context',
        module: join(process.cwd(), 'graphql', 'context.ts'),
    },
});

export const schema = applyMiddleware(baseSchema, permissions);
