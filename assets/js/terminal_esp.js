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
        '<white>BI/Ografía</white>',
        '<font color="#00ff00">Yo escribo b-I/O-grafía biografía con ‘I/O’. En otras noticias no relacionadas, nunca he ganado una competencia de deletreo.</font>',
        '<font color="#00ff00">Yo nací y crecí en Costa Rica. Me encanta la naturaleza, los deportes y la comedia.</font>',
        '<font color="#00ff00">Tengo una gran convicción de que todas las personas deben construir un futuro más sostenible con todos los medios que tengan.</font>',
        '<font color="#00ff00">Yo quiero mejorar el conocimiento actual sobre la informática para mejorar la economía mundial y la preservación de la vida y la paz.</font>',
        '<font color="#00ff00">Pura vida!</font>',
        ''
    ],

    educacion: [
        '', '<orange>Education</orange>',
        '* <a href=""><font color="#00ff00">Haga clic derecho sobre el nombre de la institución y seleccione abrir nueva ventana (Haga lo mismo para esta indicación)</font></a>',
        '* <a href="https://www.columbia.edu"><font color="#ccffff">Columbia University in the City of New York</font></a><yellow> BA Computer Science</yellow><white> 2020-2024</white>',
        '* <a href="https://www.berkeleycr.com"><font color="#ccffff">Berkeley Academy Costa Rica</font></a><yellow> High School Diploma</yellow><white> 2016-2020</white>',
        ''
    ],
    habilidades: [
        '\n', '<orange>Lenguajes de Programación</orange>',
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
        '<orange>Bibliotecas Informáticas</orange>',
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
        '<orange>Herramientas</orange>',
        ...[
            'Docker',
            'Git',
            'Linux',
            'Eclipse',

        ].map(tool => `*<font color="#00ff00">${tool}</font>`),
        ''
    ],
    redes_sociales: [
        '',
        '<white>Redes Sociales centradas en la informática</white>',
        ...[['Haga click en el lado derecho del nombre de la red social y seleccione abrir nueva ventana (Haga lo mismo para esta indicación)', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'],
            ['Github', 'https://github.com/carloslomon'],
            ['LinkedIn', 'https://www.linkedin.com/in/calm2266/'],
            ['Medium', 'https://the-bamboozling-bits-of-carlos.medium.com'],
            ['YouTube', 'https://www.youtube.com/channel/UCEv2DXoVgewUOWWVhdKYi2A'],
            ['X', 'https://x.com/BamboozlingBit']
        ].map(([handle, link]) => `<font color="#00ff00"><a href="${link}">${handle}</a></font>`),
        ''
    ]
};


const dirs = Object.keys(directories);

function print_dirs() {
    term.echo(dirs.map(dir => `<font color="#00ff00" class="directory">${dir}</font>`).join('\n'));
}

function prompt(){
    return `<orange>${user}@${server}:</orange><font color="#00ff00">${cwd}</font>$ `
}

let desc = {
    "help": "Escribe la lista de todos los comandos disponibles.",
    "ls": "Lists all available documents in the current working directory",
    "cd": "Cambia el directorio (e.d. 'cd redes_sociales' va al directorio de redes sociales)",
    "creditos":  "Hace referencia a las bibliotecas informáticas que aparecen en esta página web.",
    "echo": "Imprime en la línea de comando las palabras que siguen después del comando echo (ej. 'echo hello world' imprime 'hello world' en la terminal)",
    "revecho": "Imprime en la línea de comando las palabras que siguen después del comando  revecho pero en reversa (ej. 'revecho hello world' imprime ‘world hello’ en la terminal)",
    "clear": "Limpia toda la terminal",
    "renderecho": "Imprime una representación de arte ascii de las palabras escritas después del comando  (eg 'renderecho hello’)"
}


commands = {
    help() {
        let tmpText = Object.entries(desc).map(([k,v])=> `${k}: ${v}`).join('\n');
        term.echo(`Lista de los comandos disponibles:\n${tmpText}`);
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
    creditos() {
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
    term.echo(render('¡Bienvenido!'))
    term.echo("Escriba 'help' en la terminal y oprima enter para aprender más sobre mi!")
    term.echo("Escriba 'ls' y oprima enter para listar todos los directorios")
    term.echo("Cuando ya elija un directorio escriba ‘cd <nombre del directorio>’ y oprima enter")
    term.echo("Subsecuentemente escribe ‘ls’ otra vez y oprima enter para ver los contenidos del directorio")
    term.echo("Para volver a la página principal escriba solo ‘cd’ y oprima enter")
}
term.on('mouseup', '.terminal-output textarea, .terminal-output input', function(e) {
    term.disable();
    return false;
});