# Financial Advisor Web App

A modern Next.js financial advisor application with AI-powered insights, expense tracking, and interactive video guidance.

## Features

- **Expense Tracking**
  - Log expenses with amount, category, and date
  - Voice input support for hands-free expense logging
  - Visual expense history and management

- **Monthly Reports**
  - Interactive charts and graphs
  - Category-wise spending breakdown
  - Daily spending trends

- **AI Financial Tips**
  - Personalized savings advice using OpenAI
  - Spending pattern analysis
  - Custom recommendations

- **Video Interaction**
  - AI-powered virtual advisor using Tavus
  - Interactive video responses to financial questions
  - Personalized video guidance

- **User Authentication**
  - Secure login/signup with NextAuth.js
  - Protected routes and data
  - User preferences management

- **Modern UI/UX**
  - Clean, responsive design
  - Dark/light mode support
  - Built with Chakra UI

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **UI Framework**: Chakra UI
- **Authentication**: NextAuth.js
- **Database**: SQLite with Prisma ORM
- **AI Integration**: OpenAI GPT-4
- **Video Generation**: Tavus API
- **Voice Input**: Web Speech API, ElevenLabs
- **Charts**: Recharts

## Getting Started

1. Clone the repository

```bash
git clone <repository-url>
cd financial-advisor-app
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Update the `.env.local` file with your API keys and configuration.

4. Initialize the database

```bash
npx prisma generate
npx prisma db push
```

5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Environment Variables

Make sure to set up the following environment variables in your `.env.local` file:

- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Random string for NextAuth.js
- `NEXTAUTH_JWT_SECRET`: Random string for JWT encryption
- `DATABASE_URL`: SQLite database URL
- `OPENAI_API_KEY`: OpenAI API key
- `TAVUS_API_KEY`: Tavus API key
- `TAVUS_VOICE_ID`: Tavus voice model ID
- `ELEVENLABS_API_KEY`: ElevenLabs API key (optional)

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utility functions and configurations
│   └── types/            # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── package.json          # Project dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Bolt](https://bolt.new)
- UI components from [Chakra UI](https://chakra-ui.com)
- AI capabilities powered by [OpenAI](https://openai.com)
- Video generation by [Tavus](https://tavus.io)