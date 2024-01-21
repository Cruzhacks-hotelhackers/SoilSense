import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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' // This is the default and can be omitted
});

async function main() {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: 'Say this is a test' }],
    model: 'gpt-3.5-turbo',
  });
}

main();