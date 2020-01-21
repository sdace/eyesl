import Program from "./nodes/program";
import Tokenizer from "./tokenizer";

export default class Language {
    public static parse(program: string): Program {
        const tokenizer = new Tokenizer(program);
        return new Program(tokenizer);
    }
}
