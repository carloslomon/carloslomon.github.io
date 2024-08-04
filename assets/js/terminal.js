//const chalk = require('chalk')
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
        '\n',
        '<white>BI/Ography</white>',
        '<font color="#00ff00">**I put the "I/O" in BI/Ography. In other unrelated news, I never won a spelling B, or however it is written.**\n</font>',
        '<font color="#00ff00">**I was born and raised in Costa Rica.**\n</font>', 
        '<font color="#00ff00">**I love nature, sports, and comedy.**\n</font>',
        '<font color="#00ff00">**I have a strong conviction that all people should strive to build a more sustainable future with whatever means they posses.**\n</font>', 
        '<font color="#00ff00">**I want to develop the current knowledge base about computer science to advance economic development, and the preservation of peace and life.**\n</font>',,
        '<font color="#00ff00">**Thus, I am getting my act together to hopfully make something out of all these bits of time!**\n</font>',
        '<font color="#00ff00">**Peace Out!**\n</font>'
    ],

    education: [
        '', '<orange>Education</orange>',
        '**<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><font color="#00ff00">Right click on the institution\'s name and press "open link in new tab" to access the web-link (Do the same for this instruction)!**</font> </a>\n',
        '**<a href="https://www.columbia.edu"><font color="#ccffff">Columbia University in the City of New York</font></a><yellow> BA Computer Science</yellow><white> 2020-2024</white>**\n',
        '**<a href="https://www.berkeleycr.com"><font color="#ccffff">Berkeley Academy Costa Rica</font></a><yellow> High School Diploma</yellow><white> 2016-2020</white>**\n'
    ],
    programming_skills: [
        '\n', '<orange>Programming Languages</orange>',
        ...[
            'Bash',
            'C', 
            'C++', 
            'Java', 
            'Python', 
            'R', 
            'SQL', 
            'TypeScript'
        ].map(lang => `*<font color="#00ff00">${lang}</font>`),
        '',
        '<orange>Libraries</orange>',
        ...[
            'C++ STL',
            'Matplotlib',
            'Node.js',
            'NumPy',
            'Pandas',
            'Pybullet', 
            'PyTorch', 
            'React.js',
            'SciPy',
            'C++ STL'
        ].map(lib => `*<font color="#00ff00">${lib}</font>`),
        '',
        '<orange>Tools</orange>',
        ...[
            'Docker',
            'Git',
            'Linux',
            'Eclipse',

        ].map(tool => `*<font color="#00ff00">${tool}</font>`),
        ''
    ],
    social_handles: [
        '',
        '<white>Social Media Fixated on CS</white>',
        ...[ ['**Right click on the social media name and press "open new tab" to access the web-link (Do the same for this instruction)!**', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            ['**Github**', 'https://github.com/carloslomon'],
            ['**LinkedIn**', 'https://www.linkedin.com/in/calm2266/'],
            ['**Medium**', 'https://the-bamboozling-bits-of-carlos.medium.com'],
            ['**YouTube**', 'https://www.youtube.com/channel/UCEv2DXoVgewUOWWVhdKYi2A'],
            ['**X**', 'https://x.com/BamboozlingBit']
        ].map(([handle, link]) => `<font color="#00ff00"><a href="${link}">${handle}</a></font>`),
        ''
    ]
};


const dirs = Object.keys(directories);

function print_dirs() {
    term.echo(dirs.map(dir => `<font color="#ff00ff" class="directory">${dir}</font>`).join('\n'));
}

function prompt(){
    return `<font color="#00ff00">${user}@${server}:</font><font color="#00ff00">${cwd}$</font>`
}

let desc = {
    '<font color="red">**help': 'Lists available commands and a brief description**</font>',
    '<font color="#00ff00">**ls': "Lists all available documents in the current working directory**</font>",
    '<font color="#00ffff">**cd': "Changes directory (eg 'cd social_handles' goes to the social_handles dir)**</font>",
    '<font color="#ff00ff">**credits': "References the libraries used to make this simple web terminal.**</font>",
    '<font color="#fbff71">**echo': "Prints the argument words that follow its function call in the terminal (eg 'echo hello world' will print hello world on the terminal)**</font>",
    '<font color="orange">**revecho': "Prints the argument words that follow its function call in reverse in the terminal (eg 'echo hello world' will print world hello on the terminal)**</font>",
    '<font color="#1affa7">**clear': "cleans the command line**</font>",
    '<font color="#00ffff">**renderecho': "Provides an ascii art representation of the text entered after the command (eg 'render echo hello')**</font>"
}


commands = {
    help() {
        let tmpText = Object.entries(desc).map(([k,v])=> `${k}: ${v}`).join('\n');
        term.echo(`<font color="yellow">List of available commands:</font>\n\n${tmpText}`);
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
    ,revecho(...args){
        if(args.length > 0){
            tmp = args.reverse()
            term.echo(tmp.join(' '));
        }
    }, renderecho(...args){
        if(args.length > 0){
            for(let i =0; i < args.length; i++){
                term.echo(render(args[i]))
            }
            
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
    term.echo(render('Welcome!'))
    term.echo('<font color="#00ffff">Enter "help" in the terminal to learn more about me</font>')
    term.echo('<font color="#00ffff">Enter ls to get all available directories.</font>')
    term.echo('<font color="#00ffff">For example, if you want to see my education enter "cd education" and enter "ls" once you are in the education directory.</font>')
    term.echo('<font color="#00ffff">Lastly, if you want to go back to the main directory, just write "cd" and press enter</font>')
}

term.on('mouseup', '.terminal-output textarea, .terminal-output input', function(e) {
    term.disable();
    return false;
});