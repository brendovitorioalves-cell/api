# Consumet API — Railway sem Docker

Este pacote foi ajustado para rodar na Railway usando **Nixpacks**, sem Dockerfile.

Ele está focado na parte necessária para o Netfox carregar episódios/fontes de anime:

- `/health`
- `/meta/anilist/info/:id?provider=gogoanime&dub=false`
- `/meta/anilist/watch/:episodeId`

Observação: no `@consumet/extensions` atual, o provider interno padrão do `META.Anilist` é Hianime. A query `provider=gogoanime` pode continuar vindo do seu Netfox sem quebrar, mas ela não é necessária nesta instância.

## Como subir na Railway

1. Crie um repositório no GitHub com estes arquivos.
2. Crie um projeto novo na Railway.
3. Escolha **Deploy from GitHub repo**.
4. A Railway deve detectar o `railway.json` e usar **Nixpacks**.
5. Não use Dockerfile.

## Comandos

Build/install:

```bash
npm ci
```

Start:

```bash
npm start
```

Healthcheck:

```txt
/health
```

## Variáveis de ambiente

A Railway cria `PORT` automaticamente. Opcionalmente, defina:

```env
NODE_ENV=production
HOST=0.0.0.0
```

## Testes rápidos

Depois do deploy, teste:

```txt
https://SEU-PROJETO.up.railway.app/health
https://SEU-PROJETO.up.railway.app/meta/anilist/info/21?provider=gogoanime&dub=false
```

Se `/health` responder `{ "ok": true }`, a API está online.

## Usar no Netfox

No Netlify/Netfox, configure:

```env
CONSUMET_API_URL=https://SEU-PROJETO.up.railway.app
```

Depois faça novo deploy no Netfox.
