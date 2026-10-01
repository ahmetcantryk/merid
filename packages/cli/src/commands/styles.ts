import type { Change } from "../changes.js";
import { addStylesImport } from "../content.js";
import { STYLES_IMPORT } from "../data.js";
import type { Project } from "../detect.js";
import {
  LAYER_ORDER,
  addLayerOrder,
  hasLayerOrder,
  placeStylesAfter,
  readStylesheets,
  templateFindings,
  type Stylesheets,
} from "../stylesheets.js";
import { TEMPLATE_STYLES, removeTemplateRules } from "../templates.js";
import type { Context } from "./context.js";

function entryChange(styles: Stylesheets): Change | undefined {
  if (styles.meridInCss) return undefined;
  const tailwind = styles.tailwind?.specifier;
  return tailwind
    ? {
        file: styles.entry,
        after: placeStylesAfter(styles.entrySource, tailwind),
        reason: `import Merid's stylesheet once, after ${tailwind} so Tailwind's layer order applies`,
      }
    : { file: styles.entry, after: addStylesImport(styles.entrySource), reason: "import Merid's stylesheet once, at the app entry" };
}

/** Edits to the app's stylesheets: generator rules that override Merid, and Tailwind's layer order. */
function sheetChanges(project: Project, styles: Stylesheets): Change[] {
  const findings = templateFindings(project, styles);
  const changes: Change[] = [];
  for (const sheet of styles.sheets) {
    const finding = findings.find((f) => f.sheet.file === sheet.file);
    const needsLayers = sheet === styles.tailwind && !hasLayerOrder(sheet.source);
    if (!finding && !needsLayers) continue;
    const template = project.framework ? TEMPLATE_STYLES[project.framework].name : "";
    const cleaned = finding && project.framework ? removeTemplateRules(sheet.source, project.framework) : sheet.source;
    const reasons = [
      ...(finding ? [`remove ${template} template rules that override Merid`] : []),
      ...(needsLayers ? ["put Merid's layers after Tailwind's Preflight"] : []),
    ];
    const details = [
      ...(finding?.matches.map((m) => `${m.selector}: ${m.rule.effect}`) ?? []),
      ...(needsLayers ? [`adds ${LAYER_ORDER}`] : []),
    ];
    changes.push({
      file: sheet.file,
      after: needsLayers ? addLayerOrder(cleaned) : cleaned,
      reason: reasons.join(", "),
      details,
      question: finding && !needsLayers ? `Remove the ${template} template rules from ${sheet.file}?` : `Update ${sheet.file}?`,
    });
  }
  return changes;
}

/** Everything init changes so Merid's styles apply: the stylesheet import and the app's own CSS. */
export function stylesChanges(ctx: Context, project: Project): Change[] {
  const styles = readStylesheets(ctx.cwd, project);
  if (!styles) {
    ctx.io.warn(`Could not find the app entry. Add \`import "${STYLES_IMPORT}";\` to your root layout or main file.`);
    return [];
  }
  const entry = entryChange(styles);
  return [...(entry ? [entry] : []), ...sheetChanges(project, styles)];
}
