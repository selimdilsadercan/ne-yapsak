"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";

interface FormValues {
  title: string;
  description: string;
}

function CreatePlanDialog() {
  const [open, setOpen] = useState(false);
  const create = useMutation(api.plans.create);

  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: ""
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await create({
        title: data.title,
        description: data.description
      });
      setOpen(false);
      form.reset();
      toast.success("Plan created successfully!");
    } catch (error) {
      console.error("Failed to create plan:", error);
      toast.error("Failed to create plan. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Plan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plan title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter plan description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Create Plan
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export { CreatePlanDialog };
