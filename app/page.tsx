import { Dashboard } from "@/components/dashboard"
import AuthWrapper from "@/components/auth/AuthWrapper"

export default function Home() {
  return (
    <AuthWrapper>
      <Dashboard />
    </AuthWrapper>
  )
}