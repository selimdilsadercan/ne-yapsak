"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const listTypes = ["activities", "movies", "places"] as const;

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(listTypes, {
    required_error: "Please select a list type"
  }),
  isPublic: z.boolean().default(true),
  imageUrl: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).optional()
});

type FormValues = z.infer<typeof formSchema>;

interface ListFormProps {
  initialData?: {
    _id: Id<"lists">;
    name: string;
    description?: string;
    type: string;
    isPublic: boolean;
    imageUrl?: string;
    tags?: string[];
  };
  onSuccess?: () => void;
}

export function ListForm({ initialData, onSuccess }: ListFormProps) {
  const router = useRouter();
  const createList = useMutation(api.lists.createList);
  const updateList = useMutation(api.lists.updateList);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      type: (initialData?.type as (typeof listTypes)[number]) ?? "activities",
      isPublic: initialData?.isPublic ?? true,
      imageUrl: initialData?.imageUrl ?? "",
      tags: initialData?.tags ?? []
    }
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (initialData) {
        await updateList({
          listId: initialData._id,
          ...values
        });
        toast.success("List updated successfully");
      } else {
        const listId = await createList(values);
        toast.success("List created successfully");
        router.push(`/lists/${listId}`);
      }
      onSuccess?.();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!initialData}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {listTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>This determines what kind of items can be added to the list</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" type="url" {...field} />
              </FormControl>
              <FormDescription>Provide a URL for the list cover image (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public List</FormLabel>
                <FormDescription>Make this list visible to everyone</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
