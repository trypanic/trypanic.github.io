---
title: How to Build an Basic CLI AI Agent with Golang
description: AI agent, comenzaremos con interacciones básicas con un modelo de lenguaje grande (LLM) y progresaremos gradualmente hacia un agente de IA más completo ...
date: 2025-07-30
tags: ["ai-agents", "LLMS", "golang"]
---


# Introduction

This post is the first in a series where I'll share my personal journey of learning how to build an AI Agent from scratch using Golang. It's heavily inspired by [How to Build an Agent](https://ampcode.com/how-to-build-an-agent) by [Thorsten Ball](https://thorstenball.com/), but with a different perspective and target: a more general-purpose agent rather than one focused specifically on code editing.

We'll begin with basic interactions with a large language model (LLM) and gradually progress toward a more complete AI Agent by incorporating tools, memory, MCP (Model Context Protocol), and more.

My goal is to share everything I've learned about how AI agents work under the hood, and to make that understanding accessible to others who are interested in the same topic.

<br />

**_Disclaimer_**: I'm not an expert in AI Agents, LLMs, ML, and AI in general. So, this series is based on my personal learning journey, and everything I share comes from reading, research, and hands-on experimentation. Use it as a learning resource. The code examples is just for educational purposes and are not production-ready.

<br />

If you see any mistakes or have suggestions for improvement, I'd really appreciate your feedback!


## What is an AI Agent?

According to Google:
> AI agents are software systems that use AI to pursue goals and complete tasks on behalf of users. They show reasoning, planning, and memory and have a level of autonomy to make decisions, learn, and adapt.

According to Anthropic:
> "Agent" can be defined in several ways. Some customers define agents as fully autonomous systems that operate independently over extended periods, using various tools to accomplish complex tasks. Others use the term to describe more prescriptive implementations that follow predefined workflows.

Both are very clear explanations of what an AI Agent is. But to truly understand it in depth, what's going on under the hood, let's break it all down from scratch. After exploring the concepts step by step, I'll share my own perspective. Then, you'll have enough context to define what an AI Agent really means in your own words.


## A simple interaction with a LLM (one input, one output)

Let's start with the most basic form of interaction: you send a message to a LLM through Anthropic API using the Anthropic SDK (you can use your preferred programming language). The API responds with a generated message.

 ```mermaid
sequenceDiagram
    Client (Anthropic SDK)->>Anthropic API: prompt
    Anthropic API-->>Client (Anthropic SDK): response
```

For example, you might send: `"Hello, how are you?"`


And the model might respond with: `"I'm doing well, thank you!"`

Here's what that looks like in Go:

<details>

<summary>Golang Code</summary>

```golang

// Set your API key as an environment variable named ANTHROPIC_API_KEY
// Ensure the necessary Go dependencies are installed

// added code to measure the timing

package main

import (
	"context"
	"fmt"
	"time"

	"github.com/anthropics/anthropic-sdk-go"
)

func main() {
	ctx := context.Background()
	message := "Hello, how are you?"
	//message := "Can you tell me about the history of AI?"
	client := anthropic.NewClient()

	// Start timing
	start := time.Now()

	outcome, err := client.Messages.New(ctx, anthropic.MessageNewParams{
		Model:     anthropic.ModelClaude4Sonnet20250514,
		MaxTokens: int64(1024),
		Messages: []anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock(message)),
		},
	})

	// End timing
	duration := time.Since(start)

	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	fmt.Printf("Response: %+v\n", outcome.Content[0].Text)
	fmt.Printf("Execution time: %s\n", duration)
}

```
</details>

When you run the previous code, the response might look like:



![](../img/1.webp)

Let's try sending another message: `"Can you give me a summary about the history of AI?"`

Executing the code, you will get something like:

![](../img/2.webp)



### Observations

1. The response takes a few seconds to print in the console (although this is partly unrelated to the Anthropic API or its generated responses, as we will discuss further). The first example takes approximately 1.5 seconds, and the second takes approximately 10 seconds.

2. In the first example, the response is more verbose than a simple "I'm doing well, thank you!". It is because the model is trying to be more helpful and informative, but it can be adjusted by changing the prompt or the model parameters (e.g., temperature, top_p, etc.).

3. During this process,the execution appears to freeze until the response is received, especially in the second example, where the delay is more evident. This is critical, as it can result in a poor user experience and create the impression that the system is unresponsive.

<br />

In both cases, we see a simple interaction: `input → output`. So, is this simple interaction considered an AI Agent? You might think so, after all, you're interacting with a LLM over the Anthropic API, right? but, the short answer is absolutely not, at least, not yet!

**_Why not?_** Because the code we've used so far only handles a single interaction with no ongoing or continuous dialogue; it doesn't retain in a memory any previous messages (stateless interaction), it doesn't take any actions on your behalf, it doesn't interact outside of its own context with external systems/tools, it doesn't understanding of goals, and there is not a decision-making involved. As such, this basic interaction is not sufficient to qualify as an AI agent.

Let's take a pause here and refactor the previous code to enhance the user experience.

See a preview of the results:

![](../img/3.webp)

Seems like a good start, right?


### Code Refactoring (optional to read)

In this section, we'll explore how to use streaming to prevent blocking behavior.

#### What is a stream?

Imagine you're filling a glass with wine. The wine bottle is made of black glass, so you can't see how much wine is left inside. As you pour, the wine flows continuously from the bottle into the glass until it's full or not, it depending on how much liquid is in the bottle (which you can't see).

This continuous flow is similar to how data can move between two systems in software. When one system sends information and the other receives it in a steady, ongoing manner, that's called a stream. A real-world example of data streaming is when you're watching a live concert online in platforms like YouTube Live, Facebook Live, Twitch, or others. These stream services continuously send video and audio data to your device in real time, just like the wine flows from the bottle, but you don't know exactly when it will stop, because you can't see how much is left.

With that context in mind, let's return to the interaction between the earlier code and the Anthropic API. In this case, neither the code nor the API is using streaming communication, both follow a traditional request-response model, which is not real time. This is by design, and it's worth noting that the Anthropic SDK supports both streaming and non-streaming communication.

<details>

<summary>Golang Code</summary>

 ```golang
 ```

</details>
