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
import type { User } from "@/lib/types/db";

function ModifyDialog({
  user,
  updateUser,
}: {
  user: User;
  updateUser: (
    userId: string,
    user: Partial<
      Pick<
        User,
        "displayName" | "gender" | "intro" | "height" | "weight" | "age"
      >
    >,
  ) => Promise<boolean>;
}) {
  const router = useRouter();
  const FormSchema = z.object({
    displayName: z.string().refine((data) => data.trim().length > 0, {
      message: "Display Name cannot be empty",
    }),
    gender: z.enum(["male", "female", "other"]),
    intro: z.string(),
    height: z.coerce.number().refine((data) => data >= 0, {
      message: "Height must be non-negative",
    }),
    weight: z.coerce.number().refine((data) => data >= 0, {
      message: "Weight must be non-negative",
    }),
    age: z.coerce.number().refine((data) => data >= 0, {
      message: "Age must be non-negative",
    }),
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: user.displayName || "",
      gender: user.gender || "other",
      intro: user.intro || "",
      height: user.height || 0,
      weight: user.weight || 0,
      age: user.age || 0,
    },
  });
  function onSubmit(data: z.infer<typeof FormSchema>) {
    updateUser(user.id, data);
    setDialogOpen(false);
    router.push("/profile");
  }
  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
      <DialogTrigger asChild>
        <div className="flex h-11 w-36 items-center rounded-md border-2 bg-zinc-100 hover:bg-zinc-200">
          <span className="mx-auto">Edit Profile</span>
        </div>
      </DialogTrigger>
      <DialogContent className="h-full max-h-[75%] w-2/3">
        <div className="m-2 flex h-full flex-col gap-0 overflow-y-auto">
          <div className="mb-2 h-fit">
            <DialogTitle>Modify Profile</DialogTitle>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="m-0 flex h-full flex-col gap-2 space-y-0 overflow-y-auto"
            >
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="w-2/5">
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">male</SelectItem>
                            <SelectItem value="female">female</SelectItem>
                            <SelectItem value="other">other</SelectItem>
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
                  name="age"
                  render={({ field }) => (
                    <FormItem className="w-2/5">
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="age"
                          required={true}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full flex-wrap gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem className="w-2/5">
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="height"
                          required={true}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="w-2/5">
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="weight"
                          required={true}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="intro"
                render={({ field }) => (
                  <FormItem className="mb-20 grow">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <div className="mb-5 h-full">
                        <textarea
                          placeholder="More about you..."
                          className="h-full w-full resize-none rounded-lg border p-2"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="">
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

export default ModifyDialog;
