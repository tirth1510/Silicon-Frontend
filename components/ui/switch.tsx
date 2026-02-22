"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentProps<"button">, "children"> & {
    checked?: boolean
    defaultChecked?: boolean
    onCheckedChange?: (checked: boolean) => void
    size?: "sm" | "default"
  }
>(({ className, checked, defaultChecked, onCheckedChange, onClick, size = "default", ...props }, ref) => {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked ?? false)
  const isControlled = checked !== undefined
  const isChecked = isControlled ? checked : uncontrolledChecked

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
      role="switch"
      aria-checked={isChecked}
      data-state={isChecked ? "checked" : "unchecked"}
      data-size={size}
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[1.15rem] data-[size=default]:w-8 data-[size=sm]:h-3.5 data-[size=sm]:w-6",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span
        data-slot="switch-thumb"
        className={cn(
          "bg-background pointer-events-none block rounded-full ring-0 transition-transform",
          "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
          "dark:group-data-[state=unchecked]/switch:bg-foreground dark:group-data-[state=checked]/switch:bg-primary-foreground",
          "group-data-[state=checked]/switch:translate-x-[calc(100%-2px)] group-data-[state=unchecked]/switch:translate-x-0"
        )}
      />
    </button>
  )
})

Switch.displayName = "Switch"

export { Switch }
