import { KEYWORDS, MAGIC_DELIMITER } from './config';

export default class Tokenizer {
    private tokens: string[];

    constructor(text: string) {
        this.tokens = Tokenizer.getTokens(text);
    }

    public peekAt(index: number): string {
        return this.tokens[index];
    }

    public peek(): string {
        return this.peekAt(0);
    }

    public pop(): string {
        return this.tokens.shift() as string;
    }

    public accept(token: string): boolean {
        if (this.peek() === token) {
            this.pop();
            return true;
        } else {
            return false;
        }
    }

    public expect(token: string): void {
        const next = this.pop();
        if (next !== token) {
            throw new Error(`Unexpected token "${next}". Expected "${token}".`);
        }
    }

    public done(): boolean {
        return this.tokens.length === 0;
    }

    /**
     * Extract an array of tokens from the text.
     * @param text The raw editor text.
     */
    private static getTokens(text: string): string[] {
        // Clean up the raw text before we start tokenizing it
        let inputStream = Tokenizer.cleanRawText(text);

        // Wrap each keyword with our magic delimiter
        KEYWORDS.forEach((keyword) => {
            const regex = new RegExp(Tokenizer.escapeKeyword(keyword), 'g');
            const replacement = `${MAGIC_DELIMITER}${keyword}${MAGIC_DELIMITER}`;

            inputStream = inputStream.replace(regex, replacement);
        });

        // Split the stream by our magic delimiter, trim off the whitespace,
        // and remove any empty "tokens"
        return inputStream.split(MAGIC_DELIMITER)
            .map((token) => token.trim())
            .filter((token) => token.length > 0);
    }

    /**
     * Prepare the input string by stripping comments and empty lines.
     * @param text The raw editor text.
     */
    private static cleanRawText(text: string): string {
        return text.split('\n')
            .map((line) => line.replace(/\/\/.*$/, ''))
            .filter((line) => line.length > 0)
            .join(' ');
    }

    /**
     * Make the given keyword "RegExp-safe" by escaping reserved characters.
     * @param keyword The language keyword to escape.
     */
    private static escapeKeyword(keyword: string): string {
        return keyword.replace(/[()]/, '\\$&')
    }
}
