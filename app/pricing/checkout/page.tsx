import { redirect } from "next/navigation"
import Checkout from "@/components/checkout"
import { createClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS } from "@/lib/products"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === params.plan)

  if (!plan) {
    redirect("/pricing")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button asChild variant="outline">
            <Link href="/pricing">← Back to Pricing</Link>
          </Button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscribe to {plan.name}</h1>
          <p className="text-muted-foreground">{plan.description}</p>
        </div>
        <Checkout planId={plan.id} />
      </div>
    </div>
  )
}
