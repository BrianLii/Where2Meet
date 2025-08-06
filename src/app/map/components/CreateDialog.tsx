"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Event, User } from "@/lib/types/db";

export const geocode = async (address: string) => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${apiKey}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    const { results } = data;

    if (results && results.length > 0) {
      const { lat, lng } = results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    throw new Error("Geocoding failed");
  }
};

function CreateDialog({
  user,
  createEvent,
}: {
  user: User;
  createEvent: (userId: string, event: Event) => Promise<number>;
}) {
  const router = useRouter();

  const FormSchema = z
    .object({
      title: z.string().min(1),
      description: z.string(),
      type: z.enum(["public", "private"]),
      startTime: z.string().min(1),
      endTime: z.string().min(1),
      label: z.string(),
      position: z.string().min(1),
    })
    .refine(
      async (data) => {
        try {
          await geocode(data.position);
        } catch {
          return false;
        }
        return true;
      },
      {
        path: ["position"],
        message:
          "We can not get latitude and longitude from the position you provided!",
      },
    )
    .refine(
      (data) => {
        return new Date(data.startTime) <= new Date(data.endTime);
      },
      {
        path: ["startTime"],
        message: "Start Time should be earlier than End Time...",
      },
    );
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "public",
      //startTime: new Date(),
      label: "",
      position: "",
    },
  });
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { latitude, longitude } = await geocode(data.position);
    const event = {
      title: data.title,
      description: data.description,
      type: data.type,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      label: data.label,
      position: {
        lat: latitude,
        lng: longitude,
      },
    };
    const eventId = await createEvent(user.id, event);
    setDialogOpen(false);
    router.push(`/event/${eventId}`);
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="hover:bg-slate-200">
          Create event
        </Button>
      </DialogTrigger>
      <DialogContent className="h-full max-h-[75%] w-2/3">
        <div className="m-2 flex h-full flex-col gap-0 overflow-y-auto">
          <div className="mb-2 h-fit">
            <DialogTitle>Create Event</DialogTitle>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="m-0 flex h-full flex-col gap-2 space-y-0 overflow-y-auto"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full flex-wrap justify-stretch gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="public">public</SelectItem>
                            <SelectItem value="private">private</SelectItem>
                          </SelectContent>
                        </Select>
                        {/* <Input placeholder="male / female / other" {...field} /> */}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Keyword</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-wrap justify-stretch gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Description of the event</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="More about the event..."
                        className="h-full w-full resize-none rounded-lg border p-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button type="submit" className="mb-2 mt-10 w-full">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDialog;
