"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface GradingData {
  totalScore: number
  percentage: number
  overview: string
  strengths: string[]
  improvements: string[]
  criterionA: { title: string; score: number; feedback: string }
  criterionB: { title: string; score: number; feedback: string }
  criterionC: { title: string; score: number; feedback: string }
  criterionD: { title: string; score: number; feedback: string }
}

const criteriaDescriptions = [
  {
    title: "Knowledge, Understanding and Interpretation",
    description:
      "Evaluates the candidate's knowledge and understanding of the extracts and texts, and their ability to draw conclusions related to the global issue.",
  },
  {
    title: "Analysis and Evaluation",
    description:
      "Assesses how well the candidate analyzes and evaluates the ways in which authorial choices present the global issue.",
  },
  {
    title: "Focus and Organization",
    description:
      "Evaluates the structure, balance, and focus of the oral presentation, as well as the cohesive connection of ideas.",
  },
  {
    title: "Language",
    description:
      "Assesses the clarity, accuracy, and effectiveness of language use, including vocabulary, syntax, and style.",
  },
]

const scoreRanges = ["0", "1-2", "3-4", "5-6", "7-8", "9-10"]

const rubricContent = [
  [
    "The work does not reach a standard described by the descriptors below.",
    "There is little knowledge and understanding of the extracts and the works/texts in relation to the global issue. References to the extracts and to the works/texts are infrequent or are rarely appropriate.",
    "There is some knowledge and understanding of the extracts and the works/texts in relation to the global issue. References to the extracts and to the works/texts are at times appropriate.",
    "There is satisfactory knowledge and understanding of the extracts and the works/texts and an interpretation of their implications in relation to the global issue. References to the extracts and to the works/texts are generally relevant and mostly support the candidate's ideas.",
    "There is good knowledge and understanding of the extracts and the works/texts and a sustained interpretation of their implications in relation to the global issue. References to the extracts and to the works/texts are relevant and support the candidate's ideas.",
    "There is excellent knowledge and understanding of the extracts and of the works/texts and a persuasive interpretation of their implications in relation to the global issue. References to the extracts and to the works/texts are well chosen and effectively support the candidate's ideas.",
  ],
  [
    "The work does not reach a standard described by the descriptors below.",
    "There is little analysis or evaluation of the ways in which authorial choices present the global issue. References to the extracts and to the works/texts are infrequent or are rarely appropriate.",
    "There is some analysis or evaluation of the ways in which authorial choices present the global issue. References to the extracts and to the works/texts are at times appropriate.",
    "There is satisfactory analysis and evaluation of the ways in which authorial choices present the global issue. References to the extracts and to the works/texts are generally relevant and mostly support the candidate's ideas.",
    "There is good analysis and evaluation of the ways in which authorial choices present the global issue. References to the extracts and to the works/texts are relevant and support the candidate's ideas.",
    "There is excellent analysis and evaluation of the ways in which authorial choices present the global issue. References to the extracts and to the works/texts are well chosen and effectively support the candidate's ideas.",
  ],
  [
    "The work does not reach a standard described by the descriptors below.",
    "The oral rarely focuses on the task. There are few connections between ideas.",
    "The oral only sometimes focuses on the task, and treatment of the extracts, and of the works/texts may be unbalanced. There are some connections between ideas, but these are not always coherent.",
    "The oral maintains a focus on the task, despite some lapses; treatment of the extracts and works/texts is mostly balanced. The development of ideas is mostly logical; ideas are generally connected in a cohesive manner.",
    "The oral maintains a mostly clear and sustained focus on the task; treatment of the extracts and works/texts is balanced. The development of ideas is logical; ideas are cohesively connected in an effective manner.",
    "The oral maintains a clear and sustained focus on the task; treatment of the extracts and works/texts is well balanced. The development of ideas is logical and convincing; ideas are connected in a cogent manner.",
  ],
  [
    "The work does not reach a standard described by the descriptors below.",
    "The language is rarely clear or accurate; errors often hinder communication. Vocabulary and syntax are imprecise and frequently inaccurate. Elements of style (for example, register, tone and rhetorical devices) are inappropriate to the task and detract from the oral.",
    "The language is generally clear; errors sometimes hinder communication. Vocabulary and syntax are often imprecise with inaccuracies. Elements of style (for example, register, tone and rhetorical devices) are often inappropriate to the task and detract from the oral.",
    "The language is clear; errors do not hinder communication. Vocabulary and syntax are appropriate to the task but simple and repetitive. Elements of style (for example, register, tone and rhetorical devices) are appropriate to the task and neither enhance nor detract from the oral.",
    "The language is clear and accurate; occasional errors do not hinder communication. Vocabulary and syntax are appropriate and varied. Elements of style (for example, register, tone and rhetorical devices) are appropriate to the task and somewhat enhance the oral.",
    "The language is clear, accurate and varied; occasional errors do not hinder communication. Vocabulary and syntax are varied and create effect. Elements of style (for example, register, tone and rhetorical devices) are appropriate to the task and enhance the oral.",
  ],
]

export default function ReportPage() {
  const router = useRouter()
  const [data, setData] = useState<GradingData | null>(null)
  const [transcript, setTranscript] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedTranscript = sessionStorage.getItem("transcript")
        if (!savedTranscript) {
          throw new Error("No transcript found")
        }
        setTranscript(savedTranscript)

        const response = await fetch("/api/grade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcript: savedTranscript }),
        })

        if (!response.ok) {
          throw new Error("Grading failed")
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8 flex flex-col items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-lg text-muted-foreground">Analyzing transcript...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8 space-y-8 flex flex-col items-center">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Failed to load grading data"}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push("/recorder")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  const getScoreRange = (score: number) => {
    if (score === 0) return 1
    if (score <= 2) return 2
    if (score <= 4) return 3
    if (score <= 6) return 4
    if (score <= 8) return 5
    return 6
  }

  return (
    <Card className="container mx-auto my-8 p-8">
      <CardHeader className="text-center mb-8">
        <CardTitle className="text-4xl font-bold">IB English IO Grader</CardTitle>
        <CardDescription className="text-xl">Individual Oral Assessment Report</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Overall Performance</CardTitle>
            <CardDescription>
              Total Score: {data.totalScore}/40 ({data.percentage}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={data.percentage} className="mb-4" />
            <p className="text-sm text-muted-foreground">{data.overview}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-orange-500">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="criteria" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="criteria">Assessment Criteria</TabsTrigger>
            <TabsTrigger value="transcript">Presentation Transcript</TabsTrigger>
            <TabsTrigger value="rubric">Full Rubric</TabsTrigger>
          </TabsList>

          <TabsContent value="criteria">
            {["A", "B", "C", "D"].map((criterion, index) => (
              <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle>
                    Criterion {criterion}: {data[`criterion${criterion as "A" | "B" | "C" | "D"}`].title}
                  </CardTitle>
                  <CardDescription>
                    Score: {data[`criterion${criterion as "A" | "B" | "C" | "D"}`].score}/10
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress
                    value={(data[`criterion${criterion}` as keyof GradingData] as { score: number }).score * 10}
                    className="mb-4"
                  />
                  <p className="text-sm">
                    {(data[`criterion${criterion}` as keyof GradingData] as { feedback: string }).feedback}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="transcript">
            <Card>
              <CardHeader>
                <CardTitle>Presentation Transcript</CardTitle>
                <CardDescription>Student Submission</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <div className="space-y-4 text-sm">
                    {transcript.split("\n\n").map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rubric">
            <Card>
              <CardHeader>
                <CardTitle>IB English Individual Oral Assessment Rubric</CardTitle>
                <CardDescription>Official HL Assessment Criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full rounded-md border">
                <Table className="border-2 border-gray-700">
  <TableHeader className="border-2 border-gray-700">
    <TableRow className="border-2 border-gray-700">
      <TableHead className="w-[200px] border-2 border-gray-700 bg-gray-200 text-black">
        Criterion
      </TableHead>
      {scoreRanges.map((range) => (
        <TableHead key={range} className="text-center border-2 border-gray-700 bg-gray-200 text-black">
          {range}
        </TableHead>
      ))}
    </TableRow>
  </TableHeader>
  <TableBody className="border-2 border-gray-700">
    {criteriaDescriptions.map((criterion, index) => (
      <TableRow key={index} className="border-2 border-gray-700">
        <TableCell className="font-medium border-2 border-gray-700 bg-gray-100">
          {criterion.title}
        </TableCell>
        {rubricContent[index].map((content, contentIndex) => (
          <TableCell
            key={contentIndex}
            className={`text-sm p-2 border-2 border-gray-700 rounded-none ${getScoreRange(
              (data[`criterion${String.fromCharCode(65 + index)}` as keyof GradingData] as { score: number }).score
            ) === contentIndex + 1 ? "bg-blue-100 font-bold" : ""}`}
          >
            {content}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
</Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Button onClick={() => router.push("/recorder")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Recorder
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

