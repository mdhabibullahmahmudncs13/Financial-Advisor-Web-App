'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  Button,
  useToast,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { FiCheckCircle, FiRefreshCw } from 'react-icons/fi'

type Advice = {
  summary: string
  tips: string[]
  savingsPotential: number
}

export function AIAdvice() {
  const [advice, setAdvice] = useState<Advice | null>(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const fetchAdvice = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/advice')
      if (!response.ok) throw new Error('Failed to fetch AI advice')
      const data = await response.json()
      setAdvice(data)
    } catch (error) {
      toast({
        title: 'Error fetching advice',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdvice()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md" display="flex" alignItems="center" gap={2}>
          AI Financial Advice
          <Button
            size="sm"
            leftIcon={<FiRefreshCw />}
            onClick={fetchAdvice}
            isLoading={loading}
            variant="ghost"
          >
            Refresh
          </Button>
        </Heading>
      </CardHeader>
      <CardBody>
        {advice ? (
          <VStack align="stretch" spacing={4}>
            <Text>{advice.summary}</Text>
            
            {advice.savingsPotential > 0 && (
              <Text fontWeight="bold" color="green.500">
                Potential Monthly Savings: {formatCurrency(advice.savingsPotential)}
              </Text>
            )}

            <List spacing={3}>
              {advice.tips.map((tip, index) => (
                <ListItem
                  key={index}
                  display="flex"
                  alignItems="flex-start"
                >
                  <ListIcon
                    as={FiCheckCircle}
                    color="green.500"
                    mt={1}
                  />
                  <Text>{tip}</Text>
                </ListItem>
              ))}
            </List>
          </VStack>
        ) : (
          <Text>Loading personalized financial advice...</Text>
        )}
      </CardBody>
    </Card>
  )
}