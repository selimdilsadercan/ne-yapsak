import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { toast } from "react-hot-toast";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  iconName: z.string().min(1, "Icon is required"),
  contentType: z.string().min(1, "Content type is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface AddActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddActivityDialog({ open, onOpenChange }: AddActivityDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      iconName: "",
      contentType: "",
      description: "",
      imageUrl: ""
    }
  });

  const addActivity = useMutation(api.activities.add);

  async function onSubmit(values: FormValues) {
    try {
      await addActivity(values);
      toast.success("Activity added successfully");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to add activity");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Activity name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Bir Şeyler İzlemek">Bir Şeyler İzlemek</SelectItem>
                      <SelectItem value="Bir Şeyler Oynamak">Bir Şeyler Oynamak</SelectItem>
                      <SelectItem value="Bir Etkinliğe Gitmek">Bir Etkinliğe Gitmek</SelectItem>
                      <SelectItem value="Bir Yere Gitmek">Bir Yere Gitmek</SelectItem>
                      <SelectItem value="Sosyal ve Eğlenceli Aktiviteler">Sosyal ve Eğlenceli Aktiviteler</SelectItem>
                      <SelectItem value="Hobiler ve Kendine Zaman Ayırma">Hobiler ve Kendine Zaman Ayırma</SelectItem>
                      <SelectItem value="Dış Mekan Aktiviteleri">Dış Mekan Aktiviteleri</SelectItem>
                      <SelectItem value="Kendi Kendine Yapılabilecek Aktiviteler">Kendi Kendine Yapılabilecek Aktiviteler</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Icon name (e.g., Film, Tv, Gamepad2)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="series">Series</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="place">Place</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Activity description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Activity</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
