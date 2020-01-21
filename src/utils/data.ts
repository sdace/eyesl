export enum DataType {
    CURRENT_LEVEL,
    MAXIMUM_LEVEL
}

export class DataStorage {
    public static save(type: DataType, value: string): string {
        const key = type.toString();
        window.localStorage.setItem(key, value);
        return value;
    }

    public static saveSolution(mapNumber: number, value: string) {
        const key = `${mapNumber}_solution`;
        window.localStorage.setItem(key, value);
        return value;
    }

    public static load(type: DataType, defaultValue: string): string {
        const key = type.toString();
        const item = window.localStorage.getItem(key);

        if (item === null) {
            // If this item isn't defined yet, use the default value
            return this.save(type, defaultValue);
        } else {
            // Otherwise, return the saved data
            return item;
        }
    }

    public static loadSolution(mapNumber: number, defaultValue: string): string {
        const key = `${mapNumber}_solution`;
        const item = window.localStorage.getItem(key);

        if (item === null) {
            return this.saveSolution(mapNumber, defaultValue);
        } else {
            return item;
        }
    }
}
