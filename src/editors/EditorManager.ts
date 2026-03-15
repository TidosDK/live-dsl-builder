import * as monaco from "monaco-editor";

export class EditorManager {
  private editor: monaco.editor.IStandaloneCodeEditor;
  private decorations: string[] = [];
  private highlightCSSProperties: string =
    "bg-yellow-500 bg-opacity-30 border-b-2 border-yellow-500 text-white";

  constructor(
    containerId: string,
    initialCode: string,
    private onChangeCallback: (code: string) => void,
  ) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error(`Container ${containerId} not found`);

    this.editor = monaco.editor.create(container, {
      value: initialCode,
      language: "plaintext",
      theme: "vs-dark",
      minimap: { enabled: false },
      automaticLayout: true,
      wordWrap: "off",
    });

    this.editor.onDidChangeModelContent(() => {
      this.onChangeCallback(this.editor.getValue());
    });
  }

  public getEditorCode(): string {
    return this.editor.getValue();
  }

  public setEditorCode(code: string) {
    this.editor.setValue(code);
  }

  public getEditorLayout() {
    this.editor.layout();
  }

  public highlightCodeBasedOnRange(
    range: {
      startLine: number;
      startColumn: number;
      endLine: number;
      endColumn: number;
    } | null,
  ) {
    if (!range) {
      this.decorations = this.editor.deltaDecorations(this.decorations, []);
      return;
    }

    this.decorations = this.editor.deltaDecorations(this.decorations, [
      {
        range: new monaco.Range(
          range.startLine,
          range.startColumn,
          range.endLine,
          range.endColumn + 1,
        ),
        options: {
          inlineClassName: this.highlightCSSProperties,
          isWholeLine: false,
        },
      },
    ]);

    this.editor.revealRangeInCenter(
      new monaco.Range(
        range.startLine,
        range.startColumn,
        range.endLine,
        range.endColumn,
      ),
    );
  }

  public highlightCodeBasedOnContext(query: string, ruleContext?: string) {
    const model = this.editor.getModel();
    if (!model) return;

    let searchRange: any = false;

    if (ruleContext) {
      const ruleQuery = `^\\s*<${ruleContext}>\\s*::=`;

      // The following comments and explanations are copied directly from the documentation.
      const ruleMatches = model.findMatches(
        ruleQuery, // searchString - The string used to search. If it is a regular expression, set isRegex to true.
        false, // searchOnlyEditableRange - Limit the searching to only search inside the editable range of the model.
        true, // isRegex - Used to indicate that searchString is a regular expression.
        false, // matchCase - Force the matching to match lower/upper case exactly.
        null, // wordSeparators - Force the matching to match entire words only. Pass null otherwise.
        false, // captureMatches - The result will contain the captured groups.
      );

      if (ruleMatches && ruleMatches.length > 0) {
        const startLine = ruleMatches[0].range.startLineNumber;

        let endLine = model.getLineCount();
        for (let i = startLine + 1; i <= model.getLineCount(); i++) {
          const lineContent = model.getLineContent(i);
          if (lineContent.trim().match(/^<[A-Za-z0-9_-]+>\s*::=/)) {
            endLine = i - 1;
            break;
          }
        }

        searchRange = new monaco.Range(
          startLine,
          1,
          endLine,
          model.getLineMaxColumn(endLine),
        );
      }
    }

    // The following comments and explanations are copied directly from the documentation.
    const matches = model.findMatches(
      query, // searchString - The string used to search. If it is a regular expression, set isRegex to true.
      searchRange, // searchOnlyEditableRange - Limit the searching to only search inside the editable range of the model.
      false, // isRegex - Used to indicate that searchString is a regular expression.
      true, // matchCase - Force the matching to match lower/upper case exactly.
      null, // wordSeparators - Force the matching to match entire words only. Pass null otherwise.
      false, // captureMatches - The result will contain the captured groups.
    );

    if (!(matches && matches.length > 0)) {
      this.decorations = this.editor.deltaDecorations(this.decorations, []);
    }

    const newDecorations: any[] = [];

    matches.forEach((m) => {
      newDecorations.push({
        range: m.range,
        options: {
          inlineClassName: this.highlightCSSProperties,
          isWholeLine: false,
        },
      });
    });

    this.decorations = this.editor.deltaDecorations(
      this.decorations,
      newDecorations,
    );
  }
}
