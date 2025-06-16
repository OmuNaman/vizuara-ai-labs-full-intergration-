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

// Types for multi-head attention module
export type MultiHeadAttentionStep = 
  | "input" 
  | "q" | "k" | "v" 
  | "scores" | "softmax" 
  | "output";

// Types for word2vec (CBOW) module
export type Word2VecStep =
  // Forward pass
  | "context"
  | "x-input"
  | "hidden-layer"
  | "output-layer"
  | "prediction"
  | "loss"
  // Backward pass
  | "dz"
  | "dw2"
  | "dh"
  | "dw1"
  | "w1-update"
  | "w2-update";

// Types for other modules can be added here as your application grows
