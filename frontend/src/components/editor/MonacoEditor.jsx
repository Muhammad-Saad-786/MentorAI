import { useContext } from "react";
import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressContext } from "../../context/ProgressContext";
import { useAuth } from "../../hooks/useAuth";
import { compilerApi } from "../../services/compilerApi";

import { Search, Sparkles } from "lucide-react";

import {
  Play,
  Copy,
  Download,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  Clock,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const defaultCode = {
  javascript: `// Welcome to MentorAI Code Editor! 🚀\n// Try writing some JavaScript\n\nfunction greet(name) {\n  return \`Hello, \${name}! Welcome to coding.\`;\n}\n\nconsole.log(greet("Developer"));`,
  python: `# Welcome to MentorAI Code Editor! 🚀\n# Try writing some Python\n\ndef greet(name):\n    return f"Hello, {name}! Welcome to coding."\n\nprint(greet("Developer"))`,
  typescript: `// TypeScript requires compilation.\n// JavaScript executes directly in browser.\n\nconst message: string = "Hello from TypeScript!";\nconsole.log(message);`,
  java: `// Java runs on the server.\n// Write your Java code here.\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}`,
  cpp: `// C++ runs on the server.\n// Write your C++ code here.\n\n#include <iostream>\n\nint main() {\n  std::cout << "Hello from C++!" << std::endl;\n  return 0;\n}`,
  go: `// Go runs on the server.\n// Write your Go code here.\n\npackage main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello from Go!")\n}`,
  rust: `// Rust runs on the server.\n// Write your Rust code here.\n\nfn main() {\n  println!("Hello from Rust!");\n}`,
};

// Browser-based JavaScript execution
function executeJavaScript(code) {
  const startTime = performance.now();
  let output = "";
  let error = null;

  // Override console.log to capture output
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const logs = [];

  console.log = (...args) => {
    logs.push(
      args
        .map((arg) => {
          if (typeof arg === "object") {
            try {
              return JSON.stringify(arg, null, 2);
            } catch {
              return String(arg);
            }
          }
          return String(arg);
        })
        .join(" "),
    );
    originalLog(...args);
  };

  console.error = (...args) => {
    logs.push("[Error] " + args.map(String).join(" "));
    originalError(...args);
  };

  console.warn = (...args) => {
    logs.push("[Warning] " + args.map(String).join(" "));
    originalWarn(...args);
  };

  try {
    // Use Function constructor for safer execution
    const func = new Function(code);
    func();
    output = logs.join("\n");
  } catch (e) {
    error = e.message;
    output = logs.join("\n");
  } finally {
    // Restore console
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }

  const endTime = performance.now();
  const executionTime = ((endTime - startTime) / 1000).toFixed(4);

  return {
    output: error
      ? `Error: ${error}\n\n${output ? "Output before error:\n" + output : ""}`
      : output || "Code executed (no console output)",
    error,
    time: executionTime,
    status: error ? "error" : "success",
  };
}

// Pyodide instance (lazy loaded)
let pyodideInstance = null;

async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;

  try {
    const pyodide = await import("pyodide");
    pyodideInstance = await pyodide.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });
    return pyodideInstance;
  } catch (error) {
    console.error("Failed to load Pyodide:", error);
    throw new Error(
      "Python execution is not available. Please try JavaScript instead.",
    );
  }
}

// Browser-based Python execution via Pyodide
async function executePython(code) {
  const startTime = performance.now();

  try {
    const pyodide = await loadPyodide();

    // Capture stdout
    pyodide.setStdout({
      batched: (text) => {
        pythonOutput += text + "\n";
      },
    });

    let pythonOutput = "";

    // Run the code
    await pyodide.runPythonAsync(code);

    const endTime = performance.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(4);

    return {
      output: pythonOutput || "Code executed (no output)",
      error: null,
      time: executionTime,
      status: "success",
    };
  } catch (error) {
    const endTime = performance.now();
    const executionTime = ((endTime - startTime) / 1000).toFixed(4);

    return {
      output: `Error: ${error.message}`,
      error: error.message,
      time: executionTime,
      status: "error",
    };
  }
}

export default function MonacoEditor() {
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [outputVisible, setOutputVisible] = useState(true);
  const [execResult, setExecResult] = useState(null);
  const editorRef = useRef(null);
  const codeRef = useRef(defaultCode.javascript);
  const { trackExecution } = useContext(ProgressContext);
  const [isReviewing, setIsReviewing] = useState(false);

  const { user } = useAuth();

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    codeRef.current = defaultCode[newLang];
    if (editorRef.current) {
      editorRef.current.setValue(defaultCode[newLang]);
    }
    setOutput("");
    setExecResult(null);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutputVisible(true);

    const currentCode = editorRef.current
      ? editorRef.current.getValue()
      : codeRef.current;

    try {
      if (language === "javascript") {
        const result = executeJavaScript(currentCode);
        setOutput(result.output);
        setExecResult({
          status: result.status,
          time: result.time,
          memory: null,
          error: result.error,
        });

        // Track progress after successful execution
        if (result.status === "success") {
          trackExecution(currentCode, language, "solved").catch(() => {});
        } else {
          trackExecution(currentCode, language, "attempted").catch(() => {});
        }
      } else if (language === "python") {
        toast.loading("Loading Python engine...", { id: "python-load" });
        const result = await executePython(currentCode);
        toast.dismiss("python-load");
        setOutput(result.output);
        setExecResult({
          status: result.status,
          time: result.time,
          memory: null,
          error: result.error,
        });

        // Track Python execution
        trackExecution(
          currentCode,
          language,
          result.status === "success" ? "solved" : "attempted",
        ).catch(() => {});
      } else {
        // For other languages — show info message
        setOutput(
          `${language} execution is not available in the browser yet.\n\nTry switching to JavaScript for live code execution.`,
        );
        setExecResult({
          status: "info",
          time: null,
          memory: null,
          error: null,
        });

        trackExecution(currentCode, language, "attempted").catch(() => {});
      }
    } catch (error) {
      setOutput(`Failed to execute code: ${error.message}`);
      setExecResult({
        status: "error",
        time: null,
        memory: null,
        error: error.message,
      });

      // Track failed execution
      trackExecution(currentCode, language, "failed").catch(() => {});
    } finally {
      setIsRunning(false);
    }
  };
  const handleReviewCode = async () => {
    const currentCode = editorRef.current
      ? editorRef.current.getValue()
      : codeRef.current;

    if (!currentCode.trim()) {
      toast.error("No code to review");
      return;
    }

    setIsReviewing(true);
    setOutputVisible(true);
    setOutput("");
    setExecResult({ status: "info", time: null, memory: null, error: null });

    try {
      const result = await compilerApi.reviewCode(currentCode, language);
      setOutput(result.review);
      setExecResult({
        status: "success",
        time: null,
        memory: null,
        error: null,
      });
      toast.success("Code review complete!");
    } catch (error) {
      setOutput("Failed to get code review. Please try again.");
      setExecResult({
        status: "error",
        time: null,
        memory: null,
        error: error.message,
      });
      toast.error("Code review failed");
    } finally {
      setIsReviewing(false);
    }
  };

  const handleClearOutput = () => {
    setOutput("");
    setExecResult(null);
  };

  const handleCopyCode = () => {
    const currentCode = editorRef.current
      ? editorRef.current.getValue()
      : codeRef.current;
    navigator.clipboard.writeText(currentCode);
    toast.success("Code copied!");
  };

  const handleDownloadCode = () => {
    const currentCode = editorRef.current
      ? editorRef.current.getValue()
      : codeRef.current;
    const extensions = {
      javascript: "js",
      typescript: "ts",
      python: "py",
      java: "java",
      cpp: "cpp",
      go: "go",
      rust: "rs",
    };
    const blob = new Blob([currentCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extensions[language] || "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="editor-container"
      >
        {/* Toolbar */}
        <div className="editor-toolbar">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="editor-lang-select"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="editor-toolbar-actions">
            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className="editor-btn editor-btn-run"
              style={{
                opacity: isRunning ? 0.7 : 1,
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              {isRunning ? (
                <RefreshCw size={16} className="editor-spin" />
              ) : (
                <Play size={16} />
              )}
              <span className="editor-btn-text">
                {language === "python" && isRunning ? "Loading..." : "Run Code"}
              </span>
            </button>

            <button
              onClick={handleReviewCode}
              disabled={isReviewing}
              className="editor-btn editor-btn-review"
              style={{
                opacity: isReviewing ? 0.7 : 1,
                cursor: isReviewing ? "not-allowed" : "pointer",
              }}
            >
              {isReviewing ? (
                <RefreshCw size={16} className="editor-spin" />
              ) : (
                <Sparkles size={16} />
              )}
              <span className="editor-btn-text">Review Code</span>
            </button>
            <button
              onClick={handleCopyCode}
              className="editor-btn editor-btn-secondary"
            >
              <Copy size={16} />
              <span className="editor-btn-text">Copy</span>
            </button>
            <button
              onClick={handleDownloadCode}
              className="editor-btn editor-btn-secondary"
            >
              <Download size={16} />
              <span className="editor-btn-text">Download</span>
            </button>
            <button
              onClick={() => setOutputVisible(!outputVisible)}
              className="editor-btn editor-btn-secondary"
            >
              {outputVisible ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
              <span className="editor-btn-text">Output</span>
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="editor-main">
          <div className="editor-panel">
            <Editor
              height="100%"
              language={language}
              defaultValue={defaultCode.javascript}
              onMount={handleEditorDidMount}
              theme="light"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                lineNumbers: "on",
                renderLineHighlight: "line",
                lineHeight: 22,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                smoothScrolling: true,
                bracketPairColorization: { enabled: true },
                autoClosingBrackets: "always",
                formatOnPaste: true,
                tabSize: 2,
                glyphMargin: false,
                folding: true,
                automaticLayout: true,
              }}
              loading={<div className="editor-loading">Loading editor...</div>}
            />
          </div>

          {/* Output Panel */}
          <AnimatePresence>
            {output && outputVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", maxHeight: "300px", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="editor-output"
              >
                <div className="editor-output-header">
                  <div className="editor-output-header-left">
                    <Terminal size={14} color="#8B8B9E" />
                    <span className="editor-output-label">Output</span>
                    {execResult && (
                      <span
                        className={`editor-output-status ${execResult.status}`}
                      >
                        {execResult.status === "success" ? (
                          <>
                            <CheckCircle2 size={12} /> Success
                          </>
                        ) : execResult.status === "info" ? (
                          <>
                            <Info size={12} /> Info
                          </>
                        ) : (
                          <>
                            <AlertCircle size={12} /> Error
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="editor-output-header-right">
                    {execResult?.time && (
                      <span className="editor-output-stat">
                        <Clock size={12} /> {execResult.time}s
                      </span>
                    )}
                    <span className="editor-output-lang">{language}</span>
                    <button
                      onClick={handleClearOutput}
                      className="editor-output-clear"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div className="editor-output-content">
                  <pre
                    className={`editor-output-pre ${execResult?.status === "error" ? "error" : ""}`}
                  >
                    {output}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style>{`
        .editor-container { height: calc(100vh - 100px); display: flex; flex-direction: column; }
        .editor-toolbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px; background: #FFFFFF; border: 1px solid #E8D5C4;
          border-radius: 16px 16px 0 0; border-bottom: 1px solid #E8D5C4;
          flex-shrink: 0; flex-wrap: wrap; gap: 10px;
        }
        .editor-lang-select {
          background: #FFFBF5; border: 1px solid #E8D5C4; border-radius: 8px;
          padding: 8px 12px; font-size: 13px; font-weight: 600; color: #1A1A2E;
          cursor: pointer; outline: none; font-family: 'Inter', sans-serif;
        }
        .editor-toolbar-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
        .editor-btn {
          display: flex; align-items: center; gap: 8px; border: none;
          border-radius: 10px; padding: 8px 16px; font-size: 13px;
          font-weight: 600; font-family: 'Inter', sans-serif; white-space: nowrap;
          transition: background-color 0.2s;
        }
        .editor-btn-run { background: #2ECC71; color: #FFFFFF; }
        .editor-btn-run:hover:not(:disabled) { background: #27AE60; }
        .editor-btn-secondary {
          background: #FFFFFF; color: #5C5C6E; border: 1px solid #E8D5C4;
          cursor: pointer; font-weight: 500;
        }
        .editor-btn-secondary:hover { background: #FFFBF5; }
        .editor-spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .editor-main { flex: 1; display: flex; flex-direction: column; min-height: 0; }
        .editor-panel { flex: 1; min-height: 0; background: #FAF8F5; border: 1px solid #E8D5C4; border-top: none; overflow: hidden; }
        .editor-loading {
          height: 100%; display: flex; align-items: center; justify-content: center;
          background: #FAF8F5; color: #8B8B9E; font-size: 14px; font-family: 'Inter', sans-serif;
        }

        .editor-output {
          flex-shrink: 0; background: #1A1A2E; border: 1px solid #3A3A4E;
          border-top: 2px solid #FF6B35; border-radius: 0 0 16px 16px;
          overflow: hidden; display: flex; flex-direction: column;
        }
        .editor-output-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 16px; border-bottom: 1px solid #2C2C3A; flex-shrink: 0;
          flex-wrap: wrap; gap: 8px;
        }
        .editor-output-header-left { display: flex; align-items: center; gap: 8px; }
        .editor-output-header-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .editor-output-label {
          font-size: 11px; font-weight: 600; color: #8B8B9E;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .editor-output-status {
          font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px;
          display: flex; align-items: center; gap: 4px;
        }
        .editor-output-status.success { background: #1a3a2a; color: #2ECC71; }
        .editor-output-status.error { background: #3a1a1a; color: #E74C3C; }
        .editor-output-status.info { background: #1a2a3a; color: #3498DB; }
        .editor-output-stat {
          font-size: 10px; color: #8B8B9E; display: flex; align-items: center; gap: 4px;
          background: #2C2C3A; padding: 3px 8px; border-radius: 4px;
        }
        .editor-output-lang {
          font-size: 10px; color: #5C5C6E; background: #2C2C3A;
          padding: 3px 8px; border-radius: 4px; text-transform: capitalize;
        }
        .editor-output-clear {
          background: none; border: none; color: #8B8B9E; cursor: pointer;
          font-size: 12px; font-family: 'Inter', sans-serif; padding: 4px 8px;
          border-radius: 4px; transition: color 0.2s;
        }
        .editor-output-clear:hover { color: #E74C3C; }
        .editor-output-content { flex: 1; overflow: auto; padding: 16px; }
        .editor-output-pre {
          font-family: 'JetBrains Mono', monospace; font-size: 13px;
          color: #2ECC71; margin: 0; white-space: pre-wrap;
          word-break: break-word; line-height: 1.7;
        }
        .editor-output-pre.error { color: #E74C3C; }
        .editor-btn-review { background: #FF6B35; color: #FFFFFF; }
        .editor-btn-review:hover:not(:disabled) { background: #E55A2B; }
        @media (max-width: 1023px) {
          .editor-container { height: calc(100vh - 120px); }
          .editor-toolbar { padding: 10px 12px; border-radius: 14px 14px 0 0; }
          .editor-btn { padding: 8px 12px; font-size: 12px; }
        }
        @media (max-width: 767px) {
          .editor-container { height: calc(100vh - 140px); padding-bottom: 70px; }
          .editor-toolbar { padding: 8px 10px; gap: 8px; border-radius: 12px 12px 0 0; }
          .editor-lang-select { font-size: 12px; padding: 6px 10px; width: 100%; }
          .editor-toolbar-actions { width: 100%; justify-content: space-between; gap: 6px; }
          .editor-btn { padding: 8px 10px; font-size: 12px; gap: 5px; }
          .editor-btn-text { display: none; }
        }
      `}</style>
    </>
  );
}
