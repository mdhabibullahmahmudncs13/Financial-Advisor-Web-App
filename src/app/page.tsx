'use client'

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Icon,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FiPieChart, FiMessageSquare, FiVideo, FiMic } from 'react-icons/fi'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')

  const features = [
    {
      icon: FiPieChart,
      title: 'Expense Tracking',
      description: 'Log and categorize your expenses with ease. Get visual insights into your spending patterns.',
    },
    {
      icon: FiMessageSquare,
      title: 'AI Financial Tips',
      description: 'Receive personalized financial advice powered by advanced AI technology.',
    },
    {
      icon: FiVideo,
      title: 'Virtual Advisor',
      description: 'Interact with an AI-powered video advisor for personalized financial guidance.',
    },
    {
      icon: FiMic,
      title: 'Voice Input',
      description: 'Log expenses hands-free with voice recognition technology.',
    },
  ]

  return (
    <Box bg={bgColor} minH="100vh">
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} textAlign="center" mb={16}>
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
          >
            Smart Financial Advisor
          </Heading>
          <Text fontSize="xl" maxW="container.md">
            Take control of your finances with AI-powered insights, expense tracking,
            and personalized video guidance.
          </Text>
          <Button
            as={Link}
            href={session ? '/dashboard' : '/auth/signin'}
            size="lg"
            colorScheme="blue"
            px={8}
          >
            {session ? 'Go to Dashboard' : 'Get Started'}
          </Button>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {features.map((feature, index) => (
            <Card
              key={index}
              bg={cardBg}
              border="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <CardBody>
                <VStack spacing={4}>
                  <Icon as={feature.icon} boxSize={8} color="blue.500" />
                  <Heading size="md">{feature.title}</Heading>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    {feature.description}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        <Box textAlign="center" mt={16}>
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            Built with{' '}
            <Button
              as="a"
              href="https://bolt.new"
              variant="link"
              color="blue.500"
              target="_blank"
              rel="noopener noreferrer"
            >
              Bolt
            </Button>
          </Text>
        </Box>
      </Container>
    </Box>
  )
}