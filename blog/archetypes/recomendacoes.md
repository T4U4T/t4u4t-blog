---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
date: {{ .Date }}
description: ""
tipo: "filme"        # filme | série | anime | curso | livro
formato: "indicação" # indicação | review
# nota: 8.5          # opcional, de 0 a 10 (use em reviews)
draft: true
---
