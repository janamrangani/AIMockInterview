// Simple native <select> wrapper — matches the Tailwind v3 design system.
// API: <Select value onValueChange> + <SelectItem value>label</SelectItem>
// (SelectTrigger / SelectValue / SelectContent are no-ops kept for API compatibility)
import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function Select({ value, onValueChange, required, children, className }: SelectProps) {
  // Collect <SelectItem> children (from SelectContent > SelectItem nesting)
  const options = collectItems(children);

  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      required={required}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        !value && "text-muted-foreground",
        className
      )}
    >
      <option value="" disabled>
        Select a company
      </option>
      {options}
    </select>
  );
}

/** Recursively find all <SelectItem> elements and convert to <option> */
function collectItems(children: React.ReactNode): React.ReactNode[] {
  const options: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if ((child.type as { displayName?: string }).displayName === "SelectItem") {
      const { value, children: label } = child.props as { value: string; children: React.ReactNode };
      options.push(<option key={value} value={value}>{label}</option>);
    } else if ((child.props as { children?: React.ReactNode }).children) {
      options.push(...collectItems((child.props as { children: React.ReactNode }).children));
    }
  });
  return options;
}

// No-op wrappers kept so imports in pages don't break
const SelectTrigger = ({ children }: { children?: React.ReactNode; className?: string }) => <>{children}</>;
const SelectValue = ({ placeholder }: { placeholder?: string }) => <>{placeholder}</>;
const SelectContent = ({ children }: { children?: React.ReactNode }) => <>{children}</>;

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
SelectItem.displayName = "SelectItem";

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
