'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  Box,
  Text,
  Select,
  VStack,
} from '@chakra-ui/react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

type ExpenseSummary = {
  category: string
  total: number
}

type MonthlyData = {
  day: string
  amount: number
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#FF6B6B',
]

export function MonthlyReport() {
  const [categoryData, setCategoryData] = useState<ExpenseSummary[]>([])
  const [dailyData, setDailyData] = useState<MonthlyData[]>([])
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  )

  useEffect(() => {
    fetchMonthlyData()
  }, [selectedMonth])

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch(
        `/api/expenses/report?month=${selectedMonth}`
      )
      if (!response.ok) throw new Error('Failed to fetch report data')
      const data = await response.json()
      setCategoryData(data.byCategory)
      setDailyData(data.byDay)
    } catch (error) {
      console.error('Error fetching report data:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const getMonthOptions = () => {
    const options = []
    const today = new Date()
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const value = date.toISOString().slice(0, 7)
      const label = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
      options.push({ value, label })
    }
    return options
  }

  return (
    <Card>
      <CardHeader>
        <VStack align="stretch" spacing={4}>
          <Heading size="md">Monthly Report</Heading>
          <Select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {getMonthOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </VStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6}>
          <Box w="100%" h="300px">
            <Text mb={2} fontWeight="bold">
              Expenses by Category
            </Text>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }) =>
                    `${category} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Box w="100%" h="300px">
            <Text mb={2} fontWeight="bold">
              Daily Spending Trend
            </Text>
            <ResponsiveContainer>
              <BarChart data={dailyData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Spending" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}