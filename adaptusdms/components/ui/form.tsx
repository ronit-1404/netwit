import * as React from "react"
import { useFormContext, Controller } from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = ({ children, ...props }: any) => {
  return <form {...props}>{children}</form>
}

const FormField = ({
  control,
  name,
  render,
}: {
  control?: any
  name: string
  render: (props: {
    field: any
    fieldState: { error?: { message?: string } }
  }) => React.ReactElement
}) => {
  const formContext = useFormContext()
  const actualControl = control || formContext.control

  return (
    <Controller
      control={actualControl}
      name={name}
      render={({ field, fieldState }) => render({ field, fieldState }) as React.ReactElement}
    />
  )
}

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
FormControl.displayName = "FormControl"

const FormMessage = ({ className, fieldState, ...props }: any) => {
  if (!fieldState?.error?.message) return null
  return (
    <p className={cn("text-sm font-medium text-red-500", className)} {...props}>
      {fieldState.error.message}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }
