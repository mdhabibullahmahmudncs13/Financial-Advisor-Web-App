'use client'

import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Card,
  CardHeader,
  CardBody,
  Heading,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { FiMic, FiMicOff } from 'react-icons/fi'
import { Voice } from '@elevenlabs/sdk'

type ExpenseFormData = {
  amount: number
  category: string
  description: string
  date: string
}

type ExpenseFormProps = {
  onExpenseAdded: () => void
}

export function ExpenseForm({ onExpenseAdded }: ExpenseFormProps) {
  const [isRecording, setIsRecording] = useState(false)
  const toast = useToast()
  const { register, handleSubmit, reset, setValue } = useForm<ExpenseFormData>()

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Health & Fitness',
    'Travel',
    'Other',
  ]

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Failed to add expense')

      toast({
        title: 'Expense added successfully',
        status: 'success',
        duration: 3000,
      })

      reset()
      onExpenseAdded()
    } catch (error) {
      toast({
        title: 'Error adding expense',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const handleVoiceInput = async () => {
    try {
      setIsRecording(true)
      // Initialize voice recognition
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)()
      recognition.continuous = false
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        // Parse the voice input (you can enhance this parsing logic)
        const amountMatch = transcript.match(/\d+(\.\d{1,2})?/)
        const categoryMatch = categories.find(cat => 
          transcript.toLowerCase().includes(cat.toLowerCase())
        )

        if (amountMatch) setValue('amount', parseFloat(amountMatch[0]))
        if (categoryMatch) setValue('category', categoryMatch)
        setValue('description', transcript)
      }

      recognition.start()
    } catch (error) {
      toast({
        title: 'Voice input error',
        description: 'Could not initialize voice recognition',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsRecording(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">Add Expense</Heading>
          <IconButton
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            icon={isRecording ? <FiMicOff /> : <FiMic />}
            onClick={handleVoiceInput}
            colorScheme={isRecording ? 'red' : 'gray'}
          />
        </HStack>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register('amount', { required: true, min: 0 })}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select {...register('category', { required: true })}>
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input {...register('description')} />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                {...register('date', { required: true })}
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" w="full">
              Add Expense
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  )
}