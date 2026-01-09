"use server";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/utils/roles";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@packages/ui/components/card";
import { Badge } from "@packages/ui/components/badge";
import { Avatar, AvatarFallback } from "@packages/ui/components/avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@packages/ui/components/table";

export default async function Dashboard() {
  const userIsAdmin = await isAdmin();

  if (userIsAdmin) {
    // Admin view - all customers (RLS policies grant admin full access)
    const supabase = await createClient();
    const { data: customers } = await supabase.from("customers").select("*");

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage and view all customer accounts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <CardDescription>
              {customers?.length || 0} total customer{customers?.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customers && customers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {customer.business_name?.charAt(0).toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{customer.business_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.contact_email}</TableCell>
                      <TableCell className="text-muted-foreground">{customer.contact_phone_number || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={customer.is_active ? "default" : "secondary"}>
                          {customer.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No customers yet. They will appear here once added.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Regular user view
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Your Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your personal dashboard</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>Your dashboard features are coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We're working on bringing you an amazing experience. Check back soon for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
