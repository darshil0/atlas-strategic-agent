import { A2UIMessage, A2UIElement, A2UIComponentType } from "./protocol";

/**
 * Fluent UIBuilder for creating type-safe A2UI payloads
 * Usage: new UIBuilder().card().text("Hello").button("Click").build()
 */
type ComponentProps = Record<string, unknown>;

export class UIBuilder {
  private elements: A2UIElement[] = [];

  /**
   * Add any component type with auto-generated ID
   */
  add(
    type: A2UIComponentType,
    props: ComponentProps = {},
    id?: string
  ): this {
    this.elements.push({
      id: id ?? crypto.randomUUID(),
      type,
      props: { ...props }, // Defensive copy
    });
    return this;
  }

  // === COMMON PATTERNS ===
  
  /** Quick text addition */
  text(content: string, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.TEXT, { text: content, ...props });
  }

  /** Primary action button */
  button(label: string, actionData?: unknown, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.BUTTON, {
      label,
      variant: "primary",
      actionData,
      ...props,
    });
  }

  /** Secondary/ghost button */
  secondaryButton(label: string, actionData?: unknown, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.BUTTON, {
      label,
      variant: "secondary",
      actionData,
      ...props,
    });
  }

  /** Card container with title */
  card(title?: string, props: ComponentProps = {}): this {
    const cardProps: ComponentProps = title ? { title, ...props } : props;
    this.add(A2UIComponentType.CARD, cardProps);
    return this;
  }

  /** Progress bar with percentage */
  progress(label: string, value: number, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.PROGRESS, {
      label,
      value: Math.max(0, Math.min(100, value)),
      ...props,
    });
  }

  /** Input field */
  input(label: string, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.INPUT, {
      label,
      inputType: "text",
      ...props,
    });
  }

  /** Chart with data array */
  chart(title: string, data: Array<{ label: string; value: number }>, props: ComponentProps = {}): this {
    return this.add(A2UIComponentType.CHART, {
      title,
      data,
      maxValue: Math.max(...data.map(d => d.value)),
      ...props,
    });
  }

  // === COMPOSITION HELPERS ===
  
  /** Add header with title and status */
  header(title: string, subtitle?: string): this {
    return this
      .text(title, { className: "text-xl font-bold text-slate-100 mb-2" })
      .text(subtitle || "", { className: "text-sm text-slate-400" });
  }

  /** Two-column layout */
  row(left: A2UIElement, right: A2UIElement): this {
    const rowId = crypto.randomUUID();
    return this
      .add(A2UIComponentType.CARD, {
        id: rowId,
        className: "grid grid-cols-2 gap-4 p-0",
        children: [left, right],
      });
  }

  /** Loading state */
  loading(message = "Processing..."): this {
    return this
      .text(message, { className: "text-blue-400 font-medium flex items-center gap-2" })
      .add(A2UIComponentType.PROGRESS, { label: "Progress", value: 50 });
  }

  /** Success message */
  success(message: string): this {
    return this.text(message, { 
      className: "text-emerald-400 font-bold bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30" 
    });
  }

  /** Error message */
  error(message: string): this {
    return this.text(message, { 
      className: "text-rose-400 font-bold bg-rose-500/10 p-4 rounded-xl border border-rose-500/30" 
    });
  }

  /** Clear all elements */
  clear(): this {
    this.elements = [];
    return this;
  }

  /** Build final message with immutability */
  build(version: string = "1.0"): A2UIMessage {
    return {
      version,
      elements: [...this.elements], // Immutable copy
    };
  }

  /** Debug: Log current builder state */
  debug(): this {
    if (import.meta.env.DEV) {
      console.log("[UIBuilder]", { elements: this.elements });
    }
    return this;
  }
}

// === STATIC FACTORY METHODS ===
export const ui = () => new UIBuilder();

/**
 * Usage Examples:
 * 
 * // Simple
 * ui().text("Hello").button("Click").build();
 * 
 * // Complex layout
 * ui()
 *   .card("Dashboard")
 *   .header("Q1 Progress", "18/25 tasks complete")
 *   .progress("Strategic Alignment", 72)
 *   .button("Generate Plan")
 *   .build();
 */
