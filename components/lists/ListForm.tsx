"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  tags: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface ListFormProps {
  initialData?: Doc<"lists">;
  onSuccess?: () => void;
}

export function ListForm({ initialData, onSuccess }: ListFormProps) {
  const router = useRouter();
  const createList = useMutation(api.lists.createList);
  const updateList = useMutation(api.lists.updateList);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      tags: initialData?.tags || []
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        await updateList({
          listId: initialData._id,
          ...values
        });
        toast.success("List updated successfully");
      } else {
        await createList(values);
        toast.success("List created successfully");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/admin/lists");
      }
    } catch (error) {
      toast.error(`Failed to ${initialData ? "update" : "create"} list: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome List" {...field} />
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
                <Textarea placeholder="Write a description for your list..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">{initialData ? "Update List" : "Create List"}</Button>
        </div>
      </form>
    </Form>
  );
}
