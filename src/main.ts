import { SplitterManager } from "./ui/SplitterManager";
import { EditorManager } from "./editors/EditorManager";
import { TreeVisualizer } from "./visualizer/TreeVisualizer";
import { RailroadVisualizer } from "./visualizer/RailroadVisualizer";
import { defaultMetaDSL, defaultApplicationDSL } from "./config/DefaultDSL";
import { updateStatus, showConsoleError, hideConsole } from "./ui/UIHelpers";
import { compileDSL } from "./CompilerService";

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  if (path === "/") return;

  const statusMeta = document.getElementById("status-meta");
  const statusApp = document.getElementById("status-app");
  const consoleMeta = document.getElementById("console-meta");
  const consoleApp = document.getElementById("console-app");

  const dslChannel = new BroadcastChannel("live-dsl-channel");

  let editorMeta: EditorManager | null = null;
  let editorApp: EditorManager | null = null;
  let treeVisualizer: TreeVisualizer | null = null;
  let railroadVisualizer: RailroadVisualizer | null = null;
  let currentGrammarDef: any = null;
  let latestCompiledData: any = null;

  const savedMeta = localStorage.getItem("metaCode") || defaultMetaDSL;
  const savedApp = localStorage.getItem("appCode") || defaultApplicationDSL;

  const panelMeta = document.getElementById("panel-meta");
  const panelApp = document.getElementById("panel-app");
  const panelVis = document.getElementById("panel-vis");
  const split1 = document.getElementById("splitter-1");
  const split2 = document.getElementById("splitter-2");

  if (path === "/visualization") {
    if (panelVis) {
      panelVis.style.width = "100%";
      panelVis.style.left = "0%";
    }

    treeVisualizer = new TreeVisualizer("visualizer-ast", {
      onHover: (range) => dslChannel.postMessage({ type: "AST_HOVER", range }),
      onLeave: () => dslChannel.postMessage({ type: "AST_LEAVE" }),
    });
    railroadVisualizer = new RailroadVisualizer("railroad-iframe");
    setupVisualizerButtons();

    window.addEventListener("message", (event) => {
      if (
        event.data?.type === "railroadHover" ||
        event.data?.type === "railroadLeave"
      ) {
        dslChannel.postMessage(event.data);
      }
    });

    dslChannel.onmessage = (event) => {
      if (event.data.type === "RENDER_VISUALS") {
        if (event.data.cst) treeVisualizer?.drawTree(event.data.cst);
        if (event.data.grammar)
          railroadVisualizer?.drawDiagrams(event.data.grammar);
      }
    };
    return;
  }

  if (path === "/metadsl") {
    if (panelMeta) {
      panelMeta.style.width = "100%";
      panelMeta.style.left = "0%";
    }
    editorMeta = new EditorManager("editor-meta", savedMeta, () =>
      runPipeline(),
    );
  }

  if (path === "/applicationdsl") {
    if (panelApp) {
      panelApp.style.width = "100%";
      panelApp.style.left = "0%";
    }
    editorApp = new EditorManager("editor-app", savedApp, () => runPipeline());
  }

  if (path === "/full") {
    if (split1 && split2 && panelMeta && panelApp && panelVis) {
      new SplitterManager(
        document.getElementById("workspace")!,
        panelMeta,
        panelApp,
        panelVis,
        split1,
        split2,
        () => window.dispatchEvent(new Event("resize")),
      );
    }

    editorApp = new EditorManager("editor-app", savedApp, () => runPipeline());
    editorMeta = new EditorManager("editor-meta", savedMeta, () => {
      editorApp?.highlightCodeBasedOnRange(null);
      runPipeline();
    });

    treeVisualizer = new TreeVisualizer("visualizer-ast", {
      onHover: (range) => editorApp?.highlightCodeBasedOnRange(range),
      onLeave: () => editorApp?.highlightCodeBasedOnRange(null),
    });
    railroadVisualizer = new RailroadVisualizer("railroad-iframe");
    setupVisualizerButtons();

    window.addEventListener("message", (event) => {
      if (!event.data || typeof event.data !== "object") return;
      if (event.data.type === "railroadHover") {
        const searchText = event.data.name;
        let query = searchText;
        if (searchText.startsWith("T_") && currentGrammarDef) {
          const tokenDef = currentGrammarDef.tokens.find(
            (t: any) => t.name === searchText,
          );
          if (tokenDef) query = `"${tokenDef.pattern}"`;
        } else {
          query = `<${searchText}>`;
        }
        editorMeta?.highlightCodeBasedOnContext(query, event.data.rule);
      } else if (event.data.type === "railroadLeave") {
        editorMeta?.highlightCodeBasedOnRange(null);
      }
    });
  }

  const btnManualCompile = document.getElementById("btn-manual-compile");
  if (btnManualCompile) {
    btnManualCompile.addEventListener("click", () => {
      runPipeline();
      if (latestCompiledData) {
        dslChannel.postMessage({
          type: "RENDER_VISUALS",
          cst: latestCompiledData.cst,
          grammar: latestCompiledData.grammar,
        });
      }
    });
  }

  const btnReset = document.getElementById("btn-reset");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      if (
        confirm("Are you sure you want to reset all code and layout sizes?")
      ) {
        localStorage.clear();
        editorMeta?.setEditorCode(defaultMetaDSL);
        editorApp?.setEditorCode(defaultApplicationDSL);

        if (
          path === "/full" &&
          panelMeta &&
          panelApp &&
          panelVis &&
          split1 &&
          split2
        ) {
          panelMeta.style.width = "33.33%";
          split1.style.left = "33.33%";
          panelApp.style.left = "33.33%";
          panelApp.style.width = "33.33%";
          split2.style.left = "66.66%";
          panelVis.style.left = "66.66%";
          panelVis.style.width = "33.33%";
        }

        editorMeta?.getEditorLayout();
        editorApp?.getEditorLayout();
        runPipeline();
      }
    });
  }

  dslChannel.onmessage = (event) => {
    if (event.data.type === "AST_HOVER")
      editorApp?.highlightCodeBasedOnRange(event.data.range);
    if (event.data.type === "AST_LEAVE")
      editorApp?.highlightCodeBasedOnRange(null);
    if (event.data.type === "railroadHover") {
      const searchText = event.data.name;
      let query = searchText;
      if (searchText.startsWith("T_") && currentGrammarDef) {
        const tokenDef = currentGrammarDef.tokens.find(
          (t: any) => t.name === searchText,
        );
        if (tokenDef) query = `"${tokenDef.pattern}"`;
      } else {
        query = `<${searchText}>`;
      }
      editorMeta?.highlightCodeBasedOnContext(query, event.data.rule);
    }
    if (event.data.type === "railroadLeave")
      editorMeta?.highlightCodeBasedOnRange(null);

    if (event.data.type === "REMOTE_COMPILE") {
      runPipeline();
    }
  };

  function runPipeline() {
    const metaCode = editorMeta
      ? editorMeta.getEditorCode()
      : localStorage.getItem("metaCode") || defaultMetaDSL;
    const appCode = editorApp
      ? editorApp.getEditorCode()
      : localStorage.getItem("appCode") || defaultApplicationDSL;

    if (editorMeta) localStorage.setItem("metaCode", metaCode);
    if (editorApp) localStorage.setItem("appCode", appCode);

    const editors: EditorManager[] = [];
    if (editorMeta) editors.push(editorMeta);
    if (editorApp) editors.push(editorApp);

    if (btnManualCompile) {
      (btnManualCompile as HTMLButtonElement).disabled = true;
      btnManualCompile.classList.add("opacity-50", "cursor-not-allowed");
    }

    editorApp?.clearErrors();
    editorMeta?.clearErrors();

    const result = compileDSL(metaCode, appCode);
    currentGrammarDef = result.grammarDef || null;

    if (
      result.metaErrorString ||
      (result.metaErrors && result.metaErrors.length > 0)
    ) {
      updateStatus(statusMeta, "Error", "bg-red-600");

      if (result.metaErrors && result.metaErrors.length > 0) {
        editorMeta?.setErrors(result.metaErrors);
      }

      showConsoleError(
        consoleMeta,
        `<div><strong>[Syntax Error]</strong> ${result.metaErrorString}</div>`,
        editors,
      );

      updateStatus(statusApp, "Waiting on Grammar", "bg-gray-600");
      hideConsole(consoleApp, editors);
      return;
    }

    if (result.appLogicError) {
      updateStatus(statusMeta, "Reference Error", "bg-red-600");
      showConsoleError(
        consoleMeta,
        `<div><strong>[Grammar Logic Error]</strong> ${result.appLogicError}</div>`,
        editors,
      );
      updateStatus(statusApp, "Waiting on Grammar", "bg-gray-600");
      hideConsole(consoleApp, editors);
      return;
    }

    updateStatus(statusMeta, "Valid", "bg-green-600");
    hideConsole(consoleMeta, editors);

    if (result.appSyntaxErrors) {
      updateStatus(
        statusApp,
        `${result.appSyntaxErrors.length} Error(s)`,
        "bg-red-600",
      );

      editorApp?.setErrors(result.appSyntaxErrors);

      const errorHtml = result.appSyntaxErrors
        .map((err: any) => {
          const line = err.token ? err.token.startLine : err.line;
          const col = err.token ? err.token.startColumn : err.column;
          const pos = line ? `[Line ${line}, Col ${col}]` : "";
          return `<div class="mb-1 border-b border-red-900 pb-1"><strong class="text-yellow-400">${pos}</strong> ${err.message}</div>`;
        })
        .join("");
      showConsoleError(consoleApp, errorHtml, editors);
    } else {
      updateStatus(statusApp, "Valid", "bg-green-600");
      hideConsole(consoleApp, editors);
    }

    if (result.success) {
      if (btnManualCompile) {
        (btnManualCompile as HTMLButtonElement).disabled = false;
        btnManualCompile.classList.remove("opacity-50", "cursor-not-allowed");
      }

      latestCompiledData = {
        cst: result.cst,
        grammar: result.serializedGrammar,
      };

      if (path === "/full") {
        if (result.cst) treeVisualizer?.drawTree(result.cst);
        if (result.serializedGrammar)
          railroadVisualizer?.drawDiagrams(result.serializedGrammar);
      } else if (path === "/metadsl" || path === "/applicationdsl") {
        dslChannel.postMessage({ type: "REMOTE_COMPILE" });
      }
    }
  }

  function setupVisualizerButtons() {
    const btnAst = document.getElementById("btn-view-ast");
    const btnRailroad = document.getElementById("btn-view-railroad");
    const btnExportSvg = document.getElementById("btn-export-svg");
    const visAst = document.getElementById("visualizer-ast");
    const visRailroad = document.getElementById("visualizer-railroad");

    let currentView: "ast" | "railroad" = "ast";

    btnExportSvg?.addEventListener("click", () => {
      if (currentView === "ast") treeVisualizer?.exportToSvg();
      else alert("SVG export is only supported for the AST diagram.");
    });

    if (btnAst && btnRailroad && visAst && visRailroad) {
      btnAst.addEventListener("click", () => {
        currentView = "ast";
        btnAst.className =
          "px-3 py-1 bg-blue-600 text-white transition-colors rounded-l border border-blue-600";
        btnRailroad.className =
          "px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 bg-gray-800 transition-colors rounded-r border border-gray-700 border-l-0";
        visAst.classList.remove("hidden");
        visRailroad.classList.add("hidden");
      });

      btnRailroad.addEventListener("click", () => {
        currentView = "railroad";
        btnRailroad.className =
          "px-3 py-1 bg-blue-600 text-white transition-colors rounded-r border border-blue-600";
        btnAst.className =
          "px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 bg-gray-800 transition-colors rounded-l border border-gray-700 border-r-0";
        visRailroad.classList.remove("hidden");
        visAst.classList.add("hidden");
      });
    }
  }

  runPipeline();
});
