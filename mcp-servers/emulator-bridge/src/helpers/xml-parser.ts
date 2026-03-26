/**
 * Parses Android uiautomator XML dump into structured JSON.
 * Each node contains class, text, content description, resource ID,
 * bounds (parsed from "[x1,y1][x2,y2]" format), and interaction flags.
 */

export interface UiNode {
  class: string;
  text: string;
  contentDesc: string;
  resourceId: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  clickable: boolean;
  scrollable: boolean;
  focusable: boolean;
  children: UiNode[];
}

interface RawAttributes {
  class?: string;
  text?: string;
  "content-desc"?: string;
  "resource-id"?: string;
  bounds?: string;
  clickable?: string;
  scrollable?: string;
  focusable?: string;
  [key: string]: string | undefined;
}

/**
 * Parse bounds string from uiautomator format "[x1,y1][x2,y2]"
 * into {x, y, width, height}.
 */
function parseBounds(boundsStr: string): UiNode["bounds"] {
  const match = boundsStr.match(
    /\[(\d+),(\d+)\]\[(\d+),(\d+)\]/
  );
  if (!match) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  const x1 = parseInt(match[1], 10);
  const y1 = parseInt(match[2], 10);
  const x2 = parseInt(match[3], 10);
  const y2 = parseInt(match[4], 10);
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}

/**
 * Minimal XML parser for uiautomator dump output.
 * Does not rely on any external XML parsing library.
 * Handles the subset of XML produced by uiautomator dump.
 */
export function parseUiDump(xml: string): UiNode[] {
  const nodes: UiNode[] = [];
  const stack: UiNode[] = [];

  // Match both self-closing tags and opening/closing tags
  const tagRegex = /<(\/?)(\w+)((?:\s+[\w-]+="[^"]*")*)\s*(\/?)>/g;
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(xml)) !== null) {
    const isClosing = match[1] === "/";
    const tagName = match[2];
    const attrString = match[3];
    const isSelfClosing = match[4] === "/";

    // Skip the root <hierarchy> tag content but process its children
    if (tagName === "hierarchy") {
      if (isClosing) continue;
      continue;
    }

    if (isClosing) {
      // Pop from stack
      const finished = stack.pop();
      if (finished) {
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(finished);
        } else {
          nodes.push(finished);
        }
      }
      continue;
    }

    // Parse attributes
    const attrs: RawAttributes = {};
    const attrRegex = /([\w-]+)="([^"]*)"/g;
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }

    const node: UiNode = {
      class: attrs.class || "",
      text: attrs.text || "",
      contentDesc: attrs["content-desc"] || "",
      resourceId: attrs["resource-id"] || "",
      bounds: parseBounds(attrs.bounds || ""),
      clickable: attrs.clickable === "true",
      scrollable: attrs.scrollable === "true",
      focusable: attrs.focusable === "true",
      children: [],
    };

    if (isSelfClosing) {
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(node);
      } else {
        nodes.push(node);
      }
    } else {
      stack.push(node);
    }
  }

  // Flush any remaining nodes on the stack
  while (stack.length > 1) {
    const child = stack.pop()!;
    stack[stack.length - 1].children.push(child);
  }
  if (stack.length === 1) {
    nodes.push(stack.pop()!);
  }

  return nodes;
}
