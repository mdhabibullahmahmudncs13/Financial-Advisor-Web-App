'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Text,
  Button,
  VStack,
  Input,
  useToast,
  AspectRatio,
} from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'

type VideoResponse = {
  videoUrl: string
  transcript: string
}

export function VirtualAdvisor() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [videoResponse, setVideoResponse] = useState<VideoResponse | null>(null)
  const toast = useToast()

  const handleQuestionSubmit = async () => {
    if (!question.trim()) {
      toast({
        title: 'Please enter a question',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ai/video-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) throw new Error('Failed to generate video response')

      const data = await response.json()
      setVideoResponse(data)
      setQuestion('')
    } catch (error) {
      toast({
        title: 'Error generating video response',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Virtual Financial Advisor</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4}>
          <Box w="100%">
            <Text mb={2}>Ask your financial question:</Text>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g., How can I improve my savings?"
              onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()}
            />
          </Box>

          <Button
            leftIcon={<FiSend />}
            colorScheme="blue"
            onClick={handleQuestionSubmit}
            isLoading={loading}
            w="100%"
          >
            Get Video Response
          </Button>

          {videoResponse && (
            <Box w="100%">
              <AspectRatio ratio={16 / 9}>
                <video
                  src={videoResponse.videoUrl}
                  controls
                  poster="/advisor-thumbnail.jpg"
                />
              </AspectRatio>
              <Text mt={4} fontSize="sm" color="gray.600">
                {videoResponse.transcript}
              </Text>
            </Box>
          )}
        </VStack>
      </CardBody>
    </Card>
  )
}