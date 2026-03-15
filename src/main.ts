import { SplitterManager } from "./ui/SplitterManager";
import { EditorManager } from "./editors/EditorManager";
import { parseBnfToGrammarDef } from "./parsers/metaParser";
import { parseDynamicLanguage } from "./parsers/dynamicParser";
import { TreeVisualizer } from "./visualizer/TreeVisualizer";
import { RailroadVisualizer } from "./visualizer/RailroadVisualizer";

const defaultMetaDSL = `<Statemachine>   ::= "name" <Name> "states" { <State> } "end"
<State>          ::= "state" <Name> { <Connection> } "end"
<Connection>     ::= "connection" <Name> "state_reference" <Targetstate> "end"
<Targetstate>    ::= <Name>
<Name>           ::= <ID>
`;

const defaultApplicationDSL = `name "Music Player"
states
    state "Stopped"
        connection "PLAY [track > 0]" state_reference "Playing" end
        connection "FORWARD / track++" state_reference "Stopped" end
        connection "BACKWARD / track--" state_reference "Stopped" end
    end
    state "Playing"
        connection "STOP / track = 0" state_reference "Stopped" end
        connection "PAUSE" state_reference "Paused" end
    end
    state "Paused"
        connection "PLAY" state_reference "Playing" end
        connection "STOP / track = 0" state_reference "Stopped" end
        connection "FORWARD / track++" state_reference "Paused" end
    end
end
`;

