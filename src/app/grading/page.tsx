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
                const savedTranscript = "Hello, today In my IO I will be exploring the global issue: Politics, power and justice, by focusing on the dehumanization of the less powerful. I will explore it through Toni Morrison’s novel The Bluest Eye, which reveals the dehumanization of black people in white centric America, and Mandela’s speeches which reveal the dehumanization of the less powerful black south Africans living under the racist aparthied regime. In the novel Morrison whos purpose is to humanize black people reveals how the powerless are unable to prevent being dehumanized, and in respose internalize that dehumanization or project it onto others. On the other hand Mandela depicts the dehumanization of the powerless as a means to garner support from his audience for his purpose of fighting against their aparthied oppressors.\
Starting off with the literary body of work. According to Claudia, a fellow african american, Cholly rapes his daughter by the end of the novel. And thus has “joined the animals, an old dog, a snake, a ratty n word”. The tricolon, of comparisons to animals and a derogatory term used to sell black people as commodities emphasizes to readers that Cholly is more animal than human or devoid of humanity. This causes readers to dehumanize him, despite knowing very little about him. And is something he is powerless in preventing.\
This dehumanization is further seen zooming in to the literary extract. In the extarct Cholly and Darlene, are caught by two white men when hving sexual intercourse. Morrison highlights the imbalance of power as whilst Cholly addresses the men with “sir” in line 10, which has connotations of respect, Cholly is told “come on coon.” and “to get on wid it” in line 27 and 9. The comparison to an animal and the colloquialism of the mens dialogue, makes clear to the readers that the men do not respect Cholly’s privacy nor dignity as a human. The demanding and direct tone also shows readers, that the white men even feel entitled to using Cholly for their sexual entertainment. Again this highlights to readers how Cholly is violated, loses power over his body, and is thus dehumanized by the more powerful white men.\
Continouing still with the extract, As the dehumanization contineus, Cholly becomes increasingly helpless and hateful towards Darlene. In the beginning of the extract, Cholly’s first thought in line 2 was whether “ he had hurt her,” this is juxtaposed to how Cholly In an attempt to control and have power over his humiliation attempts to pull “her dress up” in line 19 and sees her as a monster with baby claws. This diction and juxtaposition between treatment towards Darlene reveals how he starts to project the dehumanization onto Darlene as a means to cope with the his dehumanization. However all of Cholly’s attempts to have power is effortlessly invalidated through the whitemen’s eerie harrowing laugh “heee heee hee,” in lines 7, 24, and 26. The repetition of the interrupting onomatopoeia develops a desperate tone highlights Cholly’s powerlessnesss.\
Connecting back to the body of work, for readers who in the beginning of the novel felt justified to dehumanize him, this extract offers a reason for his actions, though unjustified, is a product of the society that dehumanizes him. This fufils Morrisons goal of prompting the predominatnly white readers to recognize how they are a part of the problem by dehumanzing people like cholly, as they did in the beginning of the novel.\
Now going back to the body of work, Morrison expands on feeling dehumanized when describing how Polly was birthing Pecola. Despite Polly being in pain and a powerless pregnant lady, the doctors joked that black women “don’t have any trouble with delivering…as they deliver right away. The comparison to an animal and diction “any trouble” and right away”, creates a effortless tone despite the painful process of giving birth. This makes clear how the doctors dismiss, deprive, and invalidate polly’s option to even voice out discomfort or any sort of human emotion. This suggests to readers that Polly loses autonomy over her voice and treatment as as a human being, highlighting how Polly is dehumanized.\
Dehumanization is seen again in Pecola, a little powerless black girl. According to claudia all the abuse and racism or “waste” of society was all “dumped on her and which she absorbed.” The metaphor makes clear to readers how Pecola claims dehuamnization as a part of her very being. The internalization allows Pecola to be a scapegoat for society including the black community, as through dehumanizing Pecola they felt wholesome, beautiful, more human. This highlights to black readers how they too are responsible for the dehumanization of the least powerful, prompting them to start humanizing and furthering Morrison’s purpose .\
Now moving on to the nonliterary work. In the extract from Mandela speech “I am prepared to die” Mandela reveals how society leaves black South Africans powerless over their life and dehumanized. Mandela’s diction of “policy” in line 1 and “Legislation” and in line 2 that result, preserve, and entrenches “black inferiority” in lines 1 and 2, makes clear to the audience that the powerlessness black people face is the product of the aparthied system, it is systemic and official. Mandela strengthens this notion through the example of pass laws. As in line 12 they “render any African liable to police surveillance at any time.” This makes clear how the aparthied system that govern south african society renders black south africans powerless and dehumanized, as they produce laws such as the pass law that strip their right to autonomy and privacy.\
Mandela expands, explaining the impacts of such dehumanization in the anaphora in lines 27 to 36 through the inclusion of phrases such as wanting to perform work which they are capable of doing” and “travel the country.” in lines 28 and 35. This makes clear to Mandelas white audience how black south africans are deprived of things considered basic human rights, highlighting how black south african are dehumanized from basic human life and wants. Moreover, The repetition of “Africans want” and the synthetic pronoun “we want” provides Mandela’s audience with a feeling of reclaiming their power through a sense of comradery being apart of “we”. This reclamation is furthered through the repetition of high modality language and antithesis in the anaphora through “we want” and not”. for example Mandela says “Africans want to be allowed out after 11’ o clock at night and not be confined to their rooms” This highlight that whilst black south africans are currently dehumanized and powerless under the aparthied regime, they can take charge of their life, like going out at night when they choose to do so. In this way Mandela prompts african listeners to yearn for that power and humanization and thus persuades them to fight against their opressors that exploit their powerlessness, furthering his purpose of fighting the aparthied regime.\
Expanding to the body of work Mandela similarly prompts his listerenes to fight against the aparthied regime through depictions of dehumanization of the powerless. In No Easy Walk to Freedom Mandela lists how in “homes” and “schools,” and a seemingly endless list of places black people disuccs the misdeeds like “inhuman exploitation” and “grinding poverty” of the aparthied regime . The lists and imagery, develops a desperate tone that appeals to the african audience who relate, but also highlights to his more powerful white audience of how the oppresion is an occurence everywhere and all the time.\
Similarly, In We Shall crush apartheid Mandela, through more imagery, reveals how “ferocious fire pouring a hail of bullets killing hundreds of black men, women and children. The imagery and mention of the aggressive, merciless and senseless murder of black people and children, which have connotations of innocence and fragility, characterizes the aparthied regime as an evil system that does not care for the nations future, their children.\
Finally, Even after Mandela is finally inaugurated as South Africa as president, in his inaugaration Mandela continues to communicate how the “racism and racist oppression” has caused a “festering sore”. This gruesome metaphor and the previous violent imagery discussed previously is juxtaposed to how he explains working towards fighting aparthied and reclaiming african power has awllowed for a“rainbow nation” full of human dignitye. The rainbow has connotations with hope and symbolizes a nation comprised of many skin colors. This juxtaposition of happy and hopeful imagery and aggressive imagery makes clear to listeners how an Africa that huamnizes the less powerful, is a step in the right direction, prompting his listeners to be inspired and continue their fight against the aparthied.\
To conclude, while both address the dehumanization of the less powerful in different ways, it is clear that the black people living in both south african and america are easily dehumanized due to their powerlessness within society either systemically or socially. Both Morrison and Mandela use stylistic and structural choices to humanize the dehumanized and challenge their audience to make a change. For Morrison’s readers its to humanize those easily dehumanized, and for Mandela’s audience its inspiration to reclaim their power and humanity by fighting the oppressive aparthied regime. Thank you"
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