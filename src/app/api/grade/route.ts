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

Demonstrate knowledge and understanding of the work(s)

Offer interpretations that are coherent and supported by the work(s)

Scoring Descriptors:

1-2: Little knowledge and understanding of the extracts and works/texts in relation to the global issue. References to the extracts and works/texts are infrequent or rarely appropriate.

3-4: Some knowledge and understanding of the extracts and works/texts in relation to the global issue. References to the extracts and works/texts are at times appropriate.

5-6: Satisfactory knowledge and understanding of the extracts and works/texts with an interpretation of their implications in relation to the global issue. References to the extracts and works/texts are generally relevant and mostly support the candidate’s ideas.

7-8: Good knowledge and understanding of the extracts and works/texts with a sustained interpretation of their implications in relation to the global issue. References to the extracts and works/texts are relevant and support the candidate’s ideas.

9-10: Excellent knowledge and understanding of the extracts and works/texts with a persuasive interpretation of their implications in relation to the global issue. References to the extracts and works/texts are well chosen and effectively support the candidate’s ideas.

Criterion B: Analysis and evaluation (10 marks)

Analyze and evaluate how the author uses stylistic and structural features to shape meaning

Support claims with well-chosen examples

Scoring Descriptors:

1-2: Little analysis or evaluation of how authorial choices present the global issue. References are infrequent or rarely appropriate.

3-4: Some analysis and evaluation of how authorial choices present the global issue. References are at times appropriate.

5-6: Satisfactory analysis and evaluation of how authorial choices present the global issue. References are generally relevant and mostly support the candidate’s ideas.

7-8: Good analysis and evaluation of how authorial choices present the global issue. References are relevant and support the candidate’s ideas.

9-10: Excellent analysis and evaluation of how authorial choices present the global issue. References are well chosen and effectively support the candidate’s ideas.

Criterion C: Focus and organization (10 marks)

Sustain focused and developed ideas

Logical structure with coherent progression

Scoring Descriptors:

1-2: The oral rarely focuses on the task. There are few connections between ideas.

3-4: The oral only sometimes focuses on the task; treatment of extracts and works/texts may be unbalanced. Some connections between ideas, but not always coherent.

5-6: The oral maintains a focus on the task despite some lapses; treatment of extracts and works/texts is mostly balanced. The development of ideas is mostly logical, with generally cohesive connections.

7-8: The oral maintains a mostly clear and sustained focus on the task; treatment of extracts and works/texts is balanced. The development of ideas is logical with effectively cohesive connections.

9-10: The oral maintains a clear and sustained focus on the task; treatment of extracts and works/texts is well balanced. The development of ideas is logical and convincing with cogent connections.

Criterion D: Language (10 marks)

Clear, varied, and precise language

Appropriate register and style for academic discourse

Scoring Descriptors:

1-2: The language is rarely clear or accurate; errors often hinder communication. Vocabulary and syntax are imprecise and frequently inaccurate. Style elements (register, tone, rhetorical devices) are inappropriate and detract from the oral.

3-4: The language is generally clear; errors sometimes hinder communication. Vocabulary and syntax are often imprecise with inaccuracies. Style elements are often inappropriate and detract from the oral.

5-6: The language is clear; errors do not hinder communication. Vocabulary and syntax are appropriate but simple and repetitive. Style elements are appropriate but neither enhance nor detract from the oral.

7-8: The language is clear and accurate; occasional errors do not hinder communication. Vocabulary and syntax are appropriate and varied. Style elements are appropriate and somewhat enhance the oral.

9-10: The language is clear, accurate, and varied; occasional errors do not hinder communication. Vocabulary and syntax are varied and create effect. Style elements are appropriate and enhance the oral.

Provide:

Numerical scores for each criterion (0-10)

Percentage equivalent of total score

Detailed feedback for each criterion

Overall strengths and areas for improvement

Final total score out of 40

Use UK English spelling and academic tone:
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