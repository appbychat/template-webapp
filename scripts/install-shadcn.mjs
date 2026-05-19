#!/usr/bin/env node
// One-shot: add every shadcn/ui component. Re-run any time with `npm run shadcn:add-all`.
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

const components = [
  "accordion", "alert", "alert-dialog", "aspect-ratio", "avatar",
  "badge", "breadcrumb", "button", "calendar", "card", "carousel",
  "chart", "checkbox", "collapsible", "command", "context-menu",
  "dialog", "drawer", "dropdown-menu", "form", "hover-card",
  "input", "input-otp", "label", "menubar", "navigation-menu",
  "pagination", "popover", "progress", "radio-group", "resizable",
  "scroll-area", "select", "separator", "sheet", "sidebar",
  "skeleton", "slider", "sonner", "switch", "table",
  "tabs", "textarea", "toggle", "toggle-group", "tooltip",
];

const args = process.argv.slice(2);
const force = args.includes("--force");

// Idempotent: only add components that are missing (unless --force).
const missing = force
  ? components
  : components.filter((c) => !existsSync(`src/components/ui/${c}.tsx`));

if (missing.length === 0) {
  console.log("[shadcn] all components present — nothing to do.");
  process.exit(0);
}

const flag = force ? "--overwrite" : "--yes";
console.log(`[shadcn] adding ${missing.length} component(s): ${missing.join(", ")}`);
// `yes n |` declines any "overwrite existing file?" prompts the CLI raises for
// shared sub-deps (button, card, etc.). With --force we want to overwrite, so skip the pipe.
const cmd = force
  ? `npx --yes shadcn@latest add ${missing.join(" ")} ${flag}`
  : `yes n | npx --yes shadcn@latest add ${missing.join(" ")} ${flag}`;
execSync(cmd, { stdio: "inherit", shell: "/bin/bash" });
console.log("[shadcn] done.");
