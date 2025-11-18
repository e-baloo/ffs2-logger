import type { ITemplateProvider } from "../interfaces/ITemplateProvider";

export class TemplateProvider implements ITemplateProvider {
    private template = '{date} {level} {context}: {message}\n';

    getTemplate(): string {
        return this.template;
    }

    setTemplate(template: string): void {
        this.template = template;
    }
}