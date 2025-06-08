import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get('month') // Format: YYYY-MM

    if (!month) {
      return NextResponse.json({ error: 'Month parameter required' }, { status: 400 })
    }

    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)

    // Get expenses for the month
    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // Calculate expenses by category
    const byCategory = expenses.reduce((acc: any[], expense) => {
      const existingCategory = acc.find(item => item.category === expense.category)
      if (existingCategory) {
        existingCategory.total += expense.amount
      } else {
        acc.push({
          category: expense.category,
          total: expense.amount,
        })
      }
      return acc
    }, [])

    // Calculate daily spending
    const byDay = Array.from({ length: endDate.getDate() }, (_, i) => {
      const day = String(i + 1).padStart(2, '0')
      const dayExpenses = expenses.filter(expense => {
        const expenseDay = expense.date.getDate()
        return expenseDay === i + 1
      })
      return {
        day,
        amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      }
    })

    return NextResponse.json({
      byCategory,
      byDay,
      totalSpent: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}