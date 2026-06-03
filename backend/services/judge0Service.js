// No external APIs needed — execution happens in the browser
// This service provides the language config only

const LANGUAGE_CONFIG = {
  javascript: {
    name: "javascript",
    version: "ES2023",
    canExecuteInBrowser: true,
  },
  typescript: {
    name: "typescript",
    version: "5.0",
    canExecuteInBrowser: false,
  },
  python: {
    name: "python",
    version: "3.10",
    canExecuteInBrowser: true,
  },
  java: {
    name: "java",
    version: "17",
    canExecuteInBrowser: false,
  },
  cpp: {
    name: "c++",
    version: "GCC 12",
    canExecuteInBrowser: false,
  },
  go: {
    name: "go",
    version: "1.21",
    canExecuteInBrowser: false,
  },
  rust: {
    name: "rust",
    version: "1.70",
    canExecuteInBrowser: false,
  },
};

function getLanguageConfig(language) {
  return LANGUAGE_CONFIG[language] || null;
}

export { getLanguageConfig, LANGUAGE_CONFIG };
// This service is a placeholder for any future interactions with Judge0 or similar APIs, but currently it only provides static language configuration data.
// Since the code execution happens in the browser, we don't need to interact with Judge0 for running code. Instead, we can use this service to get the necessary language configuration for the frontend to determine which languages can be executed directly in the browser and which require server-side execution.
