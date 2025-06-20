
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTestQuestions, submitTestAttempt, updateApplicationAfterTest } from '@/lib/api/sales-agent-api';
import { TestQuestion } from '@/types/sales-agent';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface AgentQualificationTestProps {
  applicationId: string;
  onComplete: (passed: boolean) => void;
}

const AgentQualificationTest: React.FC<AgentQualificationTestProps> = ({ applicationId, onComplete }) => {
  const { user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState<{score: number, passed: boolean}>({score: 0, passed: false});
  
  // Ensure React is properly initialized before proceeding
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    
    const loadQuestions = async () => {
      try {
        const data = await getTestQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error loading test questions:', error);
        toast.error('Failed to load test questions');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [isReady]);
  
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const calculateScore = () => {
    let correct = 0;
    
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / questions.length) * 100);
    return {
      score,
      passed: score >= 70 // 70% passing threshold
    };
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      const results = calculateScore();
      setResults(results);
      
      // Submit test attempt
      await submitTestAttempt({
        user_id: user.id,
        score: results.score,
        passed: results.passed,
        answers,
        application_id: applicationId
      });
      
      setTestCompleted(true);
      onComplete(results.passed);
      
    } catch (error: any) {
      console.error('Error submitting test:', error);
      toast.error(`Error submitting test: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Don't render until React is ready
  if (!isReady || loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin w-12 h-12 border-t-4 border-mansablue border-solid rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (testCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            You have completed the sales agent qualification test.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {results.passed ? (
              <CheckCircle className="w-16 h-16 text-green-500" />
            ) : (
              <AlertCircle className="w-16 h-16 text-red-500" />
            )}
            
            <h3 className="text-2xl font-bold">
              {results.passed ? 'Congratulations!' : 'Not Qualified Yet'}
            </h3>
            
            <p className="text-center">
              {results.passed 
                ? 'You have passed the qualification test and your application will be reviewed.'
                : 'You did not pass the qualification test. You can try again later.'}
            </p>
            
            <div className="w-full mt-4">
              <div className="flex justify-between mb-2">
                <span>Your Score:</span>
                <span className="font-bold">{results.score}%</span>
              </div>
              <Progress value={results.score} className="h-3" />
            </div>
            
            <div className="text-sm text-center mt-4">
              {results.passed 
                ? 'Our team will review your application and contact you soon.'
                : 'The minimum passing score is 70%.'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const question = questions[currentQuestion];
  const answered = Object.keys(answers).length;
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Sales Agent Qualification Test</CardTitle>
        <CardDescription>
          Answer the following questions about Mansa Musa Marketplace to qualify as a sales agent.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{answered} of {questions.length} answered</span>
          </div>
          <Progress value={(currentQuestion + 1) / questions.length * 100} className="h-2" />
        </div>
        
        {question && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{question.question}</h3>
              
              <RadioGroup 
                value={answers[question.id] || ''}
                onValueChange={(value) => handleAnswer(question.id, value)}
                className="space-y-3"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="A" id={`q${currentQuestion}-A`} />
                  <Label className="text-base font-normal flex-1" htmlFor={`q${currentQuestion}-A`}>
                    {question.option_a}
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="B" id={`q${currentQuestion}-B`} />
                  <Label className="text-base font-normal flex-1" htmlFor={`q${currentQuestion}-B`}>
                    {question.option_b}
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="C" id={`q${currentQuestion}-C`} />
                  <Label className="text-base font-normal flex-1" htmlFor={`q${currentQuestion}-C`}>
                    {question.option_c}
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="D" id={`q${currentQuestion}-D`} />
                  <Label className="text-base font-normal flex-1" htmlFor={`q${currentQuestion}-D`}>
                    {question.option_d}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div>
          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answered < questions.length}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Test'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[question?.id]}
            >
              Next
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentQualificationTest;
