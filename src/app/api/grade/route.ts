// app/api/grade/route.ts
import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';


const gradingPrompt = (transcript: string) => `
You are an expert IB English examiner. Analyze the following Individual Oral presentation transcript based on the official IB rubric:

<Transcript>
${transcript}
</Transcript>

Evaluate the presentation based on these criteria from the IB rubric:

Criterion A: Knowledge, understanding, and interpretation (10 marks)
- Demonstrate knowledge and understanding of the work(s)
- Offer interpretations that are coherent and supported by the work(s)

Criterion B: Analysis and evaluation (10 marks)
- Analyze and evaluate how the author uses stylistic and structural features to shape meaning
- Support claims with well-chosen examples

Criterion C: Focus and organization (10 marks)
- Sustain focused and developed ideas
- Logical structure with coherent progression

Criterion D: Language (10 marks)
- Clear, varied, and precise language
- Appropriate register and style for academic discourse

Provide:
1. Numerical scores for each criterion (0-10)
2. Percentage equivalent of total score
3. Detailed feedback for each criterion
4. Overall strengths and areas for improvement
5. Final total score out of 40

Use UK English spelling and academic tone. Format your response as valid JSON:
{
  "criterionA": {
    "score": number,
    "feedback": string
  },
  "criterionB": {
    "score": number,
    "feedback": string
  },
  "criterionC": {
    "score": number,
    "feedback": string
  },
  "criterionD": {
    "score": number,
    "feedback": string
  },
  "totalScore": number,
  "percentage": number,
  "overview": string,
  "strengths": string[],
  "improvements": string[]
}
`;

const gradeSchema = z.object({
  criterionA: z.object({
    score: z.number().min(0).max(10),
    feedback: z.string()
  }),
  criterionB: z.object({
    score: z.number().min(0).max(10),
    feedback: z.string()
  }),
  criterionC: z.object({
    score: z.number().min(0).max(10),
    feedback: z.string()
  }),
  criterionD: z.object({
    score: z.number().min(0).max(10),
    feedback: z.string()
  }),
  totalScore: z.number().min(0).max(40),
  percentage: z.number().min(0).max(100),
  overview: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string())
});

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();

    if (!transcript || typeof transcript !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid transcript provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { object } = await generateObject({
      model: openai.chat('gpt-4o'),
      schema: gradeSchema,
      system: gradingPrompt(transcript),
      prompt: 'Please grade this IB English Oral presentation transcript.',
    });

    return new Response(JSON.stringify(object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Grading error:', error);
    return new Response(JSON.stringify({ 
      error: 'Error processing grading request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Optional for Edge runtime (uncomment if needed):
// export const runtime = 'edge';