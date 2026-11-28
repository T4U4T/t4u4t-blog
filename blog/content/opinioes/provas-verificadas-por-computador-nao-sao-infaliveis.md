---
title: "Provas verificadas por computador não são infalíveis"
date: 2026-11-27T11:30:00-03:00
description: "Por que a verificação formal de software e teoremas ainda depende de premissas humanas — e o que o alerta de Daniel J. Bernstein nos ensina sobre rigor técnico."
draft: false
---

**Resposta resumida:** Um verificador formal de provas não garante que uma afirmação é verdadeira no mundo real; ele garante apenas que a conclusão segue logicamente das definições e axiomas que um humano escreveu. Se a especificação estiver errada, a prova "100% verificada" também estará.

Na computação e na matemática aplicada, existe uma tentação constante de tratar ferramentas formais como oráculos absolutos. O texto recente de Daniel J. Bernstein ([False computer-checked proofs](https://cr.yp.to/proofs/falseccp.html)) toca exatamente nessa ferida: provas verificadas por computador têm falhado na prática — não porque a lógica matemática quebrou, mas porque a ponte entre o problema real e o modelo formal é feita por gente.

## O problema não é o verificador, é a tradução

Quando separamos **o que sabemos** do **que assumimos**, a fragilidade fica evidente. Um assistente de provas (como Coq, Lean ou Isabelle) checa cada passo dedutivo com precisão mecânica. Mas ele não sabe se:

1. **A definição formal corresponde ao sistema real:** você pode provar que um algoritmo criptográfico é seguro contra um atacante idealizado e, ainda assim, vazar chaves por *side-channel* no hardware físico.
2. **Os axiomas escondem brechas:** basta um axioma auxiliar mal formulado ou inconsistente para que qualquer conclusão passe a ser derivável.
3. **O próprio verificador tem bugs:** compiladores e kernels de verificação também são software escrito por humanos.

## Rigor não é terceirização de senso crítico

Isso não significa que verificação formal seja inútil — longe disso. Ela elimina classes inteiras de erros humanos em demonstrações longas. O erro está em transformar o selo *"computer-checked"* em dogma, dispensando revisão independente e testes empíricos.

Na ciência e na engenharia, nenhuma ferramenta substitui a leitura crítica das premissas. A máquina verifica a sintaxe da lógica; quem responde pela validade do modelo continua sendo você.
