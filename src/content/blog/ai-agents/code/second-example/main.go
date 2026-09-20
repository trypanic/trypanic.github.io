package main

import (
	"context"
	"fmt"
	"os"

	"github.com/anthropics/anthropic-sdk-go"
)

func main() {
	ctx := context.Background()

	if len(os.Args) < 2 {
		fmt.Println("Usage: go run main.go \"Your message here\"")
		return
	}

	message := os.Args[1]
	client := anthropic.NewClient()

	fmt.Printf("You: %s\n\nAssistant: ", message)

	stream := client.Messages.NewStreaming(ctx, anthropic.MessageNewParams{
		Model:     anthropic.ModelClaude4Sonnet20250514,
		MaxTokens: int64(1024),
		Messages: []anthropic.MessageParam{
			anthropic.NewUserMessage(anthropic.NewTextBlock(message)),
		},
	})

	for stream.Next() {
		event := stream.Current()
		if event.Type == "content_block_delta" && event.Delta.Type == "text_delta" {

			writer.WriteString("\u001b[93mClaude\u001b[0m: ")
		}
	}

	if err := stream.Err(); err != nil {
		fmt.Printf("\nError: %v\n", err)
		return
	}

	fmt.Println("\n")
}
