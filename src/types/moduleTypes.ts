// src/types/moduleTypes.ts

// Types for self-attention module
export type SelfAttentionStep = "input" | "q" | "k" | "v" | "scores" | "softmax" | "output";

// Types for neural network module
export type NeuralNetworkStep = 
  // Forward pass steps
  | "input" 
  | "z1" | "a1" 
  | "z2" | "a2" 
  | "z3" | "a3" 
  | "loss" 
  // Backward pass steps
  | "dz3" | "dw3" | "db3" 
  | "dz2" | "dw2" | "db2" 
  | "dz1" | "dw1" | "db1";

// Types for other modules can be added here as your application grows
