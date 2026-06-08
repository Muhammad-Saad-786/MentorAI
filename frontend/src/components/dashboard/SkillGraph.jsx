import { motion } from "framer-motion";

const SKILL_TREE = {
  Variables: { x: 50, y: 5, children: ["Conditionals", "Loops"] },
  Conditionals: { x: 25, y: 22, children: ["Functions"] },
  Loops: { x: 75, y: 22, children: ["Functions", "Arrays"] },
  Functions: { x: 50, y: 40, children: ["Recursion"] },
  Arrays: { x: 75, y: 40, children: ["Sorting", "Searching"] },
  Recursion: { x: 30, y: 58, children: ["Dynamic Programming"] },
  Sorting: { x: 60, y: 58, children: ["Algorithm Analysis"] },
  Searching: { x: 85, y: 58, children: ["Algorithm Analysis"] },
  "Dynamic Programming": { x: 20, y: 76, children: ["System Design"] },
  "Algorithm Analysis": { x: 50, y: 76, children: ["System Design"] },
  "System Design": { x: 70, y: 92, children: [] },
};

function getNodeColor(score) {
  if (score >= 70) return "#2ECC71";
  if (score >= 40) return "#F39C12";
  if (score > 0) return "#E74C3C";
  return "#E8D5C4";
}

function getNodeBg(score) {
  if (score >= 70) return "#E8F8F0";
  if (score >= 40) return "#FFF8E1";
  if (score > 0) return "#FFEBEE";
  return "#F5F2ED";
}

export default function SkillGraph({ topics = [] }) {
  const topicMap = {};
  topics.forEach((t) => {
    topicMap[t.name] = t.score;
  });

  const nodes = Object.entries(SKILL_TREE).map(([name, pos]) => {
    const score = topicMap[name] || 0;
    return { name, x: pos.x, y: pos.y, score, children: pos.children };
  });

  const edges = [];
  nodes.forEach((node) => {
    node.children.forEach((childName) => {
      const child = nodes.find((n) => n.name === childName);
      if (child) {
        edges.push({
          from: node,
          to: child,
        });
      }
    });
  });

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "100%",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      {/* SVG Edges */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {edges.map((edge, i) => (
          <line
            key={i}
            x1={`${edge.from.x}%`}
            y1={`${edge.from.y}%`}
            x2={`${edge.to.x}%`}
            y2={`${edge.to.y}%`}
            stroke="#E8D5C4"
            strokeWidth="1.5"
            strokeDasharray={
              edge.from.score >= 40 && edge.to.score > 0 ? "none" : "4,4"
            }
          />
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          style={{
            position: "absolute",
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            cursor: "pointer",
          }}
          title={`${node.name}: ${node.score}%`}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              backgroundColor: getNodeBg(node.score),
              border: `2.5px solid ${getNodeColor(node.score)}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 3px",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow:
                node.score >= 70 ? "0 0 12px rgba(46,204,113,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                node.score >= 70 ? "0 0 12px rgba(46,204,113,0.3)" : "none";
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: getNodeColor(node.score),
                fontFamily: "'Cabinet Grotesk', sans-serif",
              }}
            >
              {node.score > 0 ? node.score : "?"}
            </span>
          </div>
          <span
            style={{
              fontSize: 9,
              color: "#5C5C6E",
              fontWeight: 600,
              whiteSpace: "nowrap",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {node.name.length > 10 ? node.name.slice(0, 10) + "..." : node.name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
