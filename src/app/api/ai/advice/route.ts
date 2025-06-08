import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function GET() {
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

    // Get user's expenses for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const expenses = await prisma.expense.findMany({
      where: {
        userId: user.id,
        date: {
          gte: thirtyDaysAgo,
        },
      },
    })

    // Prepare expense summary for AI analysis
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const categorySummary = expenses.reduce((acc: any, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    }, {})

    // Generate AI analysis
    const prompt = `As a financial advisor, analyze this 30-day expense data:
    Total Spent: $${totalSpent}
    Breakdown by Category:
    ${Object.entries(categorySummary)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join('\n')}

    Please provide:
    1. A brief summary of spending patterns
    2. Three specific, actionable tips for saving money
    3. Estimated monthly savings potential

    Format the response as JSON with fields: summary, tips (array), and savingsPotential (number)
    `

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
      response_format: { type: 'json_object' },
    })

    const advice = JSON.parse(completion.choices[0].message.content || '{}')

    return NextResponse.json({
      summary: advice.summary,
      tips: advice.tips,
      savingsPotential: advice.savingsPotential,
    })
  } catch (error) {
    console.error('Error generating AI advice:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}