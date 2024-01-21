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