"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Coins, CheckCircle, CreditCard, Sparkles } from "lucide-react";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price_cents: number;
  price_display: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

function BillingContent() {
  const searchParams = useSearchParams();
  const { user, token, refreshUser } = useAuth();
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast.success("Payment successful! Credits have been added to your account.");
      refreshUser();
    }
    if (searchParams.get("cancelled")) {
      toast.info("Payment cancelled.");
    }
  }, [searchParams, refreshUser]);

  useEffect(() => {
    Promise.all([
      api.getPacks(),
      token ? api.getBalance(token) : Promise.resolve({ credits: 0, transactions: [] }),
    ]).then(([packsData, balanceData]) => {
      setPacks(packsData);
      setTransactions(balanceData.transactions);
    }).finally(() => setLoading(false));
  }, [token]);

  const handleCheckout = async (packId: string) => {
    if (!token) return;
    setCheckoutLoading(packId);
    try {
      const { checkout_url } = await api.createCheckout(packId, token);
      window.location.assign(checkout_url);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Failed to create checkout");
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Credits</h1>
        <p className="text-muted-foreground mt-1">Manage your credits and purchase history</p>
      </div>

      {/* Balance */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <Coins className="h-12 w-12 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-4xl font-bold">{user?.credits ?? 0} <span className="text-lg font-normal text-muted-foreground">credits</span></p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Packs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packs.map((pack) => {
            const perCredit = (pack.price_cents / pack.credits / 100).toFixed(2);
            const isPopular = pack.id === "value";
            return (
              <Card key={pack.id} className={`relative ${isPopular ? "border-primary shadow-lg" : ""}`}>
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Sparkles className="mr-1 h-3 w-3" />Best Value
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{pack.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{pack.price_display}</span>
                  </div>
                  <CardDescription>
                    {pack.credits} credits (${perCredit}/CV)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm mb-4">
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />{pack.credits} CV generations</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Free cover letters</li>
                    <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" />Never expire</li>
                  </ul>
                  <Button
                    className="w-full"
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => handleCheckout(pack.id)}
                    disabled={checkoutLoading === pack.id}
                  >
                    {checkoutLoading === pack.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Purchase
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{t.type}</Badge>
                      </TableCell>
                      <TableCell className={t.amount > 0 ? "text-green-600" : "text-red-600"}>
                        {t.amount > 0 ? "+" : ""}{t.amount}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />}>
      <BillingContent />
    </Suspense>
  );
}
