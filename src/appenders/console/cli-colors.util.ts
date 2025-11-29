/** biome-ignore-all lint/suspicious/noControlCharactersInRegex: color codes */
type ColorTextFn = (text: string) => string;

const isColorAllowed = (): boolean => !process.env.NO_COLOR;
const colorIfAllowed =
    (colorFn: ColorTextFn): ColorTextFn =>
    (text: string) =>
        isColorAllowed() ? colorFn(text) : text;

export const clc = {
    bold: colorIfAllowed((text: string) => `\x1B[1m${text}\x1B[0m`),
    green: colorIfAllowed((text: string) => `\x1B[32m${text}\x1B[39m`),
    yellow: colorIfAllowed((text: string) => `\x1B[33m${text}\x1B[39m`),
    red: colorIfAllowed((text: string) => `\x1B[31m${text}\x1B[39m`),
    magentaBright: colorIfAllowed((text: string) => `\x1B[95m${text}\x1B[39m`),
    cyanBright: colorIfAllowed((text: string) => `\x1B[96m${text}\x1B[39m`),

    fatal: colorIfAllowed((text: string) => `${colors.foreground.black}${colors.background.red}${text}${colors.reset}`),
    error: colorIfAllowed(
        (text: string) => `${colors.blink}${colors.foreground.red}${text}${colors.reset}${colors.foreground.default}`
    ),
    httperror: colorIfAllowed(
        (text: string) =>
            `${colors.blink}${colors.foreground.lightRed}${text}${colors.reset}${colors.foreground.default}`
    ),
    warn: colorIfAllowed(
        (text: string) => `${colors.blink}${colors.foreground.yellow}${text}${colors.reset}${colors.foreground.default}`
    ),

    info: colorIfAllowed((text: string) => `${colors.foreground.green}${text}${colors.foreground.default}`),
    http: colorIfAllowed((text: string) => `${colors.foreground.magenta}${text}${colors.foreground.default}`),
    data: colorIfAllowed((text: string) => `${colors.foreground.blue}${text}${colors.foreground.default}`),

    verbose: colorIfAllowed((text: string) => `${colors.foreground.white}${text}${colors.foreground.default}`),
    // debug: colorIfAllowed((text: string) => `${colors.foreground.white}${text}${colors.foreground.default}`),

    trace: colorIfAllowed((text: string) => `${colors.foreground.lightGray}${text}${colors.foreground.default}`),

    // silly: colorIfAllowed((text: string) => `${colors.reset}${text}${colors.reset}`),

    context: colorIfAllowed(
        (text: string) => ` ${colors.foreground.blue}${text}${colors.reset}${colors.foreground.default}`
    ),
};
// export const yellow = colorIfAllowed((text: string) => `\x1B[38;5;3m${text}\x1B[39m`);

export const colors = {
    uncolored: (str: string) => str.replace(/\x1B\[\d+m/gi, ''),
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m', // bold
    italic: '\x1b[3m', // non-standard feature
    underscore: '\x1b[4m',
    blink: '\x1b[5m',
    reverse: '\x1b[7m',
    hidden: '\x1b[8m',

    foreground: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        crimson: '\x1b[38m',
        default: '\x1B[39m',
        lightGray: '\x1b[90m',
        lightRed: '\x1b[91m',
        lightGreen: '\x1b[92m',
        lightYellow: '\x1b[93m',
        lightBlue: '\x1b[94m',
        lightMagenta: '\x1b[95m',
        lightCyan: '\x1b[96m',
        lightWhite: '\x1b[97m',
    },

    background: {
        black: '\x1b[40m',
        red: '\x1b[41m',
        green: '\x1b[42m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        crimson: '\x1b[48m',
    },
};
