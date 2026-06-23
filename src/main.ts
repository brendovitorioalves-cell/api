require('dotenv').config();

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';

import meta from './routes/meta';

(async () => {
  const PORT = Number(process.env.PORT || 3000);
  const HOST = process.env.HOST || '0.0.0.0';

  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(FastifyCors, {
    origin: '*',
    methods: ['GET', 'OPTIONS'],
  });

  fastify.get('/', async () => ({
    name: 'Consumet API — Railway',
    status: 'online',
    note: 'Build sem Docker, focado no player de anime via META/AniList.',
    routes: {
      health: '/health',
      meta: '/meta',
      metaAnilistInfo: '/meta/anilist/info/:id?provider=gogoanime&dub=false',
      metaAnilistWatch: '/meta/anilist/watch/:episodeId',
    },
  }));

  fastify.get('/health', async () => ({
    ok: true,
    uptime: process.uptime(),
  }));

  // Rotas necessárias para o Netfox/animes.
  // Esta versão usa @consumet/extensions atual, onde o meta/anilist usa provider padrão Hianime.
  await fastify.register(meta, { prefix: '/meta' });

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      error: 'page not found',
      path: request.url,
    });
  });

  try {
    await fastify.listen({ port: PORT, host: HOST });
    fastify.log.info(`server listening on ${HOST}:${PORT}`);
  } catch (err: any) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
