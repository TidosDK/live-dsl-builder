import { EditorManager } from "../editors/EditorManager";

export function updateStatus(
  element: HTMLElement | null,
  msg: string,
  colorClass: string,
) {
  if (!element) return;
  element.textContent = msg;
  element.className = `px-2 py-0.5 rounded font-mono text-[10px] text-white ${colorClass}`;
}

export function showConsoleError(
  container: HTMLElement | null,
  messageHtml: string,
  editors: EditorManager[] = [],
) {
  if (!container) return;
  container.innerHTML = `<div class="mb-2 uppercase tracking-wider font-bold text-red-500">Errors Found</div>${messageHtml}`;
  container.classList.remove("hidden");
  editors.forEach((ed) => ed?.getEditorLayout());
}

export function hideConsole(
  container: HTMLElement | null,
  editors: EditorManager[] = [],
) {
  if (!container || container.classList.contains("hidden")) return;
  container.innerHTML = "";
  container.classList.add("hidden");
  editors.forEach((ed) => ed?.getEditorLayout());
}
