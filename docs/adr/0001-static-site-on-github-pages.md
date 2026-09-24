# Static site on GitHub Pages instead of the Laravel app

The site was previously a Laravel 12 app (repo `data-lab-BD/data-lab-webapp`, served at datalabbd.io) with a database, a Livewire blog/admin and a Livewire contact form. We replaced it with hand-written static HTML, Tailwind CSS compiled in GitHub Actions, and vanilla JS, served free from GitHub Pages at datalabbd.com, so the company does not pay for or maintain a server.

## Consequences

- **No blog or admin.** Dropped deliberately for now; the three old posts were not migrated. Content changes are edits to HTML files.
- **Contact form goes through Web3Forms**, which emails submissions to the site inbox. Submissions are no longer stored in a database.
- **Content was copied from the live Laravel site**, not the seed data, so it reflects any edits made in production.
- **Header, nav and footer are duplicated in every page.** Accepted with ~8 pages; revisit (e.g. a static site generator) if the page count grows or a blog returns.
