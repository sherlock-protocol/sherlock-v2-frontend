export const onlyAscii = (str: string): boolean => /^[a-zA-Z0-9-_]*$/.test(str)

export const hasSpaces = (str: string): boolean => str.indexOf(" ") >= 0
