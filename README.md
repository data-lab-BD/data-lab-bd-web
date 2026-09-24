# Data Lab website

Static marketing site for Data Lab, served from GitHub Pages at **https://datalabbd.com**.

Plain HTML, Tailwind CSS and vanilla JS. On every push to `main`, a GitHub Actions workflow compiles the CSS and deploys the site. See [docs/adr/0001](docs/adr/0001-static-site-on-github-pages.md) for why this replaced the Laravel app.

## Layout

| Path | Page |
| --- | --- |
| `index.html` | Home |
| `services/{starting,scaling,optimizing}/index.html` | Services by journey stage |
| `solutions/index.html` | Solutions (industry filter via `?industry=`) |
| `about/index.html` | About |
| `contact/index.html` | Contact (form sent via Web3Forms) |
| `404.html` | Not-found page |
| `src/styles.css` | Tailwind source and theme |
| `assets/main.js` | Nav dropdown, mobile menu, solutions filter, contact form |

The header, nav and footer are repeated in every page. If you change them, change all pages.

## Local development

```bash
npm install
npm run watch   # rebuilds assets/styles.css on change
npm run serve   # http://localhost:8000
```

`assets/styles.css` is generated and git-ignored. CI builds it.

## One-time setup

1. **Contact form.** Get a free access key at https://web3forms.com using `dcloudlab.bd@gmail.com`. Save it as the repo secret `WEB3FORMS_ACCESS_KEY`. The deploy workflow swaps it in for `YOUR_WEB3FORMS_ACCESS_KEY` in `contact/index.html`. The key still appears in the published page, which is expected: it can only send email to your inbox.
2. **GitHub Pages.** Go to repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then under **Custom domain**, enter `datalabbd.com`, save, and tick **Enforce HTTPS** once the certificate is issued.
3. **DNS** (at your domain registrar):

   | Type | Host | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `data-lab-bd.github.io` |

   Optionally also add AAAA records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
