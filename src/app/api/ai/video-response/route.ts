import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'
import { TavusClient } from '@tavus/js'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const tavus = new TavusClient({
  apiKey: process.env.TAVUS_API_KEY,
})

export async function POST(request: NextRequest) {
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

    const { question } = await request.json()

    // First, generate a detailed response using GPT-4
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a friendly and knowledgeable financial advisor. Provide clear, concise, and actionable advice.',
        },
        { role: 'user', content: question },
      ],
      model: 'gpt-4',
    })

    const aiResponse = completion.choices[0].message.content

    if (!aiResponse) {
      throw new Error('Failed to generate AI response')
    }

    // Generate video using Tavus
    const video = await tavus.videos.create({
      script: aiResponse,
      voiceId: process.env.TAVUS_VOICE_ID, // Your pre-trained voice model ID
      config: {
        background: 'office', // or any other available background
        style: 'professional',
      },
    })

    // Wait for video processing
    let videoStatus = await tavus.videos.get(video.id)
    while (videoStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 2000))
      videoStatus = await tavus.videos.get(video.id)

      if (videoStatus.status === 'failed') {
        throw new Error('Video generation failed')
      }
    }

    return NextResponse.json({
      videoUrl: videoStatus.url,
      transcript: aiResponse,
    })
  } catch (error) {
    console.error('Error generating video response:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}