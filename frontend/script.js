function parseTextInput() {
  const text = document.getElementById("textInput").value.trim();
  const status = document.getElementById("parseStatus");

  if (!text) {
    showParseStatus("Por favor, digite um sistema linear.", "error");
    return;
  }

  try {
    const parsedSystem = parseSystemText(text);
    if (parsedSystem) {
      const { A, B, size } = parsedSystem;

      // Definir tamanho do sistema
      setSystemSize(size);

      // Preencher campos com destaque visual
      setMatrixAndVector(A, B);

      showParseStatus(`✅ Sistema ${size}×${size} processado com sucesso!`, "success");

      // Salvar entrada no histórico
      saveTextInputHistory(text);

      // Scroll para os campos preenchidos
      document.querySelector(".left-panel").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  } catch (error) {
    showParseStatus(`❌ Erro: ${error.message}`, "error");
  }
}

function parseSystemText(text) {
  // Limpar e normalizar o texto
  text = text.replace(/\s+/g, " ").trim();

  // Separar equações (por ; ou quebra de linha)
  let equations = text.split(/[;\n]/).map((eq) => eq.trim()).filter((eq) => eq);

  if (equations.length < 2 || equations.length > 4) {
    throw new Error("Sistema deve ter entre 2 e 4 equações.");
  }

  const size = equations.length;
  const A = [];
  const B = [];

  // Variáveis possíveis
  const variables = ["x", "y", "z", "w"];
  const altVariables = ["x1", "x2", "x3", "x4"];

  for (let i = 0; i < equations.length; i++) {
    const eq = equations[i];

    // Verificar se tem sinal de igualdade
    if (!eq.includes("=")) {
      throw new Error(`Equação ${i + 1} deve conter o sinal "=".`);
    }

    const [leftSide, rightSide] = eq.split("=").map((s) => s.trim());

    if (!rightSide) {
      throw new Error(`Equação ${i + 1} está incompleta.`);
    }

    // Processar lado direito (termo independente)
    const b = parseFloat(rightSide);
    if (isNaN(b)) {
      throw new Error(`Termo independente da equação ${i + 1} é inválido: "${rightSide}".`);
    }
    B.push(b);

    // Processar lado esquerdo (coeficientes)
    const coefficients = parseCoefficients(leftSide, size);
    A.push(coefficients);
  }

  return { A, B, size };
}

function parseCoefficients(expression, size) {
  const coefficients = new Array(size).fill(0);
  const variables = ["x", "y", "z", "w"];
  const altVariables = ["x1", "x2", "x3", "x4"];

  // Normalizar expressão
  expression = expression.replace(/\s+/g, "");

  // Adicionar + no início se não começar com - ou +
  if (!expression.startsWith("+") && !expression.startsWith("-")) {
    expression = "+" + expression;
  }

  // Regex para capturar termos: sinal + coeficiente + variável
  const termRegex = /([+-]?)(\d*\.?\d*)([a-zA-Z]\d?)/g;
  let match;

  while ((match = termRegex.exec(expression)) !== null) {
    const [fullMatch, sign, coef, variable] = match;

    // Determinar sinal
    const signValue = sign === "-" ? -1 : 1;

    // Determinar coeficiente
    let coefficient;
    if (coef === "" || coef === "+" || coef === "-") {
      coefficient = 1;
    } else {
      coefficient = parseFloat(coef);
      if (isNaN(coefficient)) {
        throw new Error(`Coeficiente inválido: "${coef}".`);
      }
    }

    coefficient *= signValue;

    // Determinar índice da variável
    let varIndex = -1;

    // Tentar variáveis simples (x, y, z, w)
    varIndex = variables.indexOf(variable.toLowerCase());

    // Se não encontrou, tentar variáveis numeradas (x1, x2, x3, x4)
    if (varIndex === -1) {
      varIndex = altVariables.indexOf(variable.toLowerCase());
    }

    if (varIndex === -1 || varIndex >= size) {
      throw new Error(`Variável "${variable}" não é válida para sistema ${size}×${size}.`);
    }

    coefficients[varIndex] += coefficient;
  }

  return coefficients;
}

function showParseStatus(message, type) {
  const status = document.getElementById("parseStatus");
  status.textContent = message;
  status.className = `parse-status ${type}`;
  status.style.display = "block";

  // Esconder após 5 segundos se for sucesso
  if (type === "success") {
    setTimeout(() => {
      status.style.display = "none";
    }, 5000);
  }
}

function setTextExample() {
  const examples = [
    "2x + 3y = 8\nx - y = 0",
    "x + 2y + z = 6\n2x - y + 3z = 14\n3x + y - z = 2",
    "3x1 + 2x2 - x3 + x4 = 10\nx1 - x2 + 2x3 + x4 = 8\n2x1 + x2 - x3 - x4 = 2\nx1 + x2 + x3 + x4 = 6",
  ];

  const randomExample = examples[Math.floor(Math.random() * examples.length)];
  document.getElementById("textInput").value = randomExample;
}

// ========== CÓDIGO ORIGINAL ==========
// Tema escuro/claro
function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  document.getElementById("themeIcon").textContent = theme === "dark" ? "light_mode" : "dark_mode";
}
function toggleTheme() {
  const current = document.body.getAttribute("data-theme") || "light";
  setTheme(current === "dark" ? "light" : "dark");
}
document.getElementById("themeToggle").onclick = toggleTheme;
(function () {
  const saved = localStorage.getItem("theme");
  setTheme(saved === "dark" ? "dark" : "light");
})();

// Variáveis globais
let systemSize = 2;

// Renderização dinâmica dos inputs
function renderMatrixInputs() {
  // Matriz A
  const matrixA = document.getElementById("matrixA");
  matrixA.innerHTML = "";
  for (let i = 0; i < systemSize; i++) {
    const row = document.createElement("div");
    row.className = "matrix-row";
    for (let j = 0; j < systemSize; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.id = `a${i}${j}`;
      input.placeholder = `a${i + 1}${j + 1}`;
      row.appendChild(input);
    }
    matrixA.appendChild(row);
  }
  // Vetor B
  const vectorB = document.getElementById("vectorB");
  vectorB.innerHTML = "";
  for (let i = 0; i < systemSize; i++) {
    const row = document.createElement("div");
    row.className = "matrix-row";
    const input = document.createElement("input");
    input.type = "number";
    input.id = `b${i}`;
    input.placeholder = `b${i + 1}`;
    row.appendChild(input);
    vectorB.appendChild(row);
  }
}

function setSystemSize(n) {
  systemSize = n;
  document.getElementById("tab-2x2").classList.toggle("active", n === 2);
  document.getElementById("tab-3x3").classList.toggle("active", n === 3);
  document.getElementById("tab-4x4").classList.toggle("active", n === 4);
  renderMatrixInputs();
  clearFields();
  document.getElementById("resultCard").style.display = "none";
}

// Exemplos rápidos
function setExample(type) {
  setSystemSize(type === 2 ? 2 : type === 3 ? 3 : 2);
  if (type === 2) {
    setMatrixAndVector(
      [
        [2, 3],
        [1, -1],
      ],
      [8, 0]
    );
  } else if (type === 3) {
    setMatrixAndVector(
      [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
      ],
      [1, 2, 3]
    );
  } else {
    setMatrixAndVector(
      [
        [1, 1],
        [1, 1],
      ],
      [2, 3]
    );
  }
}

// Aleatório
function setRandom() {
  let A = [],
    B = [];
  for (let i = 0; i < systemSize; i++) {
    let row = [];
    for (let j = 0; j < systemSize; j++) {
      row.push(Math.floor(Math.random() * 11) - 5);
    }
    A.push(row);
    B.push(Math.floor(Math.random() * 21) - 10);
  }
  setMatrixAndVector(A, B);
}

// Preencher campos com destaque visual
function setMatrixAndVector(A, B) {
  clearHighlights();
  for (let i = 0; i < systemSize; i++) {
    for (let j = 0; j < systemSize; j++) {
      const input = document.getElementById(`a${i}${j}`);
      input.value = A[i][j];
      highlightInput(input);
    }
    const inputB = document.getElementById(`b${i}`);
    inputB.value = B[i];
    highlightInput(inputB);
  }
}

// Adiciona classe de destaque e remove após animação
function highlightInput(input) {
  input.classList.add("highlight");
  input.addEventListener(
    "animationend",
    () => {
      input.classList.remove("highlight");
    },
    { once: true }
  );
}

// Remove destaques anteriores
function clearHighlights() {
  const inputs = document.querySelectorAll(".matrix-row input.highlight");
  inputs.forEach((input) => input.classList.remove("highlight"));
}

// Limpar campos
function clearFields() {
  for (let i = 0; i < systemSize; i++) {
    for (let j = 0; j < systemSize; j++) {
      document.getElementById(`a${i}${j}`).value = "";
    }
    document.getElementById(`b${i}`).value = "";
  }
  document.getElementById("resultCard").style.display = "none";
  document.getElementById("textInput").value = "";
  document.getElementById("parseStatus").style.display = "none";
}

// Obter matriz e vetor
function getMatrixAndVector() {
  let A = [],
    B = [];
  for (let i = 0; i < systemSize; i++) {
    let row = [];
    for (let j = 0; j < systemSize; j++) {
      row.push(Number(document.getElementById(`a${i}${j}`).value) || 0);
    }
    A.push(row);
    B.push(Number(document.getElementById(`b${i}`).value) || 0);
  }
  return { A, B };
}

// Determinante
function determinant(A) {
  if (A.length === 2) {
    return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  }
  if (A.length === 3) {
    return (
      A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
      A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
      A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0])
    );
  }
  if (A.length === 4) {
    // Laplace expansion for 4x4
    let det = 0;
    for (let k = 0; k < 4; k++) {
      let sub = [];
      for (let i = 1; i < 4; i++) {
        let row = [];
        for (let j = 0; j < 4; j++) if (j !== k) row.push(A[i][j]);
        sub.push(row);
      }
      det += (k % 2 === 0 ? 1 : -1) * A[0][k] * determinant(sub);
    }
    return det;
  }
  return NaN;
}

// Matriz aumentada
function augmentMatrix(A, B) {
  return A.map((row, i) => [...row, B[i]]);
}

// Rank
function rank(matrix) {
  let m = matrix.map((row) => row.slice());
  let rows = m.length,
    cols = m[0].length,
    r = 0;
  for (let c = 0; c < cols; c++) {
    let pivot = r;
    while (pivot < rows && Math.abs(m[pivot][c]) < 1e-10) pivot++;
    if (pivot === rows) continue;
    [m[r], m[pivot]] = [m[pivot], m[r]];
    for (let i = r + 1; i < rows; i++) {
      let f = m[i][c] / m[r][c];
      for (let j = c; j < cols; j++) m[i][j] -= f * m[r][j];
    }
    r++;
  }
  let rank = 0;
  for (let i = 0; i < rows; i++) {
    if (m[i].some((x) => Math.abs(x) > 1e-10)) rank++;
  }
  return rank;
}

// Resolver sistema (Cramer)
function solveSystem(A, B) {
  const n = A.length;
  const detA = determinant(A);
  if (Math.abs(detA) < 1e-10) return null;
  let X = [];
  for (let i = 0; i < n; i++) {
    let Ai = A.map((row, r) => row.map((val, c) => (c === i ? B[r] : val)));
    X.push(determinant(Ai) / detA);
  }
  return X;
}

// Analisar sistema
function analyzeSystem() {
  const { A, B } = getMatrixAndVector();
  const n = A.length;
  const detA = determinant(A);
  const aug = augmentMatrix(A, B);
  const rankA = rank(A);
  const rankAug = rank(aug);
  let result = "",
    explanation = "";
  if (rankA === rankAug) {
    if (rankA === n) {
      result = '<span style="color:var(--success);font-weight:600;">Solução única</span>';
      const sol = solveSystem(A, B);
      explanation = "Determinante ≠ 0. O sistema é possível e determinado.<br>";
      explanation +=
        "Solução: " + sol.map((x, i) => `x${i + 1} = ${x.toFixed(4)}`).join(", ") + "<br>";
    } else {
      result = '<span style="color:var(--primary);font-weight:600;">Infinitas soluções</span>';
      explanation = "O sistema é possível e indeterminado (as equações são dependentes).<br>";
    }
  } else {
    result = '<span style="color:var(--danger);font-weight:600;">Nenhuma solução</span>';
    explanation = "O sistema é impossível (as equações são inconsistentes).<br>";
  }
  if (B.every((x) => x === 0)) {
    explanation = '<b style="color:var(--primary);">Sistema homogêneo</b><br>' + explanation;
  }
  if (rankA < systemSize) {
    explanation +=
      '<br><b style="color:var(--danger);">As linhas da matriz dos coeficientes são linearmente dependentes.</b>';
  } else {
    explanation +=
      '<br><b style="color:var(--success);">As linhas da matriz dos coeficientes são linearmente independentes.</b>';
  }
  explanation += `<br><b>Determinante:</b> ${detA.toFixed(4)}<br>`;
  explanation += `<b>Rank da matriz dos coeficientes:</b> ${rankA}<br>`;
  explanation += `<b>Rank da matriz aumentada:</b> ${rankAug}<br>`;
  explanation +=
    '<br><b>Matriz aumentada:</b><br><pre style="font-size:1em;">' +
    aug.map((row) => row.join("\t")).join("\n") +
    "</pre>";
  document.getElementById("result").innerHTML = result;
  document.getElementById("explanation").innerHTML = explanation;
  document.getElementById("resultCard").style.display = "";
  saveHistory(A, B, result, explanation);
}

// Histórico
function saveHistory(A, B, result, explanation) {
  let systemStr = "";
  for (let i = 0; i < systemSize; i++) {
    let eq = "";
    for (let j = 0; j < systemSize; j++) {
      eq += (A[i][j] >= 0 && j > 0 ? " + " : A[i][j] < 0 ? " - " : "") + Math.abs(A[i][j]) + "x" + (j + 1);
    }
    eq += " = " + B[i];
    systemStr += eq + (i < systemSize - 1 ? "; " : "");
  }
  let history = JSON.parse(localStorage.getItem("sistemasHistorico") || "[]");
  history.unshift({ system: systemStr, result, date: new Date().toLocaleString() });
  localStorage.setItem("sistemasHistorico", JSON.stringify(history.slice(0, 10)));
  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("sistemasHistorico") || "[]");
  const list = document.getElementById("history-list");
  const empty = document.getElementById("history-empty");
  list.innerHTML = "";
  if (history.length === 0) {
    empty.style.display = "";
    return;
  }
  empty.style.display = "none";
  history.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<b>${item.system}</b><br>
      <span>${item.result}</span><br>
      <small>${item.date}</small>`;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("sistemasHistorico");
  renderHistory();
}

// Copiar resultado
function copyResult() {
  const result = document.getElementById("result").innerText;
  const explanation = document.getElementById("explanation").innerText;
  const text = result + "\n" + explanation;
  navigator.clipboard.writeText(text);
  alert("Resultado copiado!");
}

// PDF (simples: print)
function downloadPDF() {
  window.print();
}

// ========== Histórico da entrada por texto ==========
// Salvar entrada no histórico localStorage
function saveTextInputHistory(text) {
  if (!text) return;
  let history = JSON.parse(localStorage.getItem("textInputHistory") || "[]");
  // Evitar duplicatas exatas
  if (history.includes(text)) {
    // Move para o topo
    history = history.filter((item) => item !== text);
  }
  history.unshift(text);
  // Limitar a 10 entradas
  if (history.length > 10) history.pop();
  localStorage.setItem("textInputHistory", JSON.stringify(history));
  renderTextInputHistory();
}

// Renderizar histórico na lista
function renderTextInputHistory() {
  const list = document.getElementById("textInputHistoryList");
  let history = JSON.parse(localStorage.getItem("textInputHistory") || "[]");
  list.innerHTML = "";
  if (history.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma entrada salva.";
    li.style.fontStyle = "italic";
    li.style.color = "var(--muted)";
    li.style.cursor = "default";
    list.appendChild(li);
    return;
  }
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry.length > 60 ? entry.slice(0, 60) + "..." : entry;
    li.title = entry;
    li.onclick = () => {
      document.getElementById("textInput").value = entry;
      document.getElementById("parseStatus").style.display = "none";
      document.getElementById("textInput").focus();
    };
    list.appendChild(li);
  });
}

// Limpar histórico da entrada por texto
function clearTextInputHistory() {
  if (confirm("Deseja realmente limpar o histórico de entradas?")) {
    localStorage.removeItem("textInputHistory");
    renderTextInputHistory();
  }
}

// Inicialização
renderMatrixInputs();
renderHistory();
renderTextInputHistory();