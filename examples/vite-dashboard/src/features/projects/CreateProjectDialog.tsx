import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Dialog, Field, Input, Select, Stack, Textarea, useToast } from "@meridui/react";
import { Plus } from "lucide-react";
import { REGIONS, type Region } from "../../lib/data";
import { useProjects } from "../../lib/projects-store";

interface FormValues {
  name: string;
  region: Region | "";
  description: string;
}

const DEFAULTS: FormValues = { name: "", region: "", description: "" };
const NAME_PATTERN = /^[a-z][a-z0-9-]*$/;
const SIMULATED_LATENCY_MS = 500;

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const { projects, create } = useProjects();
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: DEFAULTS });

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset(DEFAULTS);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
    const project = create({ name: values.name, region: values.region as Region, description: values.description });
    onOpenChange(false);
    toast({
      tone: "success",
      title: "Project created",
      description: `${project.name} is deploying to ${REGIONS[project.region]}.`,
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button variant="primary" leadingIcon={<Plus size={16} />}>
          New project
        </Button>
      </Dialog.Trigger>
      <Dialog.Content size="md">
        <Dialog.Title>Create project</Dialog.Title>
        <Dialog.Description>Projects isolate deployments, secrets and usage.</Dialog.Description>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack gap={5} className="dialog-form">
            <Field
              label="Name"
              required
              description="Lowercase letters, numbers and dashes."
              error={errors.name?.message}
            >
              <Input
                autoComplete="off"
                placeholder="checkout-api"
                {...register("name", {
                  required: "Give the project a name.",
                  minLength: { value: 3, message: "Use at least 3 characters." },
                  pattern: { value: NAME_PATTERN, message: "Start with a letter; use only a-z, 0-9 and dashes." },
                  validate: (v) => !projects.some((p) => p.name === v) || "A project with this name already exists.",
                })}
              />
            </Field>
            <Controller
              control={control}
              name="region"
              rules={{ required: "Pick a region." }}
              render={({ field, fieldState }) => (
                <Field label="Region" required error={fieldState.error?.message}>
                  <Select.Root value={field.value} onValueChange={field.onChange} placeholder="Choose a region">
                    <Select.Trigger ref={field.ref} onBlur={field.onBlur} />
                    <Select.Content>
                      {Object.entries(REGIONS).map(([value, label]) => (
                        <Select.Item key={value} value={value}>
                          {label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </Field>
              )}
            />
            <Field label="Description" description="Optional. Shown to teammates." error={errors.description?.message}>
              <Textarea
                rows={3}
                {...register("description", { maxLength: { value: 200, message: "Keep it under 200 characters." } })}
              />
            </Field>
          </Stack>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <Button>Cancel</Button>
            </Dialog.Close>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Create project
            </Button>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
