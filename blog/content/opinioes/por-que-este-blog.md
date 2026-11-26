---
title: "Por que este blog existe"
date: 2026-11-26T04:55:00-03:00
description: "O que vou publicar aqui e como o site foi montado."
draft: false
---

Este espaço reúne os assuntos que eu mais discuto com amigos e conhecidos, em quatro formatos:

- **Tutoriais:** passo a passo prático de tecnologia, Linux e automação.
- **Opiniões:** posicionamentos baseados em artigos e estudos que li.
- **Hipóteses & Artigos:** experimentos que busco responder com o método científico.
- **Recomendações:** cursos, filmes, séries e animes que indico, com ou sem review.

## Como o site foi construído

- **Gerador estático:** [Hugo](https://gohugo.io/), sem banco de dados nem painel exposto.
- **Publicação:** repositório privado e distribuição na borda via Cloudflare Pages.
- **Segurança:** cabeçalhos HTTP estritos em `static/_headers` e superfície mínima de ataque.
