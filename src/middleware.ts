import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/expenses/:path*',
    '/api/ai/:path*',
  ],
}