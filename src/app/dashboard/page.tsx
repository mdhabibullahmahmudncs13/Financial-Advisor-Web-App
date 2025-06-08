'use client'

import { useState } from 'react'
import { Box, Container, Grid, GridItem, useColorMode } from '@chakra-ui/react'
import { ExpenseForm } from '@/components/ExpenseForm'
import { ExpenseList } from '@/components/ExpenseList'
import { MonthlyReport } from '@/components/MonthlyReport'
import { AIAdvice } from '@/components/AIAdvice'
import { VirtualAdvisor } from '@/components/VirtualAdvisor'
import { Header } from '@/components/Header'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { colorMode } = useColorMode()
  const [refreshData, setRefreshData] = useState(false)

  if (status === 'loading') {
    return null
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  const handleExpenseAdded = () => {
    setRefreshData(prev => !prev)
  }

  return (
    <Box minH="100vh" bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}>
      <Header />
      <Container maxW="container.xl" py={8}>
        <Grid
          templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)' }}
          gap={6}
        >
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />
            <Box mt={6}>
              <ExpenseList refresh={refreshData} />
            </Box>
          </GridItem>
          <GridItem colSpan={1}>
            <MonthlyReport />
            <Box mt={6}>
              <AIAdvice />
            </Box>
            <Box mt={6}>
              <VirtualAdvisor />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}