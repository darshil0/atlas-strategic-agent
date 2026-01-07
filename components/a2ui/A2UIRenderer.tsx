
import React from 'react';
import { A2UIElement, A2UIComponentType, AGUIEvent } from '../../lib/adk/protocol';

interface A2UIRendererProps {
    elements: A2UIElement[];
    onEvent: (event: AGUIEvent) => void;
}

export const A2UIRenderer: React.FC<A2UIRendererProps> = ({ elements, onEvent }) => {
    const renderElement = (element: A2UIElement) => {
        const { id, type, props } = element;

        const handleAction = (action: string, data?: any) => {
            onEvent({
                elementId: id,
                action,
                data,
                timestamp: Date.now()
            });
        };

        switch (type) {
            case A2UIComponentType.TEXT:
                return (
                    <p key={id} className={`text-sm ${props.className || 'text-slate-300'}`}>
                        {props.text}
                    </p>
                );

            case A2UIComponentType.BUTTON:
                return (
                    <button
                        key={id}
                        onClick={() => handleAction('click', props.actionData)}
                        className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${props.variant === 'primary'
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            } ${props.className}`}
                    >
                        {props.label}
                    </button>
                );

            case A2UIComponentType.CARD:
                return (
                    <div key={id} className={`p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm ${props.className}`}>
                        {props.title && <h3 className="text-sm font-bold text-white mb-2">{props.title}</h3>}
                        {element.children && (
                            <div className="space-y-3">
                                {element.children.map(child => renderElement(child))}
                            </div>
                        )}
                    </div>
                );

            case A2UIComponentType.PROGRESS:
                return (
                    <div key={id} className="w-full space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span>{props.label}</span>
                            <span>{props.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-500"
                                style={{ width: `${props.value}%` }}
                            ></div>
                        </div>
                    </div>
                );

            case A2UIComponentType.INPUT:
                return (
                    <div key={id} className="space-y-1.5 w-full">
                        {props.label && <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{props.label}</label>}
                        <input
                            type={props.inputType || 'text'}
                            placeholder={props.placeholder}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600 transition-colors"
                            onBlur={(e) => handleAction('input_blur', { value: e.target.value })}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAction('input_submit', { value: (e.target as HTMLInputElement).value });
                            }}
                        />
                    </div>
                );

            case A2UIComponentType.LIST:
                return (
                    <ul key={id} className="space-y-2">
                        {props.items?.map((item: any, idx: number) => (
                            <li
                                key={`${id}_${idx}`}
                                className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/30 border border-slate-800/50 hover:border-slate-700 transition-all cursor-pointer"
                                onClick={() => handleAction('item_click', item)}
                            >
                                {item.icon && <span className="text-blue-500">{item.icon}</span>}
                                <span className="text-xs font-semibold text-slate-300">{item.label || item}</span>
                            </li>
                        ))}
                    </ul>
                );

            case A2UIComponentType.CHART:
                return (
                    <div key={id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
                        <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">{props.title || 'Data Analysis'}</h4>
                        <div className="flex items-end gap-2 h-24">
                            {props.data?.map((val: any, idx: number) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div
                                        className="w-full bg-blue-600/30 border-t-2 border-blue-500 rounded-t-sm group-hover:bg-blue-600/50 transition-all"
                                        style={{ height: `${(val.value / (props.maxValue || 100)) * 100}%` }}
                                    ></div>
                                    <span className="text-[8px] font-bold text-slate-600 group-hover:text-slate-400">{val.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case A2UIComponentType.CHECKBOX:
                return (
                    <div key={id} className="flex items-center gap-3 p-2 group cursor-pointer" onClick={() => handleAction('toggle', { checked: !props.checked })}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${props.checked ? 'bg-blue-600 border-blue-500' : 'border-slate-700 bg-slate-950 group-hover:border-slate-500'}`}>
                            {props.checked && (
                                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <span className={`text-sm ${props.checked ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-400'}`}>{props.label}</span>
                    </div>
                );

            case A2UIComponentType.SELECT:
                return (
                    <div key={id} className="space-y-1.5 w-full">
                        {props.label && <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{props.label}</label>}
                        <select
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-600 appearance-none"
                            value={props.value}
                            onChange={(e) => handleAction('select_change', { value: e.target.value })}
                        >
                            {props.options?.map((opt: any) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                );

            default:
                return <div key={id} className="text-xs text-slate-600 italic px-2">Unknown component type: {type}</div>;
        }
    };

    return (
        <div className="space-y-4">
            {elements.map(renderElement)}
        </div>
    );
};
