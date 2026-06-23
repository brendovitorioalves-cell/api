# Consumet API - Railway Ready

Projeto corrigido para rodar na Railway **sem Docker**, usando Nixpacks.

## Importante

Este pacote não usa Dockerfile. Se a Railway detectar Docker, você está subindo o repositório errado ou ainda existe um `Dockerfile` na raiz.

Na Railway, o log deve mostrar `NIXPACKS`, não build de Docker.

## Deploy

1. Suba todos os arquivos deste projeto para um repositório GitHub novo.
2. Importe o repositório na Railway.
3. Confirme que o root directory é a raiz onde estão `package.json`, `railway.json` e `nixpacks.toml`.
4. Deploy.

## Comandos usados pela Railway

Install:

```bash
npm install
```

Start:

```bash
npm start
```

## Teste

Depois do deploy, abra:

```txt
https://SEU-PROJETO.up.railway.app/health
```

Resposta esperada:

```json
{
  "ok": true
}
```

Teste AniList/GogoAnime:

```txt
https://SEU-PROJETO.up.railway.app/meta/anilist/info/21?provider=gogoanime&dub=false
```

## Usar no Netfox

No Netlify/Netfox, configure:

```env
CONSUMET_API_URL=https://SEU-PROJETO.up.railway.app
```

Depois faça redeploy.

## Correção aplicada

- Removido Docker para evitar erro com imagens antigas/base Debian.
- `nixpacks.toml` usa `npm install`, não `npm ci`, então não quebra se o Railway não enxergar o lockfile.
- Incluído `git` e `openssh` no ambiente Nixpacks para dependências que usam GitHub.
- `railway.json` força builder Nixpacks.
- `/health` disponível para healthcheck.
