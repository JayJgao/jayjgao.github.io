import { isValidElement } from "react";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import { MermaidBlock } from "@/components/mdx/MermaidBlock";

function isMermaidCodeBlock(node: ReactNode): node is ReactElement<{ className?: string; children?: ReactNode }> {
  return (
    isValidElement<{ className?: string; children?: ReactNode }>(node) &&
    typeof node.props.className === "string" &&
    node.props.className.includes("language-mermaid")
  );
}

export const mdxComponents = {
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => {
    if (isMermaidCodeBlock(children)) {
      const raw = Array.isArray(children.props.children)
        ? children.props.children.join("")
        : String(children.props.children ?? "");
      const chart = raw.replace(/\n$/, "");
      return <MermaidBlock chart={chart} />;
    }

    return <pre {...props}>{children}</pre>;
  },
};
