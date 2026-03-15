import { createSyntaxDiagramsCode } from "chevrotain";

export class RailroadVisualizer {
  private iframe: HTMLIFrameElement;

  constructor(iframeId: string) {
    const el = document.getElementById(iframeId);
    if (!el || !(el instanceof HTMLIFrameElement)) {
      throw new Error(`Iframe ${iframeId} not found`);
    }
    this.iframe = el;
  }

  public drawDiagrams(serializedGrammar: any[]) {
    if (!serializedGrammar || serializedGrammar.length === 0) return;

    try {
      const htmlText = createSyntaxDiagramsCode(serializedGrammar);

      const parser = new DOMParser();
      const virtualDoc = parser.parseFromString(htmlText, "text/html");

      // Without this the default Chevrotain diagram script will override the highlighting with colors we can't change.
      const scripts = virtualDoc.querySelectorAll("script");
      scripts.forEach((script) => {
        if (script.src && script.src.includes("diagrams_behavior.js")) {
          script.remove();
        }
      });

      const link = virtualDoc.createElement("link");
      link.rel = "stylesheet";
      link.href = "/railroad.css";
      virtualDoc.head.appendChild(link);

      const script = virtualDoc.createElement("script");
      script.src = "/railroad.js";
      virtualDoc.body.appendChild(script);

      this.iframe.srcdoc = virtualDoc.documentElement.outerHTML;
    } catch (e) {
      console.error("Failed to generate railroad diagrams:", e);
    }
  }
}
