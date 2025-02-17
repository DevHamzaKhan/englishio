// src/components/audio-recorder.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Square, Trash2, BookOpenCheck } from 'lucide-react';

declare global {
    interface Window {
      webkitSpeechRecognition?: typeof SpeechRecognition;
    }

    let SpeechRecognition: {
      prototype: typeof SpeechRecognition;
      new (): typeof SpeechRecognition;
    };
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}


export default function AudioRecorder() {
    const router = useRouter();
    
    const [isRecording, setIsRecording] = useState(false);
    const [finalTranscript, setFinalTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [timeLeft, setTimeLeft] = useState(600);
    const [error, setError] = useState('');
  
    const recognition = useRef<SpeechRecognition | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
  
    useEffect(() => {
      const setupSpeechRecognition = () => {
        // Fix TypeScript error by asserting window as unknown first
        const SpeechRecognition =
          (window as unknown as { SpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
          window.webkitSpeechRecognition;

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event: SpeechRecognitionEvent) => {
        let final = '';
        let interim = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        setFinalTranscript(prev => prev + final);
        setInterimTranscript(interim);
      };

      recognition.current.onerror = (event: Event) => {
        console.error('Speech recognition error:', event);
        setError('Error occurred in speech recognition');
        stopRecording();
      };
    };

    setupSpeechRecognition();
  }, []);

  const setupAudioVisualizer = async (stream: MediaStream) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx || !canvas) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      ctx.fillStyle = 'rgb(241, 245, 249)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
      let x = 0;

      ctx.fillStyle = 'rgb(59, 130, 246)';

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = dataArrayRef.current[i] / 2;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };
  const handleGrade = () => {
    sessionStorage.setItem('transcript', finalTranscript);
    router.push('/grading');
};
  const startRecording = async () => {
    try {
      resetState();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setupAudioVisualizer(stream);
      recognition.current?.start();
      startTimer();
      setIsRecording(true);
    } catch {
      setError('Microphone access required');
    }
  };

  const stopRecording = () => {
    recognition.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const startTimer = () => {
    setTimeLeft(600);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) stopRecording();
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);
  };

  const resetState = () => {
    setFinalTranscript('');
    setInterimTranscript('');
    setError('');
    setTimeLeft(600);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold text-primary">Live Speech Grader</h1>

        <div className="text-4xl font-mono font-semibold text-primary">
          {formatTime(timeLeft)}
        </div>

        <canvas 
          ref={canvasRef} 
          className="w-full h-32 bg-muted rounded-lg"
          width={800}
          height={128}
        />

        <Card className="w-full p-6 bg-background space-y-4 min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Transcript</h2>
            <span className="text-sm text-muted-foreground">
              {Math.ceil((finalTranscript + interimTranscript).split(' ').length)} min read
            </span>
          </div>
          
          <div className="prose max-w-none text-primary h-[250px] overflow-y-auto">
            {finalTranscript && (
              <div className="mb-2 text-primary">
                {finalTranscript}
              </div>
            )}
            {interimTranscript && (
              <div className="text-muted-foreground animate-pulse">
                {interimTranscript}
              </div>
            )}
            {!finalTranscript && !interimTranscript && (
              <div className="text-muted-foreground h-full flex items-center justify-center">
                {isRecording ? "Start speaking..." : "No transcript yet"}
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-4 items-center">
                    <Button
                        onClick={isRecording ? stopRecording : startRecording}
                        variant={isRecording ? 'destructive' : 'default'}
                        size="lg"
                        disabled={!!error}
                    >
                        {isRecording ? (
                            <Square className="mr-2 h-4 w-4" />
                        ) : (
                            <Mic className="mr-2 h-4 w-4" />
                        )}
                        {isRecording ? 'Stop Recording' : 'Start Recording'}
                    </Button>
                    
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={resetState}
                        disabled={isRecording}
                    >
                        <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                        Clear
                    </Button>

                    {!isRecording && finalTranscript && (
                        <Button
                            onClick={handleGrade}
                            variant="default"
                            size="lg"
                        >
                            <BookOpenCheck className="mr-2 h-4 w-4" />
                            Grade
                        </Button>
                    )}
                </div>

        {error && (
          <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
