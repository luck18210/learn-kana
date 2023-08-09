module.exports = {
    paths: {
        watched: ['app']
    },

    files: {
        javascripts: {
            joinTo: 'app.js'
        },
        stylesheets: {
            joinTo: 'style.css'
        }
    },

    modules: {
        autoRequire: {
            'app.js': ['init']
        }
    },

    conventions: {
        ignored: [
            /_.*\..*$/,
            'test/**/*.js',
        ],
        assets: [
            /^app\/assets/,
            'app/templates/',
            'app/templates/**/*.jade'
        ],
    },

    plugins: {
        babel: {
            presets: ['es2015'],
        },
        stylus: {
            includeCss: true,
            plugins: ['autoprefixer-stylus']
        },
        eslint: {
            pattern: /^app\/.*\.js$/,
            warnOnly: true
        },
        jade: {
            staticBasedir: 'app/templates',
            noRuntime: true,
            locals: {
                require: require
            }
        }
    }
};
