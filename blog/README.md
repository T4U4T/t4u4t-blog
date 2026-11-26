# Currículo T4U4T (Hugo)

Site estático de uma página: currículo com foto, apresentação e qualificações.

## Rodar
Requer o [Hugo](https://gohugo.io/installation/) (v0.120 ou superior).

```bash
hugo server -D      # desenvolvimento em http://localhost:1313
hugo --minify       # gera o site final na pasta public/
```

## Onde editar
| O que | Arquivo |
|---|---|
| Nome, cargo, frase do topo, e-mail, links, menu | `hugo.toml` |
| Sobre, experiência, projetos, competências | `data/curriculo.yaml` |
| Foto | `static/img/thauan.jpg` (troque mantendo o nome, ou altere `params.photo`) |
| Cores e tipografia | `assets/css/main.css` (variáveis no topo, em `:root`) |
| Estrutura da página | `layouts/index.html` e `layouts/partials/` |

## Publicar
Ajuste `baseURL` em `hugo.toml` e envie a pasta `public/` para GitHub Pages, Netlify, Cloudflare Pages ou qualquer hospedagem estática.

## Para adicionar
- Nova seção: crie o bloco em `layouts/index.html`, os dados em `data/curriculo.yaml` e um item `[[menus.main]]` em `hugo.toml`.
- Versão em inglês: use o recurso de multilíngue do Hugo (`languages` no `hugo.toml`) e um `data/curriculo.en.yaml`.
