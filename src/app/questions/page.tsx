"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Trash2, BookOpenCheck, Info, ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
//import { Progress } from "@/components/ui/progress"
//import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
//import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
//import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface QuestionsData {
  questions: string[]
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: Event) => void
  start: () => void
  stop: () => void
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition
    SpeechRecognition?: new () => SpeechRecognition
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
  resultIndex: number
}

export default function Recorder() {
  const router = useRouter()

  const [isRecording, setIsRecording] = useState(false)
  const [isQuestioning, setIsQuestioning] = useState(false)
  const [finalTranscript, setFinalTranscript] = useState(sessionStorage.getItem("transcript"))
  const [interimTranscript, setInterimTranscript] = useState("")
  const [timeLeft, setTimeLeft] = useState(300)
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1)

  const recognition = useRef<SpeechRecognition | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const [data, setData] = useState<QuestionsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedTranscript = sessionStorage.getItem("transcript")
        if (!savedTranscript) {
          throw new Error("No transcript found")
        }

        const response = await fetch("/api/questions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript: savedTranscript }),
        })

        if (!response.ok) {
          throw new Error("Questions failed")
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }
    const setupSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  
        if (!SpeechRecognition) {
          setError("Speech recognition is not supported in your browser.")
          return
        }
  
        recognition.current = new SpeechRecognition()
        recognition.current.continuous = true
        recognition.current.interimResults = true
        recognition.current.lang = "en-US"
  
        recognition.current.onresult = (event: SpeechRecognitionEvent) => {
          let final = ""
          let interim = ""
  
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript
            } else {
              interim += event.results[i][0].transcript
            }
          }
  
          setFinalTranscript((prev) => prev + final)
          setInterimTranscript(interim)
        }
  
        recognition.current.onerror = (event: Event) => {
          console.error("Speech recognition error:", event)
          setError("Error occurred in speech recognition")
          stopRecording()
        }
      }
  
      setupSpeechRecognition()

    fetchData()
  }, [])
  useEffect(() => {
    if (isQuestioning && timeLeft <= 0) {
      stopRecording()
    }
  }, [timeLeft, isQuestioning])
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])
  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8 flex flex-col items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-muted-foreground">Creating Questions...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8 space-y-8 flex flex-col items-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Failed to load questions"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/recorder")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8 space-y-8 flex flex-col items-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Failed to load questions"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/recorder")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }
  const setupAudioVisualizer = async (stream: MediaStream) => {
    audioContextRef.current = new AudioContext()
    analyserRef.current = audioContextRef.current.createAnalyser()
    const source = audioContextRef.current.createMediaStreamSource(stream)

    source.connect(analyserRef.current)
    analyserRef.current.fftSize = 256
    const bufferLength = analyserRef.current.frequencyBinCount
    dataArrayRef.current = new Uint8Array(bufferLength)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const draw = () => {
      if (!analyserRef.current || !dataArrayRef.current || !ctx || !canvas) return

      analyserRef.current.getByteFrequencyData(dataArrayRef.current)

      ctx.fillStyle = "rgb(241, 245, 249)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5
      let x = 0

      ctx.fillStyle = "rgb(59, 130, 246)"

      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const barHeight = dataArrayRef.current[i] / 2
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
        x += barWidth + 1
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()
  }

  const handleGrading = () => {
    if (finalTranscript) {
      sessionStorage.setItem("transcript", finalTranscript)
    }
    router.push("/grading")
  }

  const startRecording = async () => {
    try {
      resetState()
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setupAudioVisualizer(stream)
      recognition.current?.start()
      startTimer()
      setIsRecording(true)
    } catch {
      setError("Microphone access required")
    }
  }

  const stopRecording = () => {
    recognition.current?.stop()
    setIsRecording(false)
  
    if (timerRef.current) {
      clearInterval(timerRef.current)  // Ensure timer stops
      timerRef.current = null
    }
  
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current) // Clear any existing interval
    setTimeLeft(300) // Reset time
  
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopRecording()  // Stop when time is up
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetState = () => {
    setFinalTranscript(sessionStorage.getItem("transcript"))
    setInterimTranscript("")
    setError("")
    setTimeLeft(300)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }
  const handleBeginQuestioning = async () => {
    try {
      setQuestions(data.questions)
      setIsQuestioning(true)
      
      setCurrentQuestionIndex(0)
      
      stopRecording()
      startTimer()
      startRecording()
      const initialQuestion = `\nTeacher: ${data.questions[0]}\n\nStudent: `
      setFinalTranscript(prev => `${prev}\n${initialQuestion}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate questions')
    } finally {
    }
  }
  const handleNextQuestion = () => {
    if (currentQuestionIndex >= questions.length - 1) {
      stopRecording()
      return
    }

    const nextIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)
    
    setFinalTranscript(prev => `${prev}\nTeacher: ${questions[nextIndex]}\nStudent:`)
  }

  const showQuestionsUI = isQuestioning && questions.length > 0


  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center">IB English IO Grader</CardTitle>
          <CardDescription className="text-center text-lg">
            Record your presentation and receive instant feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>{isQuestioning ? "Question Session Instructions" : "Recording Instructions"}</AlertTitle>
            <AlertDescription>
              {isQuestioning ? 
                "You have 5 minutes to answer all questions. The examiner's questions will appear here. Press 'Next Question' when ready." :
                "Speak clearly into your microphone. You have 10 minutes to complete your presentation. The timer will start when you begin recording."}
            </AlertDescription>
          </Alert>

          <div className="flex justify-center items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-4xl font-mono font-semibold text-primary bg-primary/10 p-4 rounded-lg">
                    {formatTime(timeLeft)}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Time remaining for your presentation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {showQuestionsUI && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-blue-50 p-6 rounded-lg border border-blue-200"
              >
                <h3 className="text-2xl font-semibold text-blue-800 mb-4">Current Question</h3>
                <p className="text-xl text-blue-700">{questions[currentQuestionIndex]}</p>
              </motion.div>
            </AnimatePresence>
          )}

          <Card className="w-full bg-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex justify-between items-center">
                Live Transcript
                <span className="text-sm text-muted-foreground">
                  {Math.ceil((finalTranscript + interimTranscript).split(" ").length)} words
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="prose max-w-none text-primary h-[250px] overflow-y-auto text-lg font-medium whitespace-pre-line">
            {finalTranscript && <div className="mb-2 text-primary">{finalTranscript}</div>}
                {interimTranscript && <div className="text-muted-foreground animate-pulse">{interimTranscript}</div>}
                {!finalTranscript && !interimTranscript && (
                  <div className="text-muted-foreground h-full flex items-center justify-center text-xl">
                    {isRecording ? "Start speaking..." : "Your transcript will appear here"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 items-center">
          <Button
                onClick={isRecording ? stopRecording : handleBeginQuestioning} // NEW
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                disabled={!!error}
                className="w-40"
                >
              {isRecording ? <Square className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
              {isRecording ? "Stop" : "Start"}
            </Button>
                <Button
                onClick={handleNextQuestion}
                variant="default"
                size="lg"
                className="w-48"
                disabled={!isRecording}
                >
                Next Question <ChevronRight className="ml-2 h-5 w-5" />
                </Button>


            <Button variant="outline" size="lg" onClick={resetState} disabled={isRecording} className="w-40">
              <Trash2 className="mr-2 h-5 w-5 text-destructive" />
              Clear
            </Button>

            {!isRecording && finalTranscript && (
              <Button onClick={handleGrading} variant="default" size="lg" className="w-40">
                <BookOpenCheck className="mr-2 h-5 w-5" />
                Grade
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  )
}

