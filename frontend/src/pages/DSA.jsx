import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ProgressContext } from "../context/ProgressContext";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import {
  Brain,
  Target,
  Zap,
  ChevronRight,
  Search,
  Code2,
  TrendingUp,
  Filter,
} from "lucide-react";

const PROBLEMS = [
  // Arrays
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    link: "https://leetcode.com/problems/two-sum/",
  },
  {
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topic: "Arrays",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
  },
  {
    title: "Contains Duplicate",
    difficulty: "Easy",
    topic: "Arrays",
    link: "https://leetcode.com/problems/contains-duplicate/",
  },
  {
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topic: "Arrays",
    link: "https://leetcode.com/problems/product-of-array-except-self/",
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Arrays",
    link: "https://leetcode.com/problems/maximum-subarray/",
  },

  // Sorting
  {
    title: "Merge Sorted Array",
    difficulty: "Easy",
    topic: "Sorting",
    link: "https://leetcode.com/problems/merge-sorted-array/",
  },
  {
    title: "Sort Colors",
    difficulty: "Medium",
    topic: "Sorting",
    link: "https://leetcode.com/problems/sort-colors/",
  },
  {
    title: "Kth Largest Element",
    difficulty: "Medium",
    topic: "Sorting",
    link: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
  },

  // Recursion
  {
    title: "Fibonacci Number",
    difficulty: "Easy",
    topic: "Recursion",
    link: "https://leetcode.com/problems/fibonacci-number/",
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Recursion",
    link: "https://leetcode.com/problems/climbing-stairs/",
  },
  {
    title: "Generate Parentheses",
    difficulty: "Medium",
    topic: "Recursion",
    link: "https://leetcode.com/problems/generate-parentheses/",
  },

  // Dynamic Programming
  {
    title: "House Robber",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/house-robber/",
  },
  {
    title: "Coin Change",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/coin-change/",
  },
  {
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/longest-increasing-subsequence/",
  },
  {
    title: "Word Break",
    difficulty: "Medium",
    topic: "Dynamic Programming",
    link: "https://leetcode.com/problems/word-break/",
  },

  // Functions
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Functions",
    link: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    title: "Implement Queue using Stacks",
    difficulty: "Easy",
    topic: "Functions",
    link: "https://leetcode.com/problems/implement-queue-using-stacks/",
  },

  // Conditionals & Loops
  {
    title: "Fizz Buzz",
    difficulty: "Easy",
    topic: "Conditionals",
    link: "https://leetcode.com/problems/fizz-buzz/",
  },
  {
    title: "Roman to Integer",
    difficulty: "Easy",
    topic: "Loops",
    link: "https://leetcode.com/problems/roman-to-integer/",
  },
  {
    title: "Valid Palindrome",
    difficulty: "Easy",
    topic: "Loops",
    link: "https://leetcode.com/problems/valid-palindrome/",
  },
];

const TOPICS = [
  "All",
  "Arrays",
  "Sorting",
  "Recursion",
  "Dynamic Programming",
  "Functions",
  "Conditionals",
  "Loops",
];

