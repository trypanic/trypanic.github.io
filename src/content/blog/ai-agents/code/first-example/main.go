package main

import (
	"context"
	"fmt"
	"time"

	"github.com/anthropics/anthropic-sdk-go"
)

func main() {
	ctx := context.Background()
	message := "What's the time?"
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

	fmt.Printf("%+v\n", outcome.Content[0].Text)
	fmt.Printf("(Execution time: %s)\n", duration)
}
