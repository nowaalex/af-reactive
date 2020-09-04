
const plugins = [
    [ "@babel/plugin-proposal-class-properties", { loose: true }],
    [ "@babel/plugin-proposal-object-rest-spread", { loose: true, useBuiltIns: true }]
];

module.exports = api => {

    const presetEnvOptions = { loose: true };

    if( !api.env( "test" ) ){
        presetEnvOptions.modules = false;
        plugins.push([ "@babel/plugin-transform-runtime", { useESModules: true }]);
    }

    return {
        plugins,
        presets: [
            [ "@babel/preset-env", presetEnvOptions ]
        ]
    };
};