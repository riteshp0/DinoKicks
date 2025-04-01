import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

type QuizQuestion = {
  id: number;
  question: string;
  options: {
    id: number;
    text: string;
    productId: number | null;
  }[];
};

type QuizState = {
  currentQuestionIndex: number;
  answers: Record<number, number>;
  result: number | null;
};

const QuizSection = () => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    result: null,
  });

  const { data: quizData, isLoading, error } = useQuery({
    queryKey: ["/api/quizzes/1"],
  });

  const { data: productData, isLoading: isProductLoading } = useQuery({
    queryKey: ["/api/products/" + quizState.result],
    enabled: quizState.result !== null,
  });

  const handleSelectOption = (questionId: number, optionId: number, productId: number | null) => {
    setQuizState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionId,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (!quizData) return;
    
    const questions = quizData.questions;
    const nextIndex = quizState.currentQuestionIndex + 1;
    
    if (nextIndex >= questions.length) {
      // Calculate the most common product ID selected
      const productIdCounts: Record<string, number> = {};
      
      Object.entries(quizState.answers).forEach(([questionId, optionId]) => {
        const question = questions.find(q => q.id === parseInt(questionId));
        if (!question) return;
        
        const option = question.options.find(o => o.id === optionId);
        if (!option || !option.productId) return;
        
        productIdCounts[option.productId] = (productIdCounts[option.productId] || 0) + 1;
      });
      
      // Find the most common product ID
      let resultProductId = null;
      let maxCount = 0;
      
      Object.entries(productIdCounts).forEach(([productId, count]) => {
        if (count > maxCount) {
          maxCount = count;
          resultProductId = parseInt(productId);
        }
      });
      
      // If we have a result, show it
      setQuizState((prev) => ({
        ...prev,
        result: resultProductId,
      }));
    } else {
      // Move to the next question
      setQuizState((prev) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
    }
  };

  const handleResetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      result: null,
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-cover bg-center text-white relative" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1595829227996-c1c1cccb4c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080')" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-[#2D3436]/80 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <Skeleton className="h-10 w-3/4 mx-auto mb-2 bg-gray-700" />
              <Skeleton className="h-6 w-1/2 mx-auto bg-gray-700" />
            </div>
            
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/2 bg-gray-700" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-14 bg-gray-700" />
                <Skeleton className="h-14 bg-gray-700" />
                <Skeleton className="h-14 bg-gray-700" />
                <Skeleton className="h-14 bg-gray-700" />
              </div>
              <div className="mt-6 text-center">
                <Skeleton className="h-10 w-40 mx-auto bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !quizData) {
    return (
      <section className="py-16 bg-cover bg-center text-white relative" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1595829227996-c1c1cccb4c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080')" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-[#2D3436]/80 rounded-xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-2">Quiz Error</h2>
              <p className="text-lg">Sorry, we couldn't load the quiz. Please try again later.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentQuestion = quizState.result === null 
    ? quizData.questions[quizState.currentQuestionIndex] 
    : null;

  const selectedOptionId = currentQuestion
    ? quizState.answers[currentQuestion.id]
    : null;

  return (
    <section className="py-16 bg-cover bg-center text-white relative" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1595829227996-c1c1cccb4c8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxkaW5vc2F1ciUyMGlsbHVzdHJhdGlvbnN8ZW58MHx8fHwxNjk3NTI0MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080')" }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-[#2D3436]/80 rounded-xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="font-['Righteous',_cursive] text-3xl md:text-4xl mb-2">{quizData.quiz.name}</h2>
            <p className="text-lg">{quizData.quiz.description}</p>
          </div>
          
          <AnimatePresence mode="wait">
            {quizState.result === null ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-['Righteous',_cursive] text-xl mb-4">{currentQuestion.question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className={`
                        bg-[#008080]/50 hover:bg-[#008080] transition py-3 px-4 rounded-lg 
                        font-['Righteous',_cursive] flex items-center space-x-2 text-white
                        ${selectedOptionId === option.id ? 'bg-[#008080] border-white' : ''}
                      `}
                      onClick={() => handleSelectOption(currentQuestion.id, option.id, option.productId)}
                    >
                      <span>{option.text}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button
                    className="bg-[#39FF14] text-[#2D3436] font-['Righteous',_cursive] py-2 px-6 rounded-lg hover:bg-[#39FF14]/80 transition"
                    onClick={handleNextQuestion}
                    disabled={!selectedOptionId}
                  >
                    {quizState.currentQuestionIndex < quizData.questions.length - 1
                      ? "NEXT QUESTION"
                      : "SEE RESULT"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {isProductLoading ? (
                  <div className="mb-8">
                    <Skeleton className="h-40 w-40 rounded-full mx-auto mb-4 bg-gray-700" />
                    <Skeleton className="h-8 w-1/2 mx-auto mb-2 bg-gray-700" />
                    <Skeleton className="h-4 w-3/4 mx-auto mb-6 bg-gray-700" />
                    <Skeleton className="h-10 w-40 mx-auto bg-gray-700" />
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <img 
                        src={productData?.imageUrl} 
                        alt={productData?.name}
                        className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-[#FF5714]" 
                      />
                    </div>
                    <h3 className="font-['Righteous',_cursive] text-2xl mb-2">You're a {productData?.name}!</h3>
                    <p className="mb-6">{productData?.description}</p>
                    <Link href={`/product/${productData?.id}`}>
                      <Button className="bg-[#FF5714] hover:bg-[#FF5714]/80 transition font-['Righteous',_cursive] py-3 px-8 rounded-lg">
                        SHOP YOUR MATCH
                      </Button>
                    </Link>
                    <Button
                      variant="link"
                      className="block mx-auto mt-4 text-[#39FF14] hover:text-[#39FF14]/80 transition font-['Righteous',_cursive]"
                      onClick={handleResetQuiz}
                    >
                      TAKE QUIZ AGAIN
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;
