import { hierarchy, tree } from "d3-hierarchy";
import { select, zoom, zoomIdentity } from "d3";

export class TreeVisualizer {
  private container: HTMLElement;
  private svgSelection: any;
  private gSelection: any;
  private zoomBehavior: any;

  constructor(
    containerId: string,
    private callbacks?: {
      onHover?: (range: any) => void;
      onLeave?: () => void;
    },
  ) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container ${containerId} not found`);
    this.container = el;

    this.svgSelection = select(this.container)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("class", "block cursor-grab active:cursor-grabbing bg-gray-900");

    this.gSelection = this.svgSelection.append("g");

    this.zoomBehavior = zoom()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        this.gSelection.attr("transform", event.transform);
      });

    this.svgSelection.call(this.zoomBehavior);
  }

  // We only run this when code parses. This let's us kepe the previous drawn diagram when errors occur
  // so the screen doesn't flicker when the user starts adding new content.
  public drawTree(astData: any) {
    this.gSelection.selectAll("*").remove();

    if (!astData) return;

    const formattedData = this.transformCstToD3(astData);
    const root = hierarchy(formattedData, (d: any) => d.children);

    const treeLayout = tree().nodeSize([40, 200]);
    treeLayout(root as any);

    const nodes = root.descendants();
    const links = root.links();

    this.gSelection
      .selectAll("path.link")
      .data(links)
      .join("path")
      .attr("class", "link")
      .attr(
        "d",
        (link: any) => `
                        M${link.source.y},${link.source.x}
                        C${(link.source.y + link.target.y) / 2},${link.source.x}
                        ${(link.source.y + link.target.y) / 2},${link.target.x}
                        ${link.target.y},${link.target.x}
                    `,
      )
      .attr("stroke", "#475569")
      .attr("stroke-width", "1.5")
      .attr("fill", "none");

    const nodeGroups = this.gSelection
      .selectAll("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.y},${d.x})`);

    nodeGroups.on("mouseenter", (event: any, d: any) => {
      select(event.currentTarget)
        .select("rect")
        .classed("brightness-125", true);
      if (this.callbacks?.onHover && d.data.range) {
        this.callbacks.onHover(d.data.range);
      }
    });

    nodeGroups.on("mouseleave", (event: any) => {
      select(event.currentTarget)
        .select("rect")
        .classed("brightness-125", false);
      if (this.callbacks?.onLeave) {
        this.callbacks.onLeave();
      }
    });

    nodeGroups.each((d: any, i: number, nodesList: any) => {
      const nodeGroup = select(nodesList[i]);
      const isTerminal = d.data.isTerminal;
      const label = d.data.name || "?";
      const charCount = label.toString().length;
      const boxWidth = Math.max(40, charCount * 7 + 16);
      const boxHeight = 24;

      let strokeColor = "#3b82f6";
      let fillColor = "#1e3a8a";
      let textColor = "#bfdbfe";

      if (isTerminal) {
        strokeColor = "#22c55e";
        fillColor = "#14532d";
        textColor = "#bbf7d0";
      }

      nodeGroup
        .append("rect")
        .attr("x", -boxWidth / 2)
        .attr("y", -boxHeight / 2)
        .attr("width", boxWidth)
        .attr("height", boxHeight)
        .attr("rx", 4)
        .attr("fill", fillColor)
        .attr("stroke", strokeColor)
        .attr("stroke-width", 1)
        .attr("class", "transition-all cursor-pointer");

      nodeGroup
        .append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", textColor)
        .attr("font-size", "11")
        .attr("font-family", "monospace")
        .style("pointer-events", "none")
        .style("user-select", "none")
        .text(label);
    });
  }

  // Magic code for transforming to D3.
  private transformCstToD3(cstNode: any): any {
    if (!cstNode) return null;
    const d3Node: any = {
      name: cstNode.name || "Root",
      children: [],
      range: null,
    };
    if (cstNode.location) {
      d3Node.range = {
        startLine: cstNode.location.startLine,
        startColumn: cstNode.location.startColumn,
        endLine: cstNode.location.endLine,
        endColumn: cstNode.location.endColumn,
      };
    }
    if (cstNode.children) {
      for (const key in cstNode.children) {
        cstNode.children[key].forEach((child: any) => {
          if (child.image !== undefined) {
            d3Node.children.push({
              name: `${key}: "${child.image}"`,
              isTerminal: true,
              range: {
                startLine: child.startLine,
                startColumn: child.startColumn,
                endLine: child.endLine,
                endColumn: child.endColumn,
              },
            });
          } else {
            d3Node.children.push(this.transformCstToD3(child));
          }
        });
      }
    }
    return d3Node;
  }
}
