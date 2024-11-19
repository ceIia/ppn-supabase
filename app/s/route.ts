import { z } from "zod";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!DISCORD_WEBHOOK_URL) {
  throw new Error(
    "DISCORD_WEBHOOK_URL is not set in the environment variables"
  );
}

// Define the validation schema with standard messages
const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  topic: z.string().min(3),
  message: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  const data = await request.json();

  // Validate the data against our schema
  const result = formSchema.safeParse(data);

  if (!result.success) {
    // Simplified error structure focusing on field validation
    const errorResponse = {
      error: {
        message: "Invalid request parameters",
        type: "invalid_request_error",
        param: result.error.issues[0].path[0], // First error field
        code: "invalid_parameter",
        details: result.error.issues.map((issue) => ({
          field: issue.path[0],
          type: "invalid_value",
        })),
      },
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const { name, email, topic, message } = result.data;

  // Prepare the message for Discord
  const discordMessage = {
    embeds: [
      {
        title: "New Event Registration",
        color: 0x00ff00,
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

    const successResponse = {
      success: true,
      message: "thx! see u on dec 4th.",
      event: {
        when: "dec 4th, 2024 at 7pm",
        who: "papernest (Le Cargo)",
        where: "157 boulevard Macdonald, 75019 Paris",
        register: "https://lu.ma/3bmr2ri8",
      },
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    const errorResponse = {
      error: {
        message: "uh oh... something went wrong. try again later.",
        type: "api_error",
        code: "internal_server_error",
      },
    };

    console.error("Error:", error);
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
