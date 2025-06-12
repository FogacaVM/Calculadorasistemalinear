# Calculadora de Sistema Linear

Uma aplicação web para resolver sistemas lineares de 2x2, 3x3 ou 4x4. O usuário pode preencher as matrizes manualmente ou inserir o sistema por texto, e a aplicação analisa e resolve automaticamente.

---

## Funcionalidades

- Entrada de sistema por texto (ex: `2x + 3y = 8`)
- Suporte a variáveis x, y, z, w ou x1, x2, x3, x4
- Alternância entre tema claro e escuro
- Cálculo do sistema via regra de Cramer
- Análise do sistema: solução única, infinitas soluções ou nenhuma solução
- Exibição de determinante, ranks e matriz aumentada
- Histórico de sistemas resolvidos
- Geração de exemplos rápidos e sistemas aleatórios
- Exportação para PDF e cópia de resultado
- Histórico das entradas por texto

---

## Como usar

### Entrada por texto

1. Cole ou digite seu sistema no campo de texto principal. Exemplo:

   ```
   2x + 3y = 8
   x - y = 0
   ```

2. Clique em **"Processar Sistema"**
3. A matriz será preenchida automaticamente com os coeficientes e termos independentes

### Entrada manual

1. Escolha o tamanho do sistema (2x2, 3x3 ou 4x4)
2. Preencha a Matriz A (coeficientes) e o Vetor B (termos independentes)
3. Clique em **"Calcular Sistema"**

---

## Análise do sistema

A análise é feita com base em:

- Determinante da matriz dos coeficientes
- Rank da matriz dos coeficientes (A)
- Rank da matriz aumentada (A|B)

Resultados possíveis:

- **Solução única**: sistema possível e determinado (determinante ≠ 0)
- **Infinitas soluções**: sistema possível e indeterminado (equações dependentes)
- **Nenhuma solução**: sistema impossível (equações inconsistentes)
- Identificação de sistema homogêneo, se todos os termos independentes forem zero

---

## Tecnologias utilizadas

- HTML, CSS, JavaScript puro
- LocalStorage para histórico
- Interface baseada em Material Icons

---

## Observações

- A interface é responsiva e pode ser usada em dispositivos móveis
- O histórico salva até 10 entradas recentes (tanto por texto quanto por sistemas resolvidos)
- A geração de PDF utiliza o recurso nativo de impressão do navegador

