# Plano de Ação — Blog Público Seguro (`t4u4t.site`)

**Stack:** Hugo (estático) + GitHub + Cloudflare Pages  
**Domínio:** `t4u4t.site` (ou subdomínio, ex: `blog.t4u4t.site`)  
**Impacto no homelab:** Zero (nenhuma porta aberta, nenhum tráfego público chega à `milla`, `sentinel`, `storage` ou `database`).

---

## Fase 1 — Repositório e Estrutura Local (Hugo)

1. **Instalar o Hugo (Extended)** na máquina de desenvolvimento (`workstation` ou `milla`).
2. **Inicializar o projeto** em `/home/thauan/projetos/pessoal/blog`:
   ```bash
   hugo new site . --force
   git init
   ```
3. **Escolher e adicionar um tema** (via Git submodule ou Hugo Modules, ex: `PaperMod`, `Blowfish` ou `Congo`):
   ```bash
   git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
   ```
4. **Configurar `hugo.toml`:**
   - Definir `baseURL = "https://t4u4t.site/"` (ou `https://blog.t4u4t.site/`).
   - Configurar `title`, `languageCode = "pt-br"`, `theme = "PaperMod"`.
   - Desabilitar recursos desnecessários (ex: comentários externos sem moderação ou analytics invasivos).
5. **Criar o primeiro post de teste** e validar localmente:
   ```bash
   hugo new content posts/primeiro-post.md
   hugo server -D
   ```

---

## Fase 2 — Segurança e Boas Práticas no Projeto

1. **Headers de segurança HTTP (`static/_headers`):**
   O Cloudflare Pages aplica automaticamente as regras do arquivo `static/_headers` na raiz do build:
   ```text
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: camera=(), microphone=(), geolocation=()
   ```
2. **Privacidade e higiene de dados:**
   - **Nunca** commitar IPs da rede Tailscale (`100.64.0.0/10`), tokens, senhas, arquivos `.env` ou detalhes sensíveis de firewall/credenciais nos posts ou no repositório.
   - Revisar metadados EXIF de imagens antes de publicar (remover localização/câmera com `exiftool -all= imagem.jpg`).
3. **Repositório GitHub:**
   - Usar repositório **privado** no GitHub (o Cloudflare Pages faz deploy normalmente de repositórios privados no plano gratuito).
   - Ativar **2FA** na conta do GitHub e da Cloudflare.

---

## Fase 3 — Deploy no Cloudflare Pages

1. **Conectar GitHub ao Cloudflare Pages:**
   - No painel da Cloudflare → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
   - Selecionar o repositório do blog.
2. **Configurar o Build:**
   - **Framework preset:** `Hugo`
   - **Build command:** `hugo --gc --minify`
   - **Build output directory:** `public`
   - **Variável de ambiente:** `HUGO_VERSION` = versão exata do Hugo usada localmente (ex: `0.139.0` ou superior).
3. **Primeiro deploy:**
   - Validar o site no endereço temporário `*.pages.dev`.

---

## Fase 4 — Domínio (`t4u4t.site`) e Proteções na Borda

1. **Vincular domínio personalizado:**
   - Em **Custom domains** no projeto do Cloudflare Pages, adicionar `blog.t4u4t.site` (ou `t4u4t.site`).
   - A Cloudflare cria automaticamente o registro `CNAME` com proxy ativo (nuvem laranja) e SSL/TLS automático.
2. **Configurações recomendadas no DNS / SSL / Segurança da Cloudflare:**
   - **SSL/TLS:** modo `Full (strict)`.
   - **Always Use HTTPS:** ativado.
   - **Bot Fight Mode:** ativado (ajuda a conter scrapers abusivos).
   - **Security Level:** `Medium`.
3. **Verificar isolamento:**
   - Confirmar que nenhum túnel (`cloudflared`) do homelab aponta para o domínio do blog.

---

## Fase 5 — Fluxo Contínuo de Publicação

1. Escrever o post em Markdown (`content/posts/nome-do-post.md`).
2. Testar localmente com `hugo server -D`.
3. Remover `draft: true` do frontmatter.
4. Fazer `git add . && git commit -m "post: ..." && git push`.
5. O Cloudflare Pages gera o build e publica automaticamente em segundos.