document.addEventListener("DOMContentLoaded", () => {
  const statusMeta = document.getElementById("status-meta")!;
  const statusApp = document.getElementById("status-app")!;
  const consoleMeta = document.getElementById("console-meta")!;
  const consoleApp = document.getElementById("console-app")!;

  new SplitterManager(
    document.getElementById("workspace")!,
    document.getElementById("panel-meta")!,
    document.getElementById("panel-app")!,
    document.getElementById("panel-vis")!,
    document.getElementById("splitter-1")!,
    document.getElementById("splitter-2")!,
    () => {},
  );

  const btnAst = document.getElementById("btn-view-ast")!;
  const btnRailroad = document.getElementById("btn-view-railroad")!;
  const visAst = document.getElementById("visualizer-ast")!;
  const visRailroad = document.getElementById("visualizer-railroad")!;
  let currentView: "ast" | "railroad" = "ast";

  let currentGrammarDef: any = null;

  btnAst.addEventListener("click", () => {
    currentView = "ast";
    btnAst.className = "px-3 py-1 bg-blue-600 text-white transition-colors";
    btnRailroad.className =
      "px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors";
    visAst.classList.remove("hidden");
    visRailroad.classList.add("hidden");
  });

  btnRailroad.addEventListener("click", () => {
    currentView = "railroad";
    btnRailroad.className =
      "px-3 py-1 bg-blue-600 text-white transition-colors";
    btnAst.className =
      "px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors";
    visRailroad.classList.remove("hidden");
    visAst.classList.add("hidden");
  });

  const savedMeta = localStorage.getItem("metaCode") || defaultMetaDSL;
  const savedApp = localStorage.getItem("appCode") || defaultApplicationDSL;

  const editorApp = new EditorManager("editor-app", savedApp, () =>
    runPipeline(),
  );
  const editorMeta = new EditorManager("editor-meta", savedMeta, () => {
    editorApp.highlightCodeBasedOnRange(null);
    runPipeline();
  });

  const treeVisualizer = new TreeVisualizer("visualizer-ast", {
    onHover: (range) => editorApp.highlightCodeBasedOnRange(range),
    onLeave: () => editorApp.highlightCodeBasedOnRange(null),
  });
  const railroadVisualizer = new RailroadVisualizer("railroad-iframe");

  const btnReset = document.getElementById("btn-reset")!;

  btnReset.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all code and layout sizes?")) {
      localStorage.clear();

      editorMeta.setEditorCode(defaultMetaDSL);
      editorApp.setEditorCode(defaultApplicationDSL);

      const panelMeta = document.getElementById("panel-meta")!;
      const panelApp = document.getElementById("panel-app")!;
      const panelVis = document.getElementById("panel-vis")!;
      const split1 = document.getElementById("splitter-1")!;
      const split2 = document.getElementById("splitter-2")!;

      panelMeta.style.width = "33.33%";
      split1.style.left = "33.33%";

      panelApp.style.left = "33.33%";
      panelApp.style.width = "33.33%";

      split2.style.left = "66.66%";
      panelVis.style.width = "33.33%";

      editorMeta.getEditorLayout();
      editorApp.getEditorLayout();

      runPipeline();
    }
  });

  // Disable CTRL + S
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
    }
  });

  function runPipeline() {
    const metaCode = editorMeta.getEditorCode();
    const appCode = editorApp.getEditorCode();

    localStorage.setItem("metaCode", metaCode);
    localStorage.setItem("appCode", appCode);

    const metaResult = parseBnfToGrammarDef(metaCode);

    if (metaResult.error) {
      updateStatus(statusMeta, "Error", "bg-red-600");
      showConsoleError(
        consoleMeta,
        `<div><strong>[Syntax Error]</strong> ${metaResult.error}</div>`,
      );
      updateStatus(statusApp, "Waiting on Grammar", "bg-gray-600");
      hideConsole(consoleApp);
      return;
    }

    currentGrammarDef = metaResult.grammarDef;

    if (metaResult.grammarDef) {
      const appResult = parseDynamicLanguage(
        JSON.stringify(metaResult.grammarDef),
        appCode,
      );

      if (appResult.error) {
        updateStatus(statusMeta, "Reference Error", "bg-red-600");
        showConsoleError(
          consoleMeta,
          `<div><strong>[Grammar Logic Error]</strong> ${appResult.error}</div>`,
        );

        updateStatus(statusApp, "Waiting on Grammar", "bg-gray-600");
        hideConsole(consoleApp);
        return;
      }

      updateStatus(statusMeta, "Valid", "bg-green-600");
      hideConsole(consoleMeta);

      if (appResult.serializedGrammar) {
        railroadVisualizer.drawDiagrams(appResult.serializedGrammar);
      }

      const allAppErrors = [
        ...(appResult.lexErrors || []),
        ...(appResult.parseErrors || []),
      ];

      if (allAppErrors.length > 0) {
        updateStatus(
          statusApp,
          `${allAppErrors.length} Error(s)`,
          "bg-red-600",
        );

        const errorHtml = allAppErrors
          .map((err: any) => {
            const line = err.token ? err.token.startLine : err.line;
            const col = err.token ? err.token.startColumn : err.column;
            const pos = line ? `[Line ${line}, Col ${col}]` : "";

            return `<div class="mb-1 border-b border-red-900 pb-1">
                        <strong class="text-yellow-400">${pos}</strong> ${err.message}
                    </div>`;
          })
          .join("");

        showConsoleError(consoleApp, errorHtml);
      } else {
        updateStatus(statusApp, "Valid", "bg-green-600");
        hideConsole(consoleApp);
        treeVisualizer.drawTree(appResult.cst);
      }
    }
  }

  window.addEventListener("message", (event) => {
    if (!event.data || typeof event.data !== "object") return;

    if (event.data.type === "railroadHover") {
      const searchText = event.data.name;
      const ruleContext = event.data.rule;

      let query = searchText;

      if (searchText.startsWith("T_") && currentGrammarDef) {
        const tokenDef = currentGrammarDef.tokens.find(
          (t: any) => t.name === searchText,
        );
        if (tokenDef) {
          query = `"${tokenDef.pattern}"`;
        }
      } else {
        query = `<${searchText}>`;
      }

      editorMeta.highlightCodeBasedOnContext(query, ruleContext);
    } else if (event.data.type === "railroadLeave") {
      editorMeta.highlightCodeBasedOnRange(null);
    }
  });

  function updateStatus(element: HTMLElement, msg: string, colorClass: string) {
    element.textContent = msg;
    element.className = `px-2 py-0.5 rounded font-mono text-[10px] text-white ${colorClass}`;
  }

  function showConsoleError(container: HTMLElement, messageHtml: string) {
    container.innerHTML = `<div class="mb-2 uppercase tracking-wider font-bold text-red-500">Errors Found</div>${messageHtml}`;
    container.classList.remove("hidden");
    editorMeta.getEditorLayout();
    editorApp.getEditorLayout();
  }

  function hideConsole(container: HTMLElement) {
    if (!container.classList.contains("hidden")) {
      container.innerHTML = "";
      container.classList.add("hidden");
      editorMeta.getEditorLayout();
      editorApp.getEditorLayout();
    }
  }

  runPipeline();
});
