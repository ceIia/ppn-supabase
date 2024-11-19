import { z } from "zod";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
  throw new Error(
    "DISCORD_WEBHOOK_URL is not set in the environment variables"
  );
}

// Define the validation schema
const formSchema = z.object({
  name: z.string().min(2, "ur name must be at least 2 chars long!"),
  email: z.string().email("is that really ur email?"),
  topic: z.string().min(3, "come on... what's ur topic?"),
  message: z
    .string()
    .min(10, "ur message must be at least 10 chars long!")
    .max(1000, "ur message must not exceed 1000 chars!"),
});

export async function POST(request: Request) {
  const data = await request.json();

  // Validate the data against our schema
  const result = formSchema.safeParse(data);

  if (!result.success) {
    // Extract error messages and format them as text
    const errorMessages = result.error.issues.map((issue) => issue.message);
    const errorText = `there are some problems with ur submission:\n- ${errorMessages.join(
      "\n- "
    )}\n\nplease try again.`;

    return new Response(errorText, {
      status: 400,
    });
  }

  const { name, email, topic, message } = result.data;

  // Prepare the message for Discord
  const discordMessage = {
    embeds: [
      {
        title: "New Event Registration",
        color: 0x00ff00, // Green color
        fields: [
          { name: "Name", value: name },
          { name: "Email", value: email },
          { name: "Topic", value: topic },
          { name: "Message", value: message },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    // Send the message to Discord
    const discordResponse = await fetch(DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!discordResponse.ok) {
      throw new Error("Failed to send message to Discord");
    }

    return new Response("thx!", { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response("uh oh... something went wrong. try again later.", {
      status: 500,
    });
  }
}
