
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

            default:
                return <div key={id} className="text-xs text-slate-600">Unknown UI element: {type}</div>;
        }
    };

    return (
        <div className="space-y-4">
            {elements.map(renderElement)}
        </div>
    );
};
