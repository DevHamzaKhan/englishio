import { generateObject } from 'ai';
import { z } from 'zod';
import { openai } from '@ai-sdk/openai';
const questionPrompt = (transcript: string) => `
You are an expert IB English examiner conducting the **question segment** of an Individual Oral (IO) assessment.  
<Transcript>
${transcript}
</Transcript>
The student has just completed their **10-minute presentation**, where they analyzed a **global issue** through a **literary text** and a **non-literary text**. Now, they have **5 minutes** to answer follow-up questions.  

Your role is to generate a set of **thought-provoking** and **engaging** questions that will allow the student to further explore and articulate their ideas.  

---

### **Question Guidelines**  
Your questions should:  
- Encourage **deeper discussion and critical thinking**.  
- Expand on **key ideas** that could benefit from further analysis.  
- Align with the **IB IO assessment rubric**, ensuring all major criteria are explored.  
- Be open-ended and encourage reflection, rather than simple yes/no answers.  

Each question should **naturally prompt the student to elaborate**, helping them:  
- Strengthen their interpretation of the texts.  
- Provide more evidence and reasoning.  
- Discuss authorial choices in greater depth.  
- Clarify connections between the texts and the global issue.  

---

### **IB Assessment Criteria (Ensure Questions Cover These Areas)**  

**Criterion A: Knowledge, Understanding, and Interpretation (10 marks)**  
- How well does the student **demonstrate knowledge** of the works?  
- Are their interpretations **coherent and well-supported**?  

**Criterion B: Analysis and Evaluation (10 marks)**  
- How effectively do they **analyze stylistic and structural features**?  
- Do they support their claims with **well-chosen examples**?  

**Criterion C: Focus and Organization (10 marks)**  
- Is their discussion **logical, cohesive, and well-developed**?  
- Are they making strong **connections between ideas**?  

**Criterion D: Language (10 marks)**  
- Is their language **clear, precise, and varied**?  
- Are they using an **academic register** effectively?  

---

### **Final Output**  
Generate **10-12 well-crafted questions**, ensuring they:  
✔ Cover all key areas of the rubric.  
✔ Encourage a **balanced discussion**.  
✔ Are framed in a way that allows the student to **fully express their understanding**.  

Use **UK English spelling** and maintain an **academic yet conversational tone**.  

Make the questions sound more natural and human-like.
`;

const questionScheme = z.object({
  questions: z.array(z.string())
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
      schema: questionScheme,
      system: questionPrompt(transcript),
      prompt: 'Please respond to this IB English Oral presentation transcript with questions.',
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