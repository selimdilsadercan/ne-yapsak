- [x] "npx create-next-app@latest {project-name}" to initialize nextjs
- [ ] create github repo, and connect
- [ ] change layout, change page.tsx, delete assets
- [ ] create .env file, add .env to .gitignore
- [ ] add .prettierrc

- [ ] "npx shadcn@latest init" to initialize shadcn
- [ ] html, body, :root { height: 100% } thing at app/globals.css
- [ ] "npx shadcn-ui@latest add button" to add button

- [ ] "npm i convex"
- [ ] "npx convex dev" to run convex, change .env.local to .env
- [ ] create /convex/auth.config.js and add issuer url as domain
- [ ] add providers/convex-provider.tsx, combine clerk and convex providers and wrap {children} with ConvexProvider

- [ ] create coachroachdb cluster
- [ ] press connect -> create new sql user -> copy password -> copy general connection string -> paste to .env as DATABASE_URL
- [ ] "npm i -D prisma"
- [ ] "npm i @prisma/client"
- [ ] "npx prisma init"
- [ ] create lib/db.ts
- [ ] add "postinstall": "prisma generate" to package.json's scripts
- [ ] change datasource db provider to cockroachdb in schema.prisma
- [ ] note: "npx prisma generate" and "npx prisma db push" whenever schemas have changed
- [ ] note: "npx prisma studio" to manage content
- [ ] create Profile schema to keep users better
- [ ] create lib/initial-profile.ts and lib/current-profile.ts

---

- primary stack: nextjs13-app-nosrc, react, shadcn, tailwind, convex, clerk-withorg, liveblocks
- secondary stack: zustand, date-fns, use-hooks, react-contenteditable, perfect-freehand
- ui: font = poppins-inter-kalam, icons = lucide
- extensions: color-highligt, error-lens, svg-preview, tailwind-intellisense, react-snippets

---

- AuthLoading ve Authenticated kullanarak login sırasında bir loading animation yapabiliyosun
- Clerk yazısını dev moddayken kapatabiliyosun
- searchparams, state yönetiminden daha mantıklı
- clerk > customization > avatars kısmından default resmi isme göre harf olarak değiştirebilirsin
- useDebounce ile inputlarda zaman aralıklı state değişimi yapıyor
- her bir durum için ayrı empty state'ler yapmayı unutma
- formatDistanceToNow ile related date yazabiliyosun
- many-to-one ya da many-to-one relationlar için ayrı veri yapıları tutuyoruz
- Component.Skeleton kullanırken ayrı bir use client Loading dosyası açıp her şeyi onda birleştir
- vercel'da yayınlamadan önce "npm run build" yaparak bir kontrol et (npm run dev kapalı olmalı)
