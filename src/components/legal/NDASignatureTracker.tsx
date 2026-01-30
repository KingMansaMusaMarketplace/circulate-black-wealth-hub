import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserPlus, 
  FileCheck, 
  Clock, 
  Eye, 
  CheckCircle, 
  XCircle,
  Send,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface NDASignature {
  id: string;
  team_member_name: string;
  team_member_email: string | null;
  role: string | null;
  nda_type: string;
  status: string;
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
  signature_method: string | null;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-muted text-muted-foreground", icon: <Clock className="h-3 w-3" /> },
  sent: { label: "Sent", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", icon: <Send className="h-3 w-3" /> },
  viewed: { label: "Viewed", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", icon: <Eye className="h-3 w-3" /> },
  signed: { label: "Signed", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", icon: <CheckCircle className="h-3 w-3" /> },
  declined: { label: "Declined", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", icon: <XCircle className="h-3 w-3" /> },
};

export function NDASignatureTracker() {
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    notes: "",
  });

  const { data: signatures, isLoading, refetch } = useQuery({
    queryKey: ["nda-signatures"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nda_signatures")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as NDASignature[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (member: typeof newMember) => {
      const { data, error } = await supabase
        .from("nda_signatures")
        .insert({
          team_member_name: member.name,
          team_member_email: member.email || null,
          role: member.role || null,
          notes: member.notes || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nda-signatures"] });
      toast.success("Team member added to tracker");
      setIsAddDialogOpen(false);
      setNewMember({ name: "", email: "", role: "", notes: "" });
    },
    onError: (error) => {
      toast.error("Failed to add team member: " + error.message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updateData: Record<string, unknown> = { status };
      
      if (status === "sent") updateData.sent_at = new Date().toISOString();
      if (status === "viewed") updateData.viewed_at = new Date().toISOString();
      if (status === "signed") updateData.signed_at = new Date().toISOString();
      
      const { error } = await supabase
        .from("nda_signatures")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nda-signatures"] });
      toast.success("Status updated");
    },
    onError: (error) => {
      toast.error("Failed to update status: " + error.message);
    },
  });

  const stats = {
    total: signatures?.length || 0,
    signed: signatures?.filter(s => s.status === "signed").length || 0,
    pending: signatures?.filter(s => s.status === "pending" || s.status === "sent" || s.status === "viewed").length || 0,
    declined: signatures?.filter(s => s.status === "declined").length || 0,
  };

  const completionRate = stats.total > 0 ? Math.round((stats.signed / stats.total) * 100) : 0;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              NDA Signature Tracker
            </CardTitle>
            <CardDescription>
              Track team member NDA completion status for IPO readiness
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member to Tracker</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Legal Name *</Label>
                    <Input
                      id="name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role / Position</Label>
                    <Input
                      id="role"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      placeholder="Lead Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newMember.notes}
                      onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                      placeholder="Any additional notes..."
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => addMutation.mutate(newMember)}
                    disabled={!newMember.name || addMutation.isPending}
                  >
                    {addMutation.isPending ? "Adding..." : "Add to Tracker"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Members</div>
          </div>
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.signed}</div>
            <div className="text-sm text-green-600 dark:text-green-500">Signed</div>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-yellow-600 dark:text-yellow-500">Pending</div>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion Rate</div>
          </div>
        </div>

        {/* Signatures Table */}
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading signatures...</div>
        ) : signatures && signatures.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Signed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signatures.map((sig) => (
                  <TableRow key={sig.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{sig.team_member_name}</div>
                        {sig.team_member_email && (
                          <div className="text-sm text-muted-foreground">{sig.team_member_email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{sig.role || "-"}</TableCell>
                    <TableCell>
                      <Badge className={`${statusConfig[sig.status]?.color} flex items-center gap-1 w-fit`}>
                        {statusConfig[sig.status]?.icon}
                        {statusConfig[sig.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {sig.sent_at ? format(new Date(sig.sent_at), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      {sig.signed_at ? format(new Date(sig.signed_at), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={sig.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ id: sig.id, status: value })}
                      >
                        <SelectTrigger className="w-[120px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="viewed">Viewed</SelectItem>
                          <SelectItem value="signed">Signed</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-lg bg-muted/30">
            <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No team members added yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Add Team Member" to start tracking NDA signatures
            </p>
          </div>
        )}

        {/* IPO Readiness Note */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-sm mb-2">📋 IPO Readiness Checklist</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• All team members must have signed NDAs before institutional due diligence</li>
            <li>• Maintain electronic copies with timestamps for audit trail</li>
            <li>• Use DocuSign or HelloSign for legally binding e-signatures</li>
            <li>• Ensure Exhibit A (Prior Inventions) is completed or marked "NONE"</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
