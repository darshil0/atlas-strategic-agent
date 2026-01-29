import React from "react";
import {
  A2UIElement,
  A2UIComponentType,
  AGUIEvent,
} from "../../lib/adk/protocol";

interface A2UIRendererProps {
  elements: A2UIElement[];
  onEvent: (event: AGUIEvent) => void;
}
type Props = Record<string, unknown>;
interface ListItem { icon?: string; label?: string }
interface ChartData { value: number; label: string }

export const A2UIRenderer: React.FC<A2UIRendererProps> = ({
  elements,
  onEvent,
}) => {
  const renderElement = (element: A2UIElement) => {
    const { id, type, props } = element;

    const handleAction = (action: string, data?: Props) => {
      onEvent({
        elementId: id,
        action,
        data,
        timestamp: Date.now(),
      });
    };

    switch (type) {
      case A2UIComponentType.TEXT:
        return (
          <p
            key={id}
            className={
              (props.className as string) || "text-slate-300" + " text-sm"
            }
          >
            {props.text as string}
          </p>
        );

      case A2UIComponentType.BUTTON:
        return (
          <button
            key={id}
            onClick={() => handleAction("click", props.actionData as Props)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 active:scale-95 ${props.variant === "primary"
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20"
                : "glass glass-hover text-slate-300"
              } ${props.className || ""}`}
          >
            {props.label as string}
          </button>
        );

      case A2UIComponentType.CARD:
        return (
          <div
            key={id}
            className={`p-5 rounded-2xl glass ${(props.className as string) || ""}`}
          >
            {(props.title as string) && (
              <h3 className="font-display text-sm font-black text-white uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                {props.title as string}
              </h3>
            )}
            {element.children && (
              <div className="space-y-4">
                {element.children.map((child) => renderElement(child))}
              </div>
            )}
          </div>
        );

      case A2UIComponentType.PROGRESS:
        return (
          <div key={id} className="w-full space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <span>{props.label as string}</span>
              <span>{props.value as number}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${props.value as number}%` }}
              ></div>
            </div>
          </div>
        );

      case A2UIComponentType.INPUT:
        return (
          <div key={id} className="space-y-1.5 w-full">
            {(props.label as string) && (
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                {props.label as string}
              </label>
            )}
            <input
              type={(props.inputType as string) || "text"}
              placeholder={props.placeholder as string}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600 transition-colors"
              onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                handleAction("input_blur", { value: e.target.value })
              }
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter")
                  handleAction("input_submit", {
                    value: (e.target as HTMLInputElement).value,
                  });
              }}
            />
          </div>
        );

      case A2UIComponentType.LIST:
        return (
          <ul key={id} className="space-y-2">
            {(props.items as ListItem[])?.map((item, idx: number) => (
              <li
                key={`${id}_${idx}`}
                className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => handleAction("item_click", item)}
              >
                {item.icon && (
                  <span className="text-blue-500">{item.icon}</span>
                )}
                <span className="text-xs font-semibold text-slate-300">
                  {item.label || String(item)}
                </span>
              </li>
            ))}
          </ul>
        );

      case A2UIComponentType.CHART:
        return (
          <div
            key={id}
            className={`p-5 rounded-2xl glass ${props.className || ""}`}
          >
            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-6">
              {(props.title as string) || "Data Analysis"}
            </h4>
            <div className="flex items-end gap-3 h-32">
              {(props.data as ChartData[])?.map((val, idx: number) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-3 group"
                >
                  <div
                    className="w-full bg-blue-500/10 border-t-2 border-blue-500/50 rounded-t-lg group-hover:bg-blue-500/20 group-hover:border-blue-500 transition-all duration-500 shimmer"
                    style={{
                      height: `${(val.value / ((props.maxValue as number) || 100)) * 100}%`,
                    }}
                  ></div>
                  <span className="text-[9px] font-bold text-slate-600 group-hover:text-slate-400 font-mono">
                    {val.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      case A2UIComponentType.CHECKBOX:
        return (
          <div
            key={id}
            className="flex items-center gap-3 p-2 group cursor-pointer"
            onClick={() => handleAction("toggle", { checked: !props.checked })}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${props.checked ? "bg-blue-600 border-blue-500" : "border-slate-700 bg-slate-950 group-hover:border-slate-500"}`}
            >
              {(props.checked as boolean) && (
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={`text-sm ${props.checked ? "text-slate-300" : "text-slate-500 group-hover:text-slate-400"}`}
            >
              {props.label as string}
            </span>
          </div>
        );

      case A2UIComponentType.SELECT:
        return (
          <div key={id} className="space-y-1.5 w-full">
            {(props.label as string) && (
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                {props.label as string}
              </label>
            )}
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600 appearance-none"
              value={
                props.value as string | number | readonly string[] | undefined
              }
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                handleAction("select_change", { value: e.target.value })
              }
            >
              {(props.options as { value: string; label: string }[])?.map(
                (opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ),
              )}
            </select>
          </div>
        );

      default:
        return (
          <div key={id} className="text-xs text-slate-600 italic px-2">
            Unknown component type: {type}
          </div>
        );
    }
  };

  return <div className="space-y-4">{elements.map(renderElement)}</div>;
};
