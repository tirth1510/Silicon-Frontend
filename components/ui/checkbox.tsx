"use client"

import * as React from "react"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentProps<"button">, "children"> & {
    checked?: boolean | "indeterminate"
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean | "indeterminate") => void
  }
>(({ className, checked, defaultChecked, onCheckedChange, onClick, ...props }, ref) => {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const isChecked = isControlled
    ? checked === true || checked === "indeterminate"
    : uncontrolledChecked

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = !isChecked
    if (!isControlled) setUncontrolledChecked(next)
    onCheckedChange?.(next)
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checked === "indeterminate" ? "mixed" : isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      data-slot="checkbox"
      className={cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 grid place-content-center",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {isChecked ? (
        <span
          data-slot="checkbox-indicator"
          className="text-current transition-none grid place-content-center"
        >
          <CheckIcon className="size-3.5" />
        </span>
      ) : null}
    </button>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }
