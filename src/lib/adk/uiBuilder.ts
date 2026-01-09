import { A2UIMessage, A2UIElement, A2UIComponentType } from "./protocol";

/**
 * UIBuilder: Fluent interface for creating A2UI-compliant JSON payloads.
 */

type ComponentProps = Record<string, unknown>;

export class UIBuilder {
    private elements: A2UIElement[] = [];

    add(
        type: A2UIComponentType,
        props: ComponentProps,
        id?: string,
    ): UIBuilder {
        this.elements.push({
            id: id ?? crypto.randomUUID(),
            type,
            props,
        });
        return this;
    }

    build(version: string = "0.8"): A2UIMessage {
        return {
            version,
            elements: [...this.elements],
        };
    }
}
