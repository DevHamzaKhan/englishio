import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, BookOpenCheck, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">English IO Grader</h1>
        <p className="text-xl text-muted-foreground">Enhance your English speaking skills with AI-powered feedback</p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome to English IO Grader</CardTitle>
          <CardDescription>Your personal assistant for improving English oral presentations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            English IO Grader is an innovative app designed to help you practice and improve your English speaking
            skills. With our advanced AI-powered grading system, you can receive instant feedback on your oral
            presentations, helping you prepare for your IB English Individual Oral assessment.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Record
                </CardTitle>
              </CardHeader>
              <CardContent>
                Record your presentation with our easy-to-use interface. Practice as many times as you need!
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpenCheck className="h-5 w-5" />
                  Analyze
                </CardTitle>
              </CardHeader>
              <CardContent>Our AI analyzes your speech, providing a detailed transcript and evaluation.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Improve
                </CardTitle>
              </CardHeader>
              <CardContent>Receive personalized feedback and tips to enhance your speaking skills.</CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/recorder">Start Recording</Link>
          </Button>
        </CardFooter>
      </Card>

          <Card>
            <CardHeader>
              <CardTitle>About English IO Grader</CardTitle>
              <CardDescription>Empowering students to excel in English oral presentations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                English IO Grader is designed to help IB students prepare for their English Individual Oral assessment.
                Our app combines cutting-edge speech recognition technology with AI-powered analysis to provide you with
                instant, accurate feedback on your oral presentations.
              </p>
              <p>
                Whether you are practicing for your final assessment or just looking to improve your English speaking
                skills, English IO Grader offers a user-friendly platform for recording, analyzing, and enhancing your
                presentations. With detailed feedback based on the official IB rubric, you will gain valuable insights
                into your strengths and areas for improvement.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>IB English Individual Oral Assessment Rubric</CardTitle>
              <CardDescription>Understanding the grading criteria</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Knowledge, Understanding, and Interpretation (0-10):</strong> Evaluates your knowledge and
                  understanding of the extracts and texts, and your ability to draw conclusions related to the global
                  issue.
                </li>
                <li>
                  <strong>Analysis and Evaluation (0-10):</strong> Assesses how well you analyze and evaluate the ways
                  in which authorial choices present the global issue.
                </li>
                <li>
                  <strong>Focus and Organization (0-10):</strong> Evaluates the structure, balance, and focus of your
                  oral presentation, as well as the cohesive connection of ideas.
                </li>
                <li>
                  <strong>Language (0-10):</strong> Assesses the clarity, accuracy, and effectiveness of your language
                  use, including vocabulary, syntax, and style.
                </li>
              </ul>
            </CardContent>
          </Card>
    </div>
  )
}

