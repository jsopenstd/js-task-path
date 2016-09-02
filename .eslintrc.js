module.exports = {
    extends : [
        'eslint:all'
    ],
    globals : {
        'define': true,
        'module': true,
        'require' : true,
        'console' : true,

        // typed arrays
        'Int8Array' : true,
        'Uint8Array' : true,
        'Uint8ClampedArray' : true,
        'Int16Array' : true,
        'Uint16Array' : true,
        'Int32Array' : true,
        'Uint32Array' : true,
        'Float32Array' : true,
        'Float64Array' : true
    },
    'parserOptions': {
        'ecmaVersion': 6
    },
    rules : {
        'strict': 'off',
        'padded-blocks': 'off',
        'func-names': 'off',
        'no-var' : 'off',
        'sort-vars' : 'off',
        'no-multi-spaces': 'off',
        'init-declarations': 'off',
        'prefer-arrow-callback' : 'off',
        'func-style': 'off',
        'no-plusplus': 'off',
        'no-continue': 'off',
        'no-prototype-builtins': 'off',
        'vars-on-top': 'error',
        'prefer-reflect': 'off',
        'space-unary-ops': 'off',
        'key-spacing' : 'off',
        'callback-return' : 'off',
        'no-implicit-coercion' : 'off',
        'no-negated-condition' : 'off',
        'guard-for-in' : 'off',
        'no-lonely-if' : 'off',
        'no-self-compare': 'off',
        'no-inline-comments' : 'off',
        'lines-around-comment' : 'off',
        'no-underscore-dangle': 'off',
        'no-unused-expressions': 'off',
        'one-var': 'off',
        'indent': 'off',
        'arrow-body-style' : 'off',
        'wrap-regex' : 'off',
        'sort-keys': 'off',
        'consistent-return' : 'off',
        'no-param-reassign' : 'off',
        'no-use-before-define' : 'off',
        'valid-jsdoc' : 'off',
        'no-console': [
            'error', {
                allow: [
                    'warn',
                    'error'
                ]
            }
        ],
        'new-cap': [
            'error', {
                'newIsCap': false,
                'capIsNew': true,
            }
        ],
        'comma-dangle' : [
            'error', 'always-multiline'
        ],
        'max-params': [
            'error', 5
        ],
        'max-lines': [
            'error', {
                'max' : 999,
                'skipBlankLines' : true,
                'skipComments' : true
            }
        ],
        'quote-props': [
            'error',
            'as-needed', {
                'keywords': false
            }
        ],
        'space-in-parens': 'off',
        'id-length': [
            'error', {
                'exceptions': [
                    'i', 'j', 'p', 'n', 'x', 'y', 'w', 'h'
                ]
            }
        ],
        'linebreak-style': [
            'error', 'unix'
        ],
        'complexity': [
            'error', 50
        ],
        'max-statements': [
            'error', 40
        ],
        'max-len': [
            'error', 120, 4
        ],
        'camelcase': [
            'error', {
                'properties': 'never'
            }
        ],
        'quotes' : [
            'error', 'single', {
                'avoidEscape' : true,
                'allowTemplateLiterals' : true
            }
        ],
        'default-case': [
            'error', {
                'commentPattern' : '^skip\\sdefault'
            }
        ],
        'no-magic-numbers': [
            'error', {
                'ignore' : [-1, 0, 1, 2],
                'ignoreArrayIndexes' : true
            }
        ],
        'space-before-function-paren': [
            'error', {
                'anonymous' : 'never',
                'named' : 'never'
            }
        ],
        'prefer-const' : [
            'error', {
                'ignoreReadBeforeAssign' : true
            }
        ],
    }
};
