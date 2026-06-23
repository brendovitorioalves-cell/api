import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { META } from '@consumet/extensions';

function toBoolean(value: unknown, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return fallback;
}

function errorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Unknown error';
  }
}

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  const anilist = new META.Anilist();

  fastify.get('/anilist', async () => ({
    intro: "Welcome to the Anilist meta provider.",
    routes: ['/:query', '/info/:id', '/watch/:episodeId'],
    examples: [
      '/meta/anilist/info/21?provider=gogoanime&dub=false',
      '/meta/anilist/watch/:episodeId',
    ],
  }));

  fastify.get('/anilist/:query', async (request: FastifyRequest, reply: FastifyReply) => {
    const query = decodeURIComponent((request.params as { query: string }).query);

    try {
      const res = await anilist.search(query);
      return reply.status(200).send(res);
    } catch (err) {
      return reply.status(502).send({
        message: 'Failed to search on Anilist provider.',
        error: errorMessage(err),
      });
    }
  });

  fastify.get('/anilist/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    const id = decodeURIComponent((request.params as { id: string }).id);
    const query = request.query as { dub?: string | boolean; fetchFiller?: string | boolean };

    const isDub = toBoolean(query.dub, false);
    const fetchFiller = toBoolean(query.fetchFiller, false);

    try {
      const res = await anilist.fetchAnimeInfo(id, isDub, fetchFiller);
      return reply.status(200).send(res);
    } catch (err) {
      return reply.status(502).send({
        message: 'Failed to fetch anime info from Anilist provider.',
        id,
        error: errorMessage(err),
      });
    }
  });

  fastify.get('/anilist/watch/:episodeId', async (request: FastifyRequest, reply: FastifyReply) => {
    const episodeId = decodeURIComponent((request.params as { episodeId: string }).episodeId);

    try {
      const res = await anilist.fetchEpisodeSources(episodeId);
      return reply.status(200).send(res);
    } catch (err) {
      return reply.status(502).send({
        message: 'Failed to fetch episode sources from Anilist provider.',
        episodeId,
        error: errorMessage(err),
      });
    }
  });
};

export default routes;
