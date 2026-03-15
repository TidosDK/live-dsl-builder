export class SplitterManager {
  private isDragging = false;
  private currentSplitter: number | null = null;

  constructor(
    private workspace: HTMLElement,
    private panelMeta: HTMLElement,
    private panelApp: HTMLElement,
    private panelVis: HTMLElement,
    private split1: HTMLElement,
    private split2: HTMLElement,
    private onResizeComplete: () => void,
  ) {
    this.initEvents();
    this.loadLayout();
  }

  private initEvents() {
    this.split1.addEventListener("mousedown", () => this.startDrag(1));
    this.split2.addEventListener("mousedown", () => this.startDrag(2));
    document.addEventListener("mousemove", (e) => this.onDrag(e));
    document.addEventListener("mouseup", () => this.stopDrag());
  }

  private startDrag(splitterIndex: number) {
    this.isDragging = true;
    this.currentSplitter = splitterIndex;
    document.body.style.cursor = "col-resize";
    this.workspace.style.pointerEvents = "none";
    (splitterIndex === 1 ? this.split1 : this.split2).classList.add("active");
  }

  private onDrag(e: MouseEvent) {
    if (!this.isDragging || this.currentSplitter === null) return;

    const containerWidth = this.workspace.getBoundingClientRect().width;
    let percentage = (e.clientX / containerWidth) * 100;

    const minPercent = 10;
    const s1Position = parseFloat(this.split1.style.left);
    const s2Position = parseFloat(this.split2.style.left);

    if (this.currentSplitter === 1) {
      percentage = Math.max(
        minPercent,
        Math.min(percentage, s2Position - minPercent),
      );

      this.setSplit(percentage, this.split1);
    } else {
      percentage = Math.max(
        s1Position + minPercent,
        Math.min(percentage, 100 - minPercent),
      );

      this.setSplit(percentage, this.split2);
    }
  }

  private stopDrag() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.currentSplitter = null;
    document.body.style.cursor = "default";
    this.workspace.style.pointerEvents = "auto";
    this.split1.classList.remove("active");
    this.split2.classList.remove("active");

    this.saveLayout();
    this.onResizeComplete();
  }

  private setSplit(percent: number, splitElement: HTMLElement) {
    splitElement.style.left = `${percent}%`;

    if (splitElement == this.split1) {
      this.panelMeta.style.width = `${percent}%`;
      const pos = parseFloat(this.split2.style.left);
      this.panelApp.style.left = `${percent}%`;
      this.panelApp.style.width = `${pos - percent}%`;
    } else {
      const pos = parseFloat(this.split1.style.left);
      this.panelApp.style.width = `${percent - pos}%`;
      this.panelVis.style.width = `${100 - percent}%`;
    }
  }

  private saveLayout() {
    const s1Position = this.split1.style.left;
    const s2Position = this.split2.style.left;

    if (s1Position && s2Position) {
      localStorage.setItem("split1", s1Position);
      localStorage.setItem("split2", s2Position);
    }
  }

  private loadLayout() {
    const s1Position = localStorage.getItem("split1");
    const s2Position = localStorage.getItem("split2");

    if (s1Position && s2Position) {
      const p1 = parseFloat(s1Position);
      const p2 = parseFloat(s2Position);

      this.panelMeta.style.width = `${p1}%`;
      this.split1.style.left = `${p1}%`;

      this.panelApp.style.left = `${p1}%`;
      this.panelApp.style.width = `${p2 - p1}%`;

      this.split2.style.left = `${p2}%`;
      this.panelVis.style.width = `${100 - p2}%`;
    }
  }
}
