# eas-site: site institucional da Eger Advanced Systems

É um site estático em HTML, CSS e JS puros, sem build e sem dependências. Ele segue a identidade v5 (`../README.md`):
base Carbon, gradiente Flux, Inter + JetBrains Mono e a asa "Spirit" desenhada inline em SVG.

```
eas-site/
├── index.html                  landing page (hero, serviços, stack, contratação, setores, processo, FAQ, contato)
├── 404.html                    página de erro (usa caminhos absolutos: precisa estar na raiz do domínio)
├── pages/
│   ├── sistemas-embarcados.html
│   ├── consultoria.html
│   ├── integracao-cloud.html
│   └── privacidade.html        política de privacidade (LGPD)
├── css/style.css               tokens da marca + todos os componentes
├── js/main.js                  menu, abas, animações de entrada, formulário
├── assets/
│   ├── img/og-image.png        imagem de compartilhamento 1200×630 (LinkedIn, WhatsApp, X)
│   ├── img/logo-eger-advanced-systems.png   logo quadrada usada no schema.org
│   └── icons/                  favicon.svg, PNGs 32/48/180/192/512 e ícone maskable
├── favicon.ico                 16/32/48 px
├── site.webmanifest            PWA / "adicionar à tela inicial"
├── robots.txt                  libera buscadores e crawlers de IA; aponta o sitemap
├── sitemap.xml
├── llms.txt                    resumo do site em Markdown para assistentes de IA
└── .htaccess                   HTTPS, domínio canônico, cache, compressão e cabeçalhos de segurança (Apache)
```

## Rodar localmente

```bash
cd eas-site
python -m http.server 8080
# abra http://localhost:8080
```

Abrir o `index.html` direto do disco também funciona. Só o `404.html` depende de servidor.

## Antes de publicar: checklist

1. **Domínio.** Todas as URLs absolutas (canonical, Open Graph, JSON-LD, sitemap, robots, llms.txt, .htaccess)
   usam `https://egeradvancedsystems.com`. Se o domínio for outro, faça localizar e substituir em todo o projeto.
2. **E-mail e WhatsApp.** Não aparecem escritos no HTML (proteção contra spam): os links são montados pelo
   objeto `CONTACT` no início da seção "contatos protegidos" do `js/main.js`. Para trocar, altere só ali.
   O WhatsApp também está no `llms.txt`.
3. **LinkedIn.** `https://www.linkedin.com/company/eger-advanced-systems` (confirmado).
4. **Formulário (Web3Forms).** Já configurado: a chave está no campo `access_key` do `<form>` no `index.html`,
   e as mensagens vão para o e-mail cadastrado no painel do https://web3forms.com. Para mudar o destinatário,
   altere no painel do Web3Forms (o site não muda). A chave é pública por design. A CSP do `.htaccess` já
   libera `https://api.web3forms.com`.
5. **Privacidade.** Revise `pages/privacidade.html` com o jurídico. Inclua razão social e CNPJ, se quiser.
   Se adicionar analytics (GA4, Plausible, Clarity), cite o serviço na política e libere o domínio na CSP.
6. **Datas.** Ao alterar conteúdo, atualize `<lastmod>` no `sitemap.xml`.

## Depois de publicar: indexação

- **Google Search Console:** adicione a propriedade de domínio, valide pelo DNS e envie `sitemap.xml`.
  Em seguida, use "Inspecionar URL" → "Solicitar indexação" para a home e as três páginas de serviço.
- **Bing Webmaster Tools:** importe a propriedade do Search Console. O Bing também alimenta o Copilot e o ChatGPT Search.
- **Validação:** teste os dados estruturados em https://search.google.com/test/rich-results e https://validator.schema.org,
  e a prévia de compartilhamento em https://www.linkedin.com/post-inspector/.
- **Desempenho:** rode o PageSpeed Insights (https://pagespeed.web.dev) no celular e no desktop.
- **Perfil da empresa no Google:** se houver endereço comercial, crie o perfil e acrescente `address` e `telephone` ao JSON-LD `Organization`.

## Hospedagem

| Onde | Como |
|---|---|
| Hostinger, HostGator, Locaweb, cPanel (Apache) | envie o conteúdo de `eas-site/` para `public_html/`. O `.htaccess` já cuida de HTTPS, cache e 404. |
| Netlify / Cloudflare Pages | arraste a pasta ou conecte o repositório. O `404.html` é detectado automaticamente. |
| Vercel | importe como projeto estático, sem framework e sem comando de build. |
| **GitHub Pages (em uso)** | publique o conteúdo na raiz do branch. O arquivo `CNAME` fixa o domínio principal `egeradvancedsystems.com` (sem www); em *Settings → Pages* o domínio deve ser o mesmo e **Enforce HTTPS** deve estar marcado. O `.htaccess` não tem efeito aqui e pode ficar fora do repositório. |

Nas opções sem Apache, o `.htaccess` é ignorado. Configure HTTPS e o redirecionamento de `www` pelo painel da plataforma.

## Manutenção

- **Cores e tipografia:** ficam nos tokens `:root` do início de `css/style.css`.
- **Cabeçalho e rodapé:** estão repetidos em cada HTML, porque não há build. Ao mudar um item de menu, altere nos 6 arquivos.
- **Nova página de serviço:** duplique uma página em `pages/`, ajuste `<title>`, `description`, `canonical`, `og:*`
  e o JSON-LD, e inclua a URL no `sitemap.xml` e no `llms.txt`.
- **Clientes (faixa animada):** ficam na seção `clients` do `index.html`. Cada nome aparece duas vezes, porque a
  segunda lista (com `aria-hidden`) serve para o loop infinito. A velocidade é controlada por `--marquee-speed` no CSS.
- **Tecnologias:** a stack aparece no explorador "Stack por camada" do `index.html`, nas páginas de serviço, no FAQ,
  no JSON-LD (`knowsAbout`) e no `llms.txt`. Mantenha os cinco lugares alinhados.
