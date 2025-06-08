'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  Text,
  Badge,
} from '@chakra-ui/react'
import { FiTrash2 } from 'react-icons/fi'

type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: string
}

type ExpenseListProps = {
  refresh?: boolean
}

export function ExpenseList({ refresh }: ExpenseListProps) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses')
      if (!response.ok) throw new Error('Failed to fetch expenses')
      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      toast({
        title: 'Error fetching expenses',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [refresh])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete expense')

      setExpenses(expenses.filter(expense => expense.id !== id))
      toast({
        title: 'Expense deleted successfully',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      toast({
        title: 'Error deleting expense',
        description: error instanceof Error ? error.message : 'Unknown error',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (loading) {
    return <Text>Loading expenses...</Text>
  }

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Recent Expenses</Heading>
      </CardHeader>
      <CardBody>
        {expenses.length === 0 ? (
          <Text>No expenses recorded yet.</Text>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Description</Th>
                  <Th isNumeric>Amount</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {expenses.map((expense) => (
                  <Tr key={expense.id}>
                    <Td>{formatDate(expense.date)}</Td>
                    <Td>
                      <Badge colorScheme="blue">{expense.category}</Badge>
                    </Td>
                    <Td>{expense.description || '-'}</Td>
                    <Td isNumeric>{formatAmount(expense.amount)}</Td>
                    <Td>
                      <IconButton
                        aria-label="Delete expense"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDelete(expense.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </CardBody>
    </Card>
  )
}