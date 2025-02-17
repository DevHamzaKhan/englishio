"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Square, Trash2, BookOpenCheck, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [finalTranscript, setFinalTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [timeLeft, setTimeLeft] = useState(600)
  const [error, setError] = useState("")

  const recognition = useRef<SpeechRecognition | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)

  useEffect(() => {
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
  }, [])

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

  const handleGrade = () => {
    sessionStorage.setItem("transcript", finalTranscript)
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
    if (timerRef.current) clearInterval(timerRef.current)
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    if (audioContextRef.current) audioContextRef.current.close()
  }

  const startTimer = () => {
    setTimeLeft(600)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) stopRecording()
        return prev > 0 ? prev - 1 : 0
      })
    }, 1000)
  }

  const resetState = () => {
    setFinalTranscript("")
    setInterimTranscript("")
    setError("")
    setTimeLeft(600)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = (seconds % 60).toString().padStart(2, "0")
    return `${mins}:${secs}`
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">IB English IO Grader</CardTitle>
          <CardDescription className="text-center text-lg">
            Record your presentation and receive instant feedback
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Recording Instructions</AlertTitle>
            <AlertDescription>
              Speak clearly into your microphone. You have 10 minutes to complete your presentation. The timer will
              start when you begin recording.
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

          <canvas ref={canvasRef} className="w-full h-32 bg-muted rounded-lg shadow-inner" width={800} height={128} />

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
              <div className="prose max-w-none text-primary h-[250px] overflow-y-auto text-lg font-medium">
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
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              disabled={!!error}
              className="w-40"
            >
              {isRecording ? <Square className="mr-2 h-5 w-5" /> : <Mic className="mr-2 h-5 w-5" />}
              {isRecording ? "Stop" : "Start"}
            </Button>

            <Button variant="outline" size="lg" onClick={resetState} disabled={isRecording} className="w-40">
              <Trash2 className="mr-2 h-5 w-5 text-destructive" />
              Clear
            </Button>

            {!isRecording && finalTranscript && (
              <Button onClick={handleGrade} variant="default" size="lg" className="w-40">
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

