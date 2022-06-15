import { queryField } from 'nexus';

export const links = queryField('links', {
    type: 'Link',

    resolve: (_parent, _args, ctx) => {
        return ctx.prisma.link.findMany();
    },
});
