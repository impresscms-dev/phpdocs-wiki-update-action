import GeneratorInterface from "./GeneratorInterface";

export default interface ActionInterface {

    exec(generator: GeneratorInterface): void;

};