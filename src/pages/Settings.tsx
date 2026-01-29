import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Users,
  Mail,
  Globe,
} from "lucide-react";

export default function Settings() {
  return (
    <AppLayout title="Settings">
      <div className="max-w-4xl">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="organization" className="gap-2">
              <Building2 className="h-4 w-4" />
              Organization
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="integrations" className="gap-2">
              <Database className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@sequelstring.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Sales Manager" disabled />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="organization" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Organization Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input id="orgName" defaultValue="SequelString Technologies Pvt. Ltd." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue="Enterprise Software" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Input id="size" defaultValue="100-500 employees" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://sequelstring.com" />
                </div>
              </div>
              <Separator className="my-6" />
              <h3 className="font-semibold mb-4">Regional Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input id="currency" defaultValue="INR (₹)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="Asia/Kolkata (IST)" />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button>Save Changes</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Email Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deal Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified when deals move stages</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quote Approvals</p>
                    <p className="text-sm text-muted-foreground">Notifications for pending approvals</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Task Reminders</p>
                    <p className="text-sm text-muted-foreground">Daily digest of upcoming tasks</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Contract Renewals</p>
                    <p className="text-sm text-muted-foreground">Alerts for upcoming renewals</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reports</p>
                    <p className="text-sm text-muted-foreground">Weekly performance summary</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Password & Authentication</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
              <Separator className="my-6" />
              <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">2FA Status</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6 animate-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Connected Integrations</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Integration</p>
                      <p className="text-sm text-muted-foreground">Sync with Microsoft 365</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <Database className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">ERP Integration</p>
                      <p className="text-sm text-muted-foreground">Connect to SAP / Tally</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Key className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">API Access</p>
                      <p className="text-sm text-muted-foreground">Manage API keys</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
