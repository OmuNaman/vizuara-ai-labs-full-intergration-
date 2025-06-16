// vizuara-ai-learning-lab-main/src/pages/LearningModulePage.tsx
import React, { Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext'; 

// Define module components using React.lazy for code splitting
const SelfAttentionModule = lazy(() => import('@/components/modules/self-attention/SelfAttentionModule'));
const NeuralNetworkModule = lazy(() => import('@/components/modules/neural-network/NeuralNetworkModule'));
const MultiHeadAttentionModule = lazy(() => import('@/components/modules/multi-head-attention/MultiHeadAttentionModule'));

const moduleComponents: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
  'self-attention': SelfAttentionModule,
  'neural-network': NeuralNetworkModule,
  'multi-head-attention': MultiHeadAttentionModule,
};

const LearningModulePage = () => {
  const { moduleSlug } = useParams<{ moduleSlug: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme(); 

  if (!moduleSlug || !moduleComponents[moduleSlug]) {
    navigate('/not-found', { replace: true }); 
    return (
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-100 text-black'}`}>
            <p>Module not found. Redirecting...</p>
        </div>
    );
  }

  const ModuleComponent = moduleComponents[moduleSlug];

  return (
    <Suspense 
        fallback={
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-100 text-black'}`}>
                <p className="text-xl animate-pulse">Loading Awesome AI Module...</p>
            </div>
        }
    >
      <ModuleComponent />
    </Suspense>
  );
};

export default LearningModulePage;