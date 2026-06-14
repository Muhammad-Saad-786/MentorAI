import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "MentorAI",
  },
});

const MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const INTERVIEW_SYSTEM_PROMPT = `You are a technical interviewer at a top tech company. You are conducting a coding interview.

## YOUR ROLE
- Ask the candidate a DSA problem
- Give them time to solve it
- Ask follow-up questions about time/space complexity
- Ask about edge cases
- Provide hints if they're stuck (but don't give the answer)
- At the end, give brief feedback

## INTERVIEW FLOW
1. Introduce yourself briefly
2. Present a coding problem (choose from common DSA problems)
3. Wait for their solution
4. Ask 1-2 follow-up questions
5. Provide feedback

## RULES
- Be professional but friendly
- Don't overwhelm with information
- Give the candidate time to think
- If they ask for hints, give progressive hints (not the solution)
- Time limit: help them stay on track

## PROBLEM TOPICS
Choose from: Arrays, Strings, Linked Lists, Trees, Recursion, Dynamic Programming, Sorting, Searching
Difficulty: Start with Easy/Medium based on what they ask for`;

const problems = [
  {
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Arrays",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]",
  },
  {
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Strings",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    example: "Input: '()[]{}'\nOutput: true",
  },
  {
    title: "Reverse Linked List",
    difficulty: "Easy",
    topic: "Linked Lists",
    description:
      "Given the head of a singly linked list, reverse the list and return the reversed list.",
    example: "Input: 1->2->3->4->5\nOutput: 5->4->3->2->1",
  },
  {
    title: "Maximum Subarray",
    difficulty: "Medium",
    topic: "Arrays",
    description: "Find the contiguous subarray with the largest sum.",
    example: "Input: [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6 (subarray [4,-1,2,1])",
  },
  {
    title: "Binary Tree Level Order",
    difficulty: "Medium",
    topic: "Trees",
    description:
      "Return the level order traversal of a binary tree's nodes values.",
    example: "Input: [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]",
  },
  {
    title: "Climbing Stairs",
    difficulty: "Easy",
    topic: "Dynamic Programming",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?",
    example: "Input: n = 3\nOutput: 3",
  },
  {
    title: "Merge Intervals",
    difficulty: "Medium",
    topic: "Sorting",
    description:
      "Given an array of intervals, merge all overlapping intervals.",
    example:
      "Input: [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]",
  },
  {
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    topic: "Strings",
    description:
      "Find the length of the longest substring without repeating characters.",
    example: "Input: 'abcabcbb'\nOutput: 3",
  },
];

function getRandomProblem() {
  return problems[Math.floor(Math.random() * problems.length)];
}

export async function startInterview(userMessage) {
  const problem = getRandomProblem();

  const messages = [
    {
      role: "system",
      content: INTERVIEW_SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `I'm ready for my coding interview. ${userMessage || "Give me a problem to solve."}`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.8,
    max_tokens: 2000,
  });

  return {
    message: completion.choices[0].message.content,
    problem,
  };
}

export async function continueInterview(history, userMessage) {
  const messages = [
    {
      role: "system",
      content: INTERVIEW_SYSTEM_PROMPT,
    },
    ...history.map((msg) => ({
      role: msg.role === "interviewer" ? "assistant" : "user",
      content: msg.content,
    })),
    {
      role: "user",
      content: userMessage,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.8,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}

export async function getFeedback(history, userSolution) {
  const messages = [
    {
      role: "system",
      content: `You are a technical interviewer. The interview is over. Provide constructive feedback on the candidate's performance. Cover: problem-solving approach, code quality, communication, time/space complexity awareness, and areas to improve. Be encouraging but honest.`,
    },
    ...history.map((msg) => ({
      role: msg.role === "interviewer" ? "assistant" : "user",
      content: msg.content,
    })),
    {
      role: "user",
      content: `The interview is complete. My final solution is:\n${userSolution}\n\nPlease give me feedback.`,
    },
  ];

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages,
    temperature: 0.7,
    max_tokens: 1500,
  });

  return completion.choices[0].message.content;
}
