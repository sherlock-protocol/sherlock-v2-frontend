export const onlyAscii = (str: string): boolean => /^[\\x00-\x7F]*$/.test(str)

export const hasSpaces = (str: string): boolean => str.indexOf(" ") >= 0
