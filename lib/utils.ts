import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NodePath } from "@babel/core";
import * as t from "@babel/types";
import * as Babel from "@babel/standalone";
import * as React from "react";
import * as recharts from "recharts";
import * as uiComponents from "@/components/ui";
import * as lucide from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getReactComponentFromCode = (code: string) => {
  const transformedCode = transformCode(code);
  console.log("transformedCode", transformedCode);

  const factoryFunction = new Function(transformedCode)();
  const component = factoryFunction(React, recharts, uiComponents, lucide);

  return component;
};

const transformCode = (code: string) => {
  const { modifiedInput: codeWithoutExports, exportedName: componentName } =
    removeDefaultExport(code);

  const transpiledCode = Babel.transform(codeWithoutExports, {
    presets: ["react"],
    plugins: [importTransformerPlugin],
  }).code;

  return `
return function(React, recharts, uiComponents, lucide) {
  ${transpiledCode}
  return ${componentName};
}
  `;
};

export const importTransformerPlugin = () => ({
  name: "import-transformer",
  visitor: {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      const source = path.node.source.value;
      const specifiers = path.node.specifiers;

      if (specifiers.length === 0) return;

      let objectName: string;
      if (source === "react") {
        objectName = "React";
      } else if (source.startsWith("@/components/ui")) {
        objectName = "uiComponents";
      } else if (source === "lucide-react") {
        objectName = "lucide";
      } else {
        objectName = source;
      }

      const properties = specifiers
        .map((specifier) => {
          if (t.isImportSpecifier(specifier)) {
            const imported = specifier.imported;
            const importedName = t.isIdentifier(imported)
              ? imported.name
              : t.isStringLiteral(imported)
              ? imported.value
              : null;

            if (importedName === null) {
              console.warn("Unexpected import specifier type");
              return null;
            }

            return t.objectProperty(
              t.identifier(importedName),
              t.identifier(specifier.local.name),
              false,
              importedName === specifier.local.name
            );
          }
          return null;
        })
        .filter((prop): prop is t.ObjectProperty => prop !== null);

      const newDeclaration = t.variableDeclaration("const", [
        t.variableDeclarator(
          t.objectPattern(properties),
          t.identifier(objectName)
        ),
      ]);

      path.replaceWith(newDeclaration);
    },
  },
});

export const removeDefaultExport = (
  input: string
): {
  modifiedInput: string;
  exportedName: string | null;
} => {
  // Regex to match the default export with declaration line
  const defaultExportWithDeclarationRegex =
    /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*{[^}]*}/;

  // Regex to match the default export line
  const defaultExportRegex = /export\s+default\s+([A-Za-z0-9_]+);?/;

  let match = input.match(defaultExportWithDeclarationRegex);
  let exportedName: string | null = null;
  let modifiedInput = input;

  if (match) {
    exportedName = match[1];
    // Remove the 'export default ' part but keep the rest of the declaration
    modifiedInput = modifiedInput
      .replace(/export\s+default\s+function/, "function")
      .trim();
  } else {
    match = input.match(defaultExportRegex);
    if (match) {
      exportedName = match[1];
      // Remove the matched line from the input
      modifiedInput = modifiedInput.replace(defaultExportRegex, "").trim();
    }
  }

  return { modifiedInput, exportedName };
};
