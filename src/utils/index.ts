
export function stringToBoolean(str: string | null): boolean {
    if (!str) return false;
    return ["true", "1", "yes"].includes(str.trim().toLowerCase());
}

export function booleanToString(bool: boolean | null): string {
    if (!bool) return false.toString();
    return bool.toString();
}

