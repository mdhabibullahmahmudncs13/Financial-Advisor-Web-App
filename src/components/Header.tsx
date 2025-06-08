'use client'

import {
  Box,
  Flex,
  Button,
  useColorMode,
  useColorModeValue,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { signOut, useSession } from 'next-auth/react'
import { FiMoon, FiSun, FiLogOut } from 'react-icons/fi'
import Image from 'next/image'

export function Header() {
  const { colorMode, toggleColorMode } = useColorMode()
  const { data: session } = useSession()
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex="sticky"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
    >
      <Flex
        px={4}
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="container.xl"
        mx="auto"
      >
        <Flex alignItems="center">
          <Text fontSize="xl" fontWeight="bold" mr={2}>
            Financial Advisor
          </Text>
          <Box
            as="a"
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/bolt-badge.svg"
              alt="Built with Bolt"
              width={80}
              height={20}
            />
          </Box>
        </Flex>

        <HStack spacing={4}>
          <Button
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          >
            <Icon as={colorMode === 'light' ? FiMoon : FiSun} />
          </Button>

          {session && (
            <Button
              onClick={() => signOut()}
              variant="ghost"
              leftIcon={<Icon as={FiLogOut} />}
            >
              Sign Out
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  )
}