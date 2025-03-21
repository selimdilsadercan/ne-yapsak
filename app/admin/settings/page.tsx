"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure system-wide settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Disable user access during maintenance</p>
              </div>
              <Switch
                onCheckedChange={(checked: boolean) => {
                  toast.success(`Maintenance mode ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new users to register</p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={(checked: boolean) => {
                  toast.success(`User registration ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Debug Mode</Label>
                <p className="text-sm text-muted-foreground">Enable detailed error logging</p>
              </div>
              <Switch
                onCheckedChange={(checked: boolean) => {
                  toast.success(`Debug mode ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Management</CardTitle>
            <CardDescription>Configure content moderation settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Moderation</Label>
                <p className="text-sm text-muted-foreground">Automatically moderate user content</p>
              </div>
              <Switch
                defaultChecked
                onCheckedChange={(checked: boolean) => {
                  toast.success(`Auto-moderation ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Generated Content</Label>
                <p className="text-sm text-muted-foreground">Allow users to create custom activities</p>
              </div>
              <Switch
                onCheckedChange={(checked: boolean) => {
                  toast.success(`User generated content ${checked ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
