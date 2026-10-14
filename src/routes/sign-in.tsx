import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const navigate = Route.useNavigate()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setIsPending(true)
    setError(null)

    try {
      const { error: authClientError } = await authClient.signIn.email({
        email,
        password,
      })

      if (authClientError) {
        setError(authClientError.message ?? 'Something went wrong')
      } else {
        await navigate({ to: '/' })
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Don't have an account?{' '}
          <Link to="/sign-up" className="underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  )
}
