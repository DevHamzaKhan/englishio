import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function ReportPage() {
  const data = {
    criterionA: {
      score: 8,
      feedback:
        "The presentation demonstrates a strong understanding of both George Orwell's '1984' and Coca-Cola's advertising strategies. The speaker effectively draws parallels between the two, highlighting the theme of media influence on public perception. The interpretations are coherent and well-supported by examples from the text and real-world advertising campaigns. However, a deeper exploration of the nuances in '1984' could enhance the analysis further.",
    },
    criterionB: {
      score: 7,
      feedback:
        "The analysis of stylistic and structural features is well-executed, particularly in discussing Orwell's use of language and Coca-Cola's advertising techniques. The speaker provides relevant examples to support their claims, such as the Party's slogans and Coca-Cola's 'Open Happiness' campaign. Nonetheless, the evaluation could benefit from a more detailed examination of the impact of these features on the audience.",
    },
    criterionC: {
      score: 9,
      feedback:
        "The presentation is well-organised, with a clear introduction, main body, and conclusion. The ideas are developed logically, and the progression from Orwell's '1984' to Coca-Cola's advertising is seamless. The speaker maintains a strong focus on the central theme throughout the presentation.",
    },
    criterionD: {
      score: 8,
      feedback:
        "The language used in the presentation is clear, varied, and precise, suitable for an academic audience. The speaker employs an appropriate register and style, effectively conveying their analysis and interpretations. Minor improvements in language variety could further enhance the presentation.",
    },
    totalScore: 32,
    percentage: 80,
    overview:
      "The presentation offers a compelling analysis of media influence through the lens of George Orwell's '1984' and Coca-Cola's advertising strategies. It demonstrates strong knowledge and understanding, with well-supported interpretations and a logical structure. The language is clear and appropriate for academic discourse.",
    strengths: [
      "Strong understanding of '1984' and Coca-Cola's advertising strategies.",
      "Coherent and well-supported interpretations.",
      "Logical structure and clear progression of ideas.",
      "Clear and precise language suitable for academic discourse.",
    ],
    improvements: [
      "Explore the nuances in '1984' more deeply.",
      "Provide a more detailed examination of the impact of stylistic features on the audience.",
      "Enhance language variety to further improve the presentation.",
    ],
  }

  const sampleTranscript = `
    Good morning. Today, I will be exploring the theme of media influence and manipulation by comparing George Orwell's '1984' and Coca-Cola's advertising strategies.

    In '1984', the Party's control over media serves as a powerful tool for manipulating public consciousness. This is evident in the famous slogan "War is Peace, Freedom is Slavery, Ignorance is Strength." Similarly, Coca-Cola's advertising campaigns employ sophisticated psychological techniques to shape consumer behavior and cultural values.

    Let's examine the Party's use of doublethink and how it parallels modern advertising techniques. In '1984', Winston observes how the Party "told you to reject the evidence of your eyes and ears." Coca-Cola's "Open Happiness" campaign similarly suggests that happiness can be found in a bottle, creating an emotional association that transcends the product's physical properties.

    The language used in both contexts is particularly revealing. Orwell's Newspeak reduces the scope of thought by eliminating words, while Coca-Cola's slogans like "Taste the Feeling" create simplified emotional associations that bypass critical thinking.

    In conclusion, both '1984' and Coca-Cola's advertising demonstrate how language and media can be used to shape perception and influence behavior, though with notably different intentions and contexts.

    Thank you for your attention.
  `

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">IB English Individual Oral Assessment Report</h1>
        <p className="text-muted-foreground">
          Student Presentation on Media Influence in 1984 and Coca-Cola Advertising
        </p>
      </div>

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
        <TabsList>
          <TabsTrigger value="criteria">Assessment Criteria</TabsTrigger>
          <TabsTrigger value="transcript">Presentation Transcript</TabsTrigger>
          <TabsTrigger value="rubric">Full Rubric</TabsTrigger>
        </TabsList>

        <TabsContent value="criteria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Criterion A: Knowledge and Understanding</CardTitle>
              <CardDescription>Score: {data.criterionA.score}/10</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={data.criterionA.score * 10} className="mb-4" />
              <p className="text-sm">{data.criterionA.feedback}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criterion B: Analysis and Evaluation</CardTitle>
              <CardDescription>Score: {data.criterionB.score}/10</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={data.criterionB.score * 10} className="mb-4" />
              <p className="text-sm">{data.criterionB.feedback}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criterion C: Focus and Organization</CardTitle>
              <CardDescription>Score: {data.criterionC.score}/10</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={data.criterionC.score * 10} className="mb-4" />
              <p className="text-sm">{data.criterionC.feedback}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criterion D: Language</CardTitle>
              <CardDescription>Score: {data.criterionD.score}/10</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={data.criterionD.score * 10} className="mb-4" />
              <p className="text-sm">{data.criterionD.feedback}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transcript">
          <Card>
            <CardHeader>
              <CardTitle>Presentation Transcript</CardTitle>
              <CardDescription>Media Influence in 1984 and Coca-Cola Advertising</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4 text-sm">
                  {sampleTranscript.split("\n\n").map((paragraph, index) => (
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
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">
                      Criterion A: Knowledge, Understanding and Interpretation (0-10)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluates the candidates knowledge and understanding of the extracts and texts, and their ability
                      to draw conclusions related to the global issue.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Criterion B: Analysis and Evaluation (0-10)</h3>
                    <p className="text-sm text-muted-foreground">
                      Assesses how well the candidate analyzes and evaluates the ways in which authorial choices present
                      the global issue.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Criterion C: Focus and Organization (0-10)</h3>
                    <p className="text-sm text-muted-foreground">
                      Evaluates the structure, balance, and focus of the oral presentation, as well as the cohesive
                      connection of ideas.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Criterion D: Language (0-10)</h3>
                    <p className="text-sm text-muted-foreground">
                      Assesses the clarity, accuracy, and effectiveness of language use, including vocabulary, syntax,
                      and style.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

