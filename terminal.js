const font = 'Slant';

figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts/' });
figlet.preloadFonts([font], ready);
const greetings = ``;
const user = "guest";
let commands = {};
const server = "carloslomon.github.io";
const root = "~";
let cwd = root;
const formatter = new Intl.ListFormat('en', 
    {
        style: 'long',
        type: 'conjunction',
    }
);


let directories = {
    bio: [
        '',
        '<white>BI/Ography</white>',
        
        '<green>I put the "I/O" in BI/Ography. In other unrelated news, I never won a spelling B, or however it is written. </green>',
        '<green>I was born and raised in Costa Rica.</green>', 
        '<green>I love nature, sports, and comedy.</green>',
        '<green>I have a strong conviction that all people should strive to build a more sustainable future with whatever means they posses.</green>', 
        '<green>Thus, I want to contribute to the knowledge we have developed so far in CS to advance human endeavors and the preservation of peace and life.</green>',
        '<green>Peace Out!</green>', 
        ''

    ],

    education: [
        '', '<orange>Education</orange>',
        '* <a href="https://www.columbia.edu"><blue>Columbia University in the City of New York</blue></a><yellow> BA Computer Science</yellow><white> 2020-2024</white>',
        '* <a href="https://www.berkeleycr.com"><blue>Berkeley Academy Costa Rica</blue></a><yellow> High School Diploma</yellow><white> 2016-2020</white>',
        ''
    ],
    programming_skills: [
        '', '<orange>Programming Languages</orange>',
        ...[
            'Bash',
            'C', 
            'C++', 
            'Java', 
            'Python', 
            'R', 
            'SQL', 
            'TypeScript'
        ].map(lang => `*<blue>${lang}</blue>`),
        '',
        '<orange>Libraries</orange>',
        ...[
            'Matplotlib',
            'Node.js',
            'NumPy',
            'Pandas', 
            'PyTorch', 
            'React.js',
            'SciPy',
            'STL',
        ].map(lib => `*<blue>${lib}</blue>`),
        '',
        '<orange>Tools</orange>',
        ...[
            'Git',
            'Linux',
            'Eclipse'
        ].map(tool => `*<blue>${tool}</blue>`),
        ''
    ],
    social_handles: [
        '',
        '<white>Social Media Fixated on CS</white>',
        ...[
            ['Github', 'https://github.com/carloslomon'],
            ['LinkedIn', 'https://www.linkedin.com/in/calm2266/'],
            ['Medium', 'https://the-bamboozling-bits-of-carlos.medium.com'],
            ['YouTube', 'https://www.youtube.com/channel/UCEv2DXoVgewUOWWVhdKYi2A']
        ].map(([handle, link]) => `<yellow><a href="${link}">${handle}</a></yellow>`),
        ''
    ]
};


const dirs = Object.keys(directories);

function print_dirs() {
    term.echo(dirs.map(dir => `<red class="directory">${dir}</red>`).join('\n'));
}

function prompt(){
    return `<green>${user}@${server}:</green><blue>${cwd}</blue>$ `
}

let desc = {
    "help": "Lists available commands and a brief description",
    "ls": "Lists all available documents in the current working directory",
    "cd": "Changes directory (eg 'cd social_handles' goes to the social_handles dir, 'cd' goes to root, 'cd' goes to the current directory, 'cd ..' goes to the directory above the current directory). You can\'t use 'cd ../<dir_name>',so just use 'cd <dir_name>' from any directory!",
    "credits": "References the libraries used to make this simple web terminal.",
    "echo": "Prints the words that follow it in the terminal (eg 'echo hello world' will print hello world on the terminal)"
}


commands = {
    help() {
        let tmpText = Object.entries(desc).map(([k,v])=> `${k}: ${v}`).join('\n');
        term.echo(`List of available commands:\n${tmpText}`);
    },
    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                 print_dirs();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    this.error('Invalid directory');
                } else {
                    const dir = dirs[0];
                    this.echo(directories[dir].join('\n'));
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                    this.error('Invalid directory');
                }
            } else if (dir === '..') {
                print_dirs();
            } else {
                this.error('Invalid directory');
            }
        } else if (cwd === root) {
           print_dirs();
        } else {
            const dir = cwd.substring(2);
            this.echo(directories[dir].join('\n'));
        }
    },
    cd(dir = null) {
        if (dir === null || (dir === '..' && cwd !== root)) {
            cwd = root;
        } else if (dir.startsWith('~/') && dirs.includes(dir.substring(2))) {
            cwd = dir;
        } else if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            this.error('Wrong directory');
        }
    },
    credits() {
        // you can return string or a Promise from a command
        return [
            '',
            '<white>Referenced Libraries and Resources:</white>',
            '* <a href="https://terminal.jcubic.pl">jQuery Terminal</a>',
            '* <a href="https://github.com/patorjk/figlet.js/">Figlet.js</a>',
            '* <a href="https://github.com/jcubic/isomorphic-lolcat">Isomorphic Lolcat</a>',
            ''
        ].join('\n');
    },
    echo(...args) {
        if (args.length > 0) {
            term.echo(args.join(' '));
        }
    }
}

let term = $('#terminal').terminal(commands, {
    greetings:false,
    prompt,
    checkArity: false,

    
});

function render(text) {
    const cols = term.cols();
    return figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    });
}





function ready() {
    term.echo(render('Welcome to my website!'))
    term.echo(render("Enter 'help' in the terminal \n to learn more about me"))
    term.echo('Enter ls to get all available directories.')
    term.echo('Now, if you want to see my education enter "cd education" and enter "ls" once you are in the education directory.')
    term.echo('For more explicit instructions enter "help"')
}