export default function DSA() {
  const { progress, getWeakTopics, getRecommendations } =
    useContext(ProgressContext);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const weakTopics = getWeakTopics();
  const recommendations = getRecommendations();
  const weakTopicNames = weakTopics.map((t) => t.name);

  // Filter problems
  const filteredProblems = PROBLEMS.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesTopic = selectedTopic === "All" || p.topic === selectedTopic;
    const matchesDifficulty =
      selectedDifficulty === "All" || p.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  // Prioritize: weak topics first, then recommendations, then rest
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    const aWeak = weakTopicNames.includes(a.topic);
    const bWeak = weakTopicNames.includes(b.topic);
    if (aWeak && !bWeak) return -1;
    if (!aWeak && bWeak) return 1;
    return 0;
  });

  const difficultyVariant = (d) =>
    d === "Easy" ? "success" : d === "Medium" ? "warning" : "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ paddingBottom: 80 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2
          style={{
            fontSize: "clamp(20px, 3vw, 28px)",
            fontWeight: 800,
            color: "#1A1A2E",
            margin: "0 0 4px 0",
            fontFamily: "'Cabinet Grotesk', sans-serif",
          }}
        >
          DSA Practice
        </h2>
        <p style={{ fontSize: 14, color: "#5C5C6E", margin: 0 }}>
          Master data structures and algorithms with smart problem
          recommendations
        </p>
      </div>

      {/* Recommended Topics Banner */}
      {(weakTopics.length > 0 || recommendations.length > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {weakTopics.length > 0 && (
            <Card padding="20px" style={{ borderColor: "#F39C12" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {weakTopics.map((t) => (
                  <Badge key={t.name} variant="warning">
                    {t.name} ({t.score}%)
                  </Badge>
                ))}
              </div>
            </Card>
          )}
          {recommendations.length > 0 && (
            <Card padding="20px" style={{ borderColor: "#2ECC71" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <TrendingUp size={20} color="#2ECC71" />
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1A1A2E",
                    margin: 0,
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                  }}
                >
                  Recommended Topics
                </h3>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {recommendations.map((r) => (
                  <Badge key={r.topic} variant="success">
                    {r.topic}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 250px", maxWidth: 350 }}>
          <Search
            size={16}
            color="#8B8B9E"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems..."
            style={{
              width: "100%",
              padding: "10px 14px 10px 36px",
              borderRadius: 10,
              border: "1px solid #E8D5C4",
              backgroundColor: "#FFFFFF",
              fontSize: 13,
              color: "#1A1A2E",
              outline: "none",
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#FF6B35")}
            onBlur={(e) => (e.target.style.borderColor = "#E8D5C4")}
          />
        </div>

        {/* Topic Filter */}
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #E8D5C4",
            backgroundColor: "#FFFBF5",
            fontSize: 13,
            fontWeight: 600,
            color: "#1A1A2E",
            cursor: "pointer",
            outline: "none",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #E8D5C4",
            backgroundColor: "#FFFBF5",
            fontSize: 13,
            fontWeight: 600,
            color: "#1A1A2E",
            cursor: "pointer",
            outline: "none",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <option value="All">All Levels</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      {/* Problem List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sortedProblems.length > 0 ? (
          sortedProblems.map((problem, index) => {
            const isWeak = weakTopicNames.includes(problem.topic);
            return (
              <motion.a
                key={problem.title}
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 18px",
                  borderRadius: 12,
                  background: isWeak ? "#FFF8E1" : "#FFFFFF",
                  border: isWeak ? "1px solid #F39C12" : "1px solid #E8D5C4",
                  textDecoration: "none",
                  cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#FF6B35";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isWeak
                    ? "#F39C12"
                    : "#E8D5C4";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: isWeak ? "#FFF3CD" : "#FFF3E8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Code2 size={18} color={isWeak ? "#F39C12" : "#FF6B35"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#1A1A2E",
                        margin: 0,
                      }}
                    >
                      {problem.title}
                    </p>
                    {isWeak && (
                      <span
                        style={{
                          fontSize: 10,
                          background: "#F39C12",
                          color: "#FFFFFF",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontWeight: 700,
                        }}
                      >
                        NEEDS WORK
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8B8B9E",
                      margin: "2px 0 0 0",
                    }}
                  >
                    {problem.topic}
                  </p>
                </div>
                <Badge variant={difficultyVariant(problem.difficulty)}>
                  {problem.difficulty}
                </Badge>
                <ChevronRight size={16} color="#8B8B9E" />
              </motion.a>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: 60, color: "#8B8B9E" }}>
            <Brain size={48} color="#E8D5C4" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>No problems found</p>
            <p style={{ fontSize: 13 }}>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
