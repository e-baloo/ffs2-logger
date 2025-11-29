export interface ITemplateProvider {
    getTemplate(): string;
    setTemplate(template: string): void;
}
