// Script used to handle hovering in the Railroad diagram

window.initDiagramsBehavior = function () {};

function setHighlight(name, active) {
  document.querySelectorAll("g.terminal, g.non-terminal").forEach((node) => {
    const textEl = node.querySelector("text");
    if (textEl && textEl.textContent.trim() === name) {
      if (active) {
        node.classList.add("custom-highlight");
      } else {
        node.classList.remove("custom-highlight");
      }
    }
  });

  document.querySelectorAll(".diagramHeader").forEach((header) => {
    if (header.textContent.trim() === name) {
      if (active) {
        header.classList.add("custom-header-highlight");
      } else {
        header.classList.remove("custom-header-highlight");
      }
    }
  });
}

document.body.addEventListener("mouseover", (e) => {
  const node = e.target.closest("g.terminal, g.non-terminal");
  if (!node) return;

  const related = e.relatedTarget;
  if (related && node.contains(related)) return;

  const textEl = node.querySelector("text");
  if (textEl) {
    const name = textEl.textContent.trim();

    setHighlight(name, true);

    let ruleContext = "";
    const svg = node.closest("svg");
    if (svg && svg.parentElement) {
      const header = svg.parentElement.previousElementSibling;
      if (header && header.classList.contains("diagramHeader")) {
        ruleContext = header.id || header.textContent.trim();
      }
    }
    window.parent.postMessage(
      { type: "railroadHover", name: name, rule: ruleContext },
      "*",
    );
  }
});

document.body.addEventListener("mouseout", (e) => {
  const node = e.target.closest("g.terminal, g.non-terminal");
  if (!node) return;

  const related = e.relatedTarget;
  if (related && node.contains(related)) return;

  const textEl = node.querySelector("text");
  if (textEl) {
    setHighlight(textEl.textContent.trim(), false);
  }

  window.parent.postMessage({ type: "railroadLeave" }, "*");
});
