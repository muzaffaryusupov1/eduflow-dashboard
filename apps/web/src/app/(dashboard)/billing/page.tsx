import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BillingPage() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Track invoices and payments.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Once billing is connected, your invoices will appear here.
        </p>
        <Button className="w-fit" variant="outline">
          Configure billing
        </Button>
      </CardContent>
    </Card>
  )
}
