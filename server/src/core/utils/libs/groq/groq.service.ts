import Groq from "groq-sdk";
import env from "../../env";

export class groqService {
  private groq: Groq;
  constructor() {
    this.groq = new Groq({ apiKey: env.GROQ_API_KEY });
  }

  async getCategory(name: string, categories: any[]) {
    const categoriesJson = JSON.stringify(categories);
    const response = await this.groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `get the right id category from list ${categoriesJson} based on the submitted data. use json format.`,
        },
        {
          role: "user",
          content: name,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: false,
      reasoning_effort: "low",
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    return response.choices[0].message.content;
  }

  async byImage(imageUrl: string) {
    const response = await this.groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            'extract all information data from image into json format for amount there is no comma separator, here is the strict format :\n[\n  { "name": "", "amount": "" },\n]\n\n',
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "",
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      temperature: 0,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    return response.choices[0].message.content;
  }

  async messageAlert(
    alertPercentage: number,
    currentPercentage: number,
    periode: string,
  ) {
    const response = await this.groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Provide a warning message in one sentence, simple, straightforward, not rigid, and anti-thesis. This alert is about the user-defined spending limit. Based on user-submitted data. send in json format.",
        },
        {
          role: "user",
          content: `{
                "alert_percentage": "${alertPercentage}%",
                "current_percentage": "${currentPercentage}%",
                "periode": "${periode}"
              }`,
        },
      ],
      model: "openai/gpt-oss-20b",
      temperature: 0,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: false,
      reasoning_effort: "low",
      response_format: {
        type: "json_object",
      },
      stop: null,
    });

    return response.choices[0].message.content;
  }
}
