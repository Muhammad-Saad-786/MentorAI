import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownRenderer({ content, isUser = false }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Style code blocks
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{
                borderRadius: "8px",
                fontSize: "12px",
                margin: "8px 0",
                padding: "12px",
                backgroundColor: isUser ? "rgba(0,0,0,0.2)" : "#1A1A2E",
              }}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              style={{
                backgroundColor: isUser ? "rgba(0,0,0,0.15)" : "#F0EBE3",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "12px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
        // Style paragraphs
        p({ children }) {
          return <p style={{ margin: "4px 0", lineHeight: 1.7 }}>{children}</p>;
        },
        // Style headings
        h1({ children }) {
          return (
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: "12px 0 6px",
                color: isUser ? "#FFFFFF" : "#1A1A2E",
              }}
            >
              {children}
            </h1>
          );
        },
        h2({ children }) {
          return (
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 700,
                margin: "10px 0 4px",
                color: isUser ? "#FFFFFF" : "#1A1A2E",
              }}
            >
              {children}
            </h2>
          );
        },
        h3({ children }) {
          return (
            <h3
              style={{
                fontSize: "14px",
                fontWeight: 600,
                margin: "8px 0 4px",
                color: isUser ? "#FFFFFF" : "#1A1A2E",
              }}
            >
              {children}
            </h3>
          );
        },
        // Style lists
        ul({ children }) {
          return (
            <ul style={{ paddingLeft: "20px", margin: "6px 0" }}>{children}</ul>
          );
        },
        ol({ children }) {
          return (
            <ol style={{ paddingLeft: "20px", margin: "6px 0" }}>{children}</ol>
          );
        },
        li({ children }) {
          return (
            <li style={{ margin: "2px 0", lineHeight: 1.6 }}>{children}</li>
          );
        },
        // Style blockquotes
        blockquote({ children }) {
          return (
            <blockquote
              style={{
                borderLeft: `3px solid ${isUser ? "rgba(255,255,255,0.4)" : "#FF6B35"}`,
                paddingLeft: "12px",
                margin: "8px 0",
                opacity: isUser ? 0.9 : 0.8,
                fontStyle: "italic",
              }}
            >
              {children}
            </blockquote>
          );
        },
        // Style bold/italic
        strong({ children }) {
          return (
            <strong
              style={{ fontWeight: 700, color: isUser ? "#FFFFFF" : "#FF6B35" }}
            >
              {children}
            </strong>
          );
        },
        // Style links
        a({ children, href }) {
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: isUser ? "#FFFFFF" : "#004E64",
                textDecoration: "underline",
                fontWeight: 600,
              }}
            >
              {children}
            </a>
          );
        },
        // Style tables
        table({ children }) {
          return (
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                margin: "8px 0",
                fontSize: "12px",
              }}
            >
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th
              style={{
                border: `1px solid ${isUser ? "rgba(255,255,255,0.3)" : "#E8D5C4"}`,
                padding: "6px 10px",
                backgroundColor: isUser ? "rgba(0,0,0,0.2)" : "#FFF3E8",
                fontWeight: 700,
                textAlign: "left",
              }}
            >
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td
              style={{
                border: `1px solid ${isUser ? "rgba(255,255,255,0.2)" : "#E8D5C4"}`,
                padding: "6px 10px",
              }}
            >
              {children}
            </td>
          );
        },
        // Style horizontal rules
        hr() {
          return (
            <hr
              style={{
                border: "none",
                borderTop: `1px solid ${isUser ? "rgba(255,255,255,0.2)" : "#E8D5C4"}`,
                margin: "12px 0",
              }}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
