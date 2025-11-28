import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-rapicredit-primary text-white hover:bg-rapicredit-primary-hover shadow-lg",
        destructive: "bg-rapicredit-error text-white hover:bg-red-600",
        outline: "border-2 border-rapicredit-primary text-rapicredit-primary bg-transparent hover:bg-rapicredit-primary hover:text-white",
        secondary: "bg-rapicredit-secondary text-white hover:bg-rapicredit-secondary-hover",
        ghost: "hover:bg-rapicredit-100 hover:text-rapicredit-900",
        link: "text-rapicredit-primary underline-offset-4 hover:underline",
        white: "bg-white text-rapicredit-primary hover:bg-rapicredit-50 shadow-lg border",
        "outline-white": "border-2 border-white text-white bg-transparent hover:bg-white hover:text-rapicredit-primary",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-3xl px-3",
        lg: "h-12 rounded-3xl px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }