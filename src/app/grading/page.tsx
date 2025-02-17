'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function ReportPage() {
    const router = useRouter();
    interface GradingData {
        totalScore: number;
        percentage: number;
        overview: string;
        strengths: string[];
        improvements: string[];
        criterionA: { title: string; score: number; feedback: string };
        criterionB: { title: string; score: number; feedback: string };
        criterionC: { title: string; score: number; feedback: string };
        criterionD: { title: string; score: number; feedback: string };
    }

    const [data, setData] = useState<GradingData | null>(null);
    const [transcript, setTranscript] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const savedTranscript = sessionStorage.getItem('transcript');
                if (!savedTranscript) {
                    throw new Error('No transcript found');
                }
                setTranscript(savedTranscript);

                const response = await fetch('/api/grade', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ transcript: savedTranscript }),
                });

                if (!response.ok) {
                    throw new Error('Grading failed');
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto py-8 space-y-8 flex flex-col items-center justify-center h-[80vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-lg text-muted-foreground">Analysing transcript...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto py-8 space-y-8 flex flex-col items-center">
                <div className="text-destructive p-4 bg-destructive/10 rounded-lg">
                    {error || 'Failed to load grading data'}
                </div>
                <Button onClick={() => router.push('/')}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
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

                <TabsContent value="criteria">
                    {["A", "B", "C", "D"].map((criterion, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle>Criterion {criterion}: {data[`criterion${criterion as 'A' | 'B' | 'C' | 'D'}`].title}</CardTitle>
                                <CardDescription>Score: {data[`criterion${criterion as 'A' | 'B' | 'C' | 'D'}`].score}/10</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Progress value={(data[`criterion${criterion}` as keyof GradingData] as { score: number }).score * 10} className="mb-4" />
                                <p className="text-sm">{(data[`criterion${criterion}` as keyof GradingData] as { feedback: string }).feedback}</p>
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
                            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                <div className="space-y-6">
                                    {[
                                        { title: "Knowledge, Understanding, and Interpretation", description: "Evaluates the candidate's knowledge and understanding of the extracts and texts, and their ability to draw conclusions related to the global issue." },
                                        { title: "Analysis and Evaluation", description: "Assesses how well the candidate analyzes and evaluates the ways in which authorial choices present the global issue." },
                                        { title: "Focus and Organization", description: "Evaluates the structure, balance, and focus of the oral presentation, as well as the cohesive connection of ideas." },
                                        { title: "Language", description: "Assesses the clarity, accuracy, and effectiveness of language use, including vocabulary, syntax, and style." }
                                    ].map((criterion, index) => (
                                        <div key={index}>
                                            <h3 className="font-semibold mb-2">{criterion.title} (0-10)</h3>
                                            <p className="text-sm text-muted-foreground">{criterion.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}