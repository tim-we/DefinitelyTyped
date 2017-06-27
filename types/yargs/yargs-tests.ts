/// <reference types="node" />

import * as yargs from 'yargs';

import * as fs from 'fs';
import * as path from 'path';

const stringVal = 'string';

// Examples taken from yargs website
// https://github.com/chevex/yargs

// With yargs, the options be just a hash!
function xup() {
    let argv = yargs.argv;

    if (argv.rif - 5 * argv.xup > 7.138) {
        console.log('Plunder more riffiwobbles!');
    } else {
        console.log('Drop the xupptumblers!');
    }
}

// And non-hyphenated options too! Just use argv._!
function nonopt() {
    let argv = yargs.argv;
    console.log('(%d,%d)', argv.x, argv.y);
    console.log(argv._);
}

// Yargs even counts your booleans!
function count() {
    let argv = yargs
        .count('verbose')
        .alias('v', 'verbose')
        .argv;

    let VERBOSE_LEVEL: number = argv.verbose;

    function WARN() { VERBOSE_LEVEL >= 0 && console.log.apply(console, arguments); }
    function INFO() { VERBOSE_LEVEL >= 1 && console.log.apply(console, arguments); }
    function DEBUG() { VERBOSE_LEVEL >= 2 && console.log.apply(console, arguments); }
}

// Tell users how to use yer options and make demands.
function divide() {
    let argv = yargs
        .usage('Usage: $0 -x [num] -y [num]')
        .demand(['x', 'y'])
        .argv;

    console.log(argv.x / argv.y);
}

// After yer demands have been met, demand more! Ask for non-hypenated arguments!
function demand_count() {
    let argv = yargs
        .demand(2)
        .demand(2, false)
        .demand(2, 2)
        .demand(2, 2, "message")
        .argv;
    console.dir(argv);
}

// EVEN MORE SHIVER ME TIMBERS!
function default_singles() {
    let argv = yargs
        .default('x', 10)
        .default('y', 10)
        .argv
        ;
    console.log(argv.x + argv.y);
}
function default_hash() {
    let argv = yargs
        .default({ x: 10, y: 10 })
        .argv
        ;
    console.log(argv.x + argv.y);
}

// And if you really want to get all descriptive about it...
function boolean_single() {
    let argv = yargs
        .boolean('v')
        .argv
        ;
    console.dir(argv.v);
    console.dir(argv._);
}
function boolean_double() {
    let argv = yargs
        .boolean(['x', 'y', 'z'])
        .argv
        ;
    console.dir([argv.x, argv.y, argv.z]);
    console.dir(argv._);
}

// Yargs is here to help you...
function line_count() {
    let argv = yargs
        .usage('Count the lines in a file.\nUsage: $0')
        .example('$0 -f', 'count the lines in the given file')
        .demand('f')
        .alias('f', 'file')
        .describe('f', 'Load a file')
        .argv
        ;
}

// Below are tests for individual methods.
// Not all methods are covered yet, and neither are all possible invocations of methods.

function Argv_parsing() {
    let argv1 = yargs.argv;
    let argv2 = yargs(['-x', '1', '-y', '2']).argv;
    let argv3 = yargs.parse(['-x', '1', '-y', '2']);
    console.log(argv1.x, argv2.x, argv3.x);
}

function Argv$options() {
    let argv1 = yargs
        .options('f', {
            alias: 'file',
            default: '/etc/passwd',
            defaultDescription: 'The /etc/passwd file',
            group: 'files',
            normalize: true,
            global: false,
            array: true,
            nargs: 3
        })
        .argv
        ;

    let argv2 = yargs
        .alias('f', 'file')
        .default('f', '/etc/passwd')
        .argv
        ;
}

function Argv$global() {
    let argv = yargs
        .global('foo')
        .global(['bar', 'baz', 'fizz', 'buzz']);
}

function Argv$group() {
    let argv = yargs
        .group('foo', 'foogroup')
        .group(['bing', 'bang', 'buzz'], 'onomatopoeia');
}

function Argv$env() {
    let argv = yargs
        .env('YARGS_PREFIX_')
        .env()
        .env(true);
}

function Argv$array() {
    let argv = yargs
        .array('foo')
        .array(['bar', 'baz']);
}

function Argv$nargs() {
    let argv = yargs
        .nargs('foo', 12)
        .nargs({ bing: 3, bang: 2, buzz: 4 });
}

function Argv$choices() {
    // example from documentation
    let argv = yargs
        .alias('i', 'ingredient')
        .describe('i', 'choose your sandwich ingredients')
        .choices('i', ['peanut-butter', 'jelly', 'banana', 'pickles'])
        .help('help')
        .argv;

    yargs
        .choices('i', [undefined, true, 'asdf', 'test'])
        .choices({
            test: [undefined, true, 'test-value']
        });
}

function command() {
    let argv = yargs
        .usage('npm <command>')
        .command('install', 'tis a mighty fine package to install')
        .command('publish', 'shiver me timbers, should you be sharing all that', yargs =>
            yargs.option('f', {
                alias: 'force',
                description: 'yar, it usually be a bad idea'
            })
                .help('help')
        )
        .command("build", "arghh, build it mate", {
            tag: {
                default: true,
                demand: true,
                description: "Tag the build, mate!"
            },
            publish: {
                default: false,
                description: "Should i publish?"
            }
        })
        .command({
            command: "test",
            describe: "test package",
            builder: {
                mateys: {
                    demand: false
                }
            },
            handler: (args: any) => {
                /* handle me mateys! */
            }
        })
        .command("test", "test mateys", {
            handler: (args: any) => {
                /* handle me mateys! */
            }
        })
        .help('help')
        .argv;

    yargs
        .command('get', 'make a get HTTP request', (yargs) => {
            return yargs.option('url', {
                alias: 'u',
                default: 'http://yargs.js.org/'
            });
        })
        .help()
        .argv;

    yargs
        .command(
        'get',
        'make a get HTTP request',
        (yargs) => {
            return yargs.option('u', {
                alias: 'url',
                describe: 'the URL to make an HTTP request to'
            });
        },
        (argv: { url: string }) => {
            console.dir(argv.url);
        }
        )
        .help()
        .argv;
}

function completion_sync() {
    let argv = yargs
        .completion('completion', (current, argv) => {
            // 'current' is the current command being completed.
            // 'argv' is the parsed arguments so far.
            // simply return an array of completions.
            return [
                'foo',
                'bar'
            ];
        })
        .argv;
}

function completion_async() {
    let argv = yargs
        .completion('completion', (current: string, argv: any, done: (completion: string[]) => void) => {
            setTimeout(() => {
                done([
                    'apple',
                    'banana'
                ]);
            }, 500);
        })
        .argv;
}

function Argv$help() {
    let argv = yargs
        .usage("$0 -operand1 number -operand2 number -operation [add|subtract]")
        .help()
        .argv;
}

function Argv$showHelpOnFail() {
    let argv = yargs
        .usage('Count the lines in a file.\nUsage: $0')
        .demand('f')
        .alias('f', 'file')
        .describe('f', 'Load a file')
        .showHelpOnFail(false, "Specify --help for available options")
        .argv;
}

function Argv$showHelp() {
    let yargs1 = yargs
        .usage("$0 -operand1 number -operand2 number -operation [add|subtract]");
    yargs1.showHelp();
}

function Argv$version() {
    let argv1 = yargs
        .version();

    let argv2 = yargs
        .version('1.0.0');

    let argv3 = yargs
        .version('1.0.0', '--version');

    let argv4 = yargs
        .version('1.0.0', '--version', 'description');

    let argv5 = yargs
        .version(() => '1.0.0', '--version', 'description');
}

function Argv$wrap() {
    let argv1 = yargs
        .wrap(null);

    let argv2 = yargs
        .wrap(yargs.terminalWidth());
}

function Argv$locale() {
    let argv = yargs
        .usage('./$0 - follow ye instructions true')
        .option('option', {
            alias: 'o',
            describe: "'tis a mighty fine option",
            demand: true
        })
        .command('run', "Arrr, ya best be knowin' what yer doin'")
        .example('$0 run foo', "shiver me timbers, here's an example for ye")
        .help('help')
        .wrap(70)
        .locale('pirate')
        .argv;
}

function Argv$epilogue() {
    let argv = yargs
        .epilogue('for more information, find our manual at http://example.com');
}

function Argv$reset() {
    let ya = yargs
        .usage('$0 command')
        .command('hello', 'hello command')
        .command('world', 'world command')
        .demand(1, 'must provide a valid command');
    let argv = yargs.argv;
    let command = argv._[0];

    if (command === 'hello') {
        ya.reset()
            .usage('$0 hello')
            .help('h')
            .example('$0 hello', 'print the hello message!')
            .argv;

        console.log('hello!');
    } else if (command === 'world') {
        ya.reset()
            .usage('$0 world')
            .help('h')
            .example('$0 world', 'print the world message!')
            .argv;

        console.log('world!');
    } else {
        ya.showHelp();
    }
}

// http://yargs.js.org/docs/#methods-commanddirdirectory-opts
function Argv$commandDir() {
    let ya = yargs
        .commandDir('.')
        .argv;
}

// http://yargs.js.org/docs/#methods-commanddirdirectory-opts
function Argv$commandDirWithOptions() {
    let ya = yargs
        .commandDir('.', {
            recurse: false,
            extensions: ['js'],
            visit: (commandObject: any, pathToFile: string, filename: string) => { },
            include: /.*\.js$/,
            exclude: /.*\.spec.js$/,
        })
        .argv;
}

function Argv$normalize() {
    let ya = yargs
        .normalize('path')
        .normalize(['user', 'group'])
        .argv;
}

// From http://yargs.js.org/docs/#methods-coercekey-fn
function Argv$coerce() {
    let ya = yargs
        .coerce('file', (arg: string) => {
            return fs.readFileSync(arg, 'utf8');
        })
        .argv;
}
function Argv$coerces() {
    let ya = yargs
        .coerce({
            date: Date.parse,
            json: JSON.parse
        })
        .argv;
}
function Argv$coerceWithKeys() {
    let ya = yargs
        .coerce(['src', 'dest'], path.resolve)
        .argv;
}

// From http://yargs.js.org/docs/#methods-failfn
function Argv$fail() {
    let ya = yargs
        .fail((msg, err) => {
            if (err) throw err; // preserve stack
            console.error('You broke it!');
            console.error(msg);
            process.exit(1);
        })
        .argv;
}

function Argv$implies() {
    let ya = yargs
        .implies('foo', 'snuh')
        .implies({
            x: 'y'
        })
        .argv;
}

function Argv$count() {
    let ya = yargs
        .count('size')
        .count(['w', 'h'])
        .argv;
}

function Argv$number() {
    let ya = yargs
        .number('n')
        .number(['width', 'height'])
        .argv;
}

function Argv$updateStrings() {
    let ya = yargs
        .command('run', 'the run command')
        .help('help')
        .updateStrings({
            'Commands:': 'My Commands -->\n'
        })
        .wrap(null)
        .argv;
}

function Argv$default() {
    let ya = yargs
        .default('random', function randomValue() {
            return Math.random() * 256;
        })
        .argv;
}

function Argv$configObject() {
    let ya = yargs
        .config({ foo: 1, bar: 2 })
        .argv;
}

function Argv$configParseFunction() {
    let ya = yargs
        .config('settings', (configPath) => {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        })
        .config('settings', 'description', (configPath) => {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        })
        .argv;
}

function Argv$helpDescriptionExplicit() {
    let ya = yargs
        .help('help', 'description', true)
        .argv;
}

function Argv$showHelpConsoleLevel() {
    yargs.showHelp("log"); // prints to stdout using console.log()
}

function Argv$getCompletion() {
    let ya = yargs
        .option('foobar', {})
        .option('foobaz', {})
        .completion()
        .getCompletion(['./test.js', '--foo'], (completions) => {
            console.log(completions);
        })
        .argv;
}

function Argv$pkgConf() {
    let ya = yargs
        .pkgConf(['key1', 'key2'], 'configFile.json')
        .argv;
}

function Argv$recommendCommands() {
    let ya = yargs
        .recommendCommands()
        .argv;
}

function Argv$showCompletionScript() {
    let ya = yargs
        .showCompletionScript()
        .argv;
}

function Argv$skipValidation() {
    let ya = yargs
        .skipValidation('arg1')
        .skipValidation(['arg2', 'arg3'])
        .argv;
}

function Argv$commandObject() {
    let ya = yargs
        .command("commandname", "description", {
            arg: ({
                alias: "string",
                array: true,
                boolean: true,
                choices: ["a", "b", "c"],
                coerce: f => JSON.stringify(f),
                config: true,
                configParser: t => t,
                count: true,
                default: "myvalue",
                defaultDescription: "description",
                demand: true,
                demandOption: true,
                desc: "desc",
                describe: "describe",
                description: "description",
                global: false,
                group: "group",
                nargs: 1,
                normalize: false,
                number: true,
                requiresArg: true,
                skipValidation: false,
                string: true,
                type: "string"
            } as yargs.Options)
        });
}

function Argv$demandCommand() {
    let ya = yargs
        .demandCommand(1)
        .demandCommand(1, 'at least 1 command required')
        .demandCommand(1, 2)
        .demandCommand(1, 2, 'at least 1 command required')
        .demandCommand(1, 2, 'at least 1 command required', 'at most 2 commands required')
        .argv;
}

function Argv$demandOption() {
    let ya = yargs
        .demandOption('a')
        .demandOption('a', 'a is required')
        .demandOption('a', true)
        .demandOption(['a', 'b'])
        .demandOption(['a', 'b'], 'a and b are required')
        .demandOption(['a', 'b'], true)
        .argv;
}

function Argv$conflicts() {
    let ya = yargs
        .conflicts('a', 'b')
        .conflicts({
            a: 'b'
        })
        .argv;
}
