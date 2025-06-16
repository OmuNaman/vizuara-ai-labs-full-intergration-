// src/components/modules/multi-head-attention/components/workflow/CalculationNode.tsx
import { useState, useEffect, useRef } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatrixInput } from "@/components/MatrixInput";
import { useTheme } from "@/contexts/ThemeContext";
import {
  CheckCircle,
  Calculator,
  Lightbulb,
  Lock,
  Unlock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { HeadColor, HeadNumber } from "../../utils/types";

interface CalculationNodeProps {
  data: {
    label: string;
    formula: string;
    description?: string;
    expectedMatrix: number[][];
    hint: string;
    onComplete?: (nodeId: string) => void;
    disabled?: boolean;
    headNumber?: HeadNumber;
    headColor?: HeadColor;
  };
  id: string;
}

export function CalculationNode({ data, id }: CalculationNodeProps) {
  const { isDark } = useTheme();
  const initialMatrix = () =>
    Array(data.expectedMatrix.length)
      .fill(null)
      .map(() => Array(data.expectedMatrix[0].length).fill(0));

  const [userMatrix, setUserMatrix] = useState<number[][]>(initialMatrix());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errors, setErrors] = useState<boolean[][]>([]);

  useEffect(() => {
    if (!data.disabled) {
      setUserMatrix(initialMatrix());
      setIsCompleted(false);
      setShowHint(false);
      setErrors([]);
    }
  }, [data.disabled, data.expectedMatrix, id]);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudioRef.current = new Audio("/correct.mp3");
    wrongAudioRef.current = new Audio("/wrong.mp3");

    if (correctAudioRef.current) correctAudioRef.current.load();
    if (wrongAudioRef.current) wrongAudioRef.current.load();

    return () => {
      if (correctAudioRef.current) {
        correctAudioRef.current.pause();
        correctAudioRef.current = null;
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.pause();
        wrongAudioRef.current = null;
      }
    };
  }, []);

  const playSound = (isCorrect: boolean) => {
    if (isCorrect && correctAudioRef.current) {
      correctAudioRef.current.play().catch(e => console.error("Error playing sound:", e));
    } else if (!isCorrect && wrongAudioRef.current) {
      wrongAudioRef.current.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  const validateMatrix = (matrixToValidate: number[][]) => {
    if (!matrixToValidate || matrixToValidate.length === 0) return false;
    
    const tolerance = 0.0001;
    const newErrors: boolean[][] = [];
    
    let isValid = true;
    for (let i = 0; i < data.expectedMatrix.length; i++) {
      newErrors[i] = [];
      for (let j = 0; j < data.expectedMatrix[i].length; j++) {
        const error = Math.abs(matrixToValidate[i][j] - data.expectedMatrix[i][j]) > tolerance;
        newErrors[i][j] = error;
        if (error) isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleMatrixChange = (newMatrix: number[][]) => {
    setUserMatrix(newMatrix);
    
    if (!isCompleted) {
      const isValid = validateMatrix(newMatrix);
      
      if (isValid) {
        setIsCompleted(true);
        playSound(true);
        if (data.onComplete) {
          data.onComplete(id);
        }
      }
    }
  };

  const resetMatrix = () => {
    setUserMatrix(initialMatrix());
    setErrors([]);
    setIsCompleted(false);
    setShowHint(false);
  };
  
  const nodeIsEffectivelyReadonly = data.disabled;
  const hasHeadColor = data.headNumber && data.headColor;

  return (
    <Card
      className={`w-[320px] transition-colors duration-300 shadow-xl rounded-lg ${
        hasHeadColor 
          ? `bg-${isDark ? 'slate-800' : 'white'} border-${data.headColor?.border}`
          : isDark 
            ? "bg-slate-800 border-slate-700" 
            : "bg-white border-slate-300"
      }`}
      style={{
        borderColor: hasHeadColor ? data.headColor?.border : undefined,
        borderWidth: hasHeadColor ? '2px' : '1px'
      }}
    >
      <div className="p-4">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h3
              className={`font-semibold text-lg ${
                isDark ? "text-slate-100" : "text-slate-800"
              }`}
            >
              {data.label}
            </h3>
            {data.headNumber && (
              <Badge 
                style={{
                  backgroundColor: data.headColor?.primary,
                  color: 'white'
                }}
              >
                Head {data.headNumber}
              </Badge>
            )}
          </div>
          <p
            className={`text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {data.description}
          </p>
        </div>

        <div
          className={`p-3 mb-4 rounded-md text-center text-sm font-mono ${
            isDark
              ? "bg-slate-700/50 text-slate-300"
              : "bg-slate-100 text-slate-700"
          }`}
        >
          {data.formula}
        </div>        <div className="mb-4">
          <MatrixInput
            matrix={userMatrix}
            onChange={handleMatrixChange}
            errors={errors}
            readonly={nodeIsEffectivelyReadonly || isCompleted}
          />
        </div>

        <div className="flex justify-between items-center">
          {data.disabled ? (
            <div
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                isDark
                  ? "bg-slate-700 text-slate-400"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Locked</span>
            </div>
          ) : isCompleted ? (
            <div
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                isDark
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-700"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed</span>
            </div>
          ) : (
            <div
              className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                isDark
                  ? "bg-blue-900/30 text-blue-400"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              <Unlock className="w-3 h-3" />
              <span>Unlocked</span>
            </div>
          )}

          <div className="flex gap-2">
            {!nodeIsEffectivelyReadonly && !isCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowHint(!showHint);
                }}
                className={`text-xs p-2 h-8 ${
                  isDark
                    ? "border-slate-700 hover:bg-slate-700"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
              >
                <Lightbulb
                  className={`h-3 w-3 mr-1 ${
                    showHint
                      ? isDark
                        ? "text-yellow-300"
                        : "text-yellow-600"
                      : isDark
                      ? "text-slate-400"
                      : "text-slate-600"
                  }`}
                />
                Hint
              </Button>
            )}

            {!nodeIsEffectivelyReadonly && !isCompleted && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetMatrix}
                className={`text-xs p-2 h-8 ${
                  isDark
                    ? "border-slate-700 hover:bg-slate-700"
                    : "border-slate-300 hover:bg-slate-100"
                }`}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`mt-3 p-3 text-xs rounded-md ${
              isDark
                ? "bg-yellow-900/20 text-yellow-200 border border-yellow-900/50"
                : "bg-yellow-50 text-yellow-800 border border-yellow-200"
            }`}
          >
            <p>{data.hint}</p>
          </motion.div>
        )}

        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mt-3 p-3 text-xs rounded-md flex items-center ${
              isDark
                ? "bg-green-900/20 text-green-200 border border-green-900/50"
                : "bg-green-50 text-green-800 border border-green-200"
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <p>Correct! You can now proceed to the next step.</p>
          </motion.div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className={`w-3 h-3 !border-2 rounded-full transition-colors duration-300 ${
          isDark
            ? "!bg-blue-500 !border-slate-800"
            : "!bg-blue-500 !border-white"
        }`}
        style={{
          backgroundColor: hasHeadColor ? data.headColor?.primary : undefined,
          borderColor: isDark ? '#1e293b' : 'white'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className={`w-3 h-3 !border-2 rounded-full transition-colors duration-300 ${
          isDark
            ? "!bg-purple-500 !border-slate-800"
            : "!bg-purple-500 !border-white"
        }`}
        style={{
          backgroundColor: hasHeadColor ? data.headColor?.primary : undefined,
          borderColor: isDark ? '#1e293b' : 'white'
        }}
      />
    </Card>
  );
}
