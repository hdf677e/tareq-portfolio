# Tareq Mahmud portfolio

The portfolio now runs on the Next.js App Router and uses plain global CSS in `app/globals.css`. Static images, video, logos, and the CV are served from `public/`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For production, run `npm run build` and then `npm start`.

The existing case study renderer and interactions are loaded as a client module after the server-rendered page shell.
