module.exports = {
    productionSourceMap: false,

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "com.fupeijiang.onion-note-taking",
                "productName": "Onion Notetaking",
                "mac": {
                    "icon": "./public/icons/mac/icon.icns",
                    "category": "public.app-category.utilities"
                },
                "win": {
                    "icon": "./public/icons/png/256x256.png"
                },

                // "directories": {
                    // "buildResources": "public"
                // }
            },
            // chainWebpackMainProcess: (config) => {
                // Chain webpack config for electron main process only
            // },
            // chainWebpackRendererProcess: (config) => {
                // Chain webpack config for electron renderer process only (won't be applied to web builds)
            // },
            // Use this to change the entrypoint of your app's main process
            mainProcessFile: 'src/background.js',

            // Use this to change the entry point of your app's render process. default src/[main|index].[js|ts]
            rendererProcessFile: 'src/main.js',

            // Provide an array of files that, when changed, will recompile the main process and restart Electron
            // Your main process file will be added by default

            // Provide a list of arguments that Electron will be launched with during "electron:serve",
            // which can be accessed from the main process (src/background.js).
            // Note that it is ignored when --debug flag is used with "electron:serve", as you must launch Electron yourself
            // Command line args (excluding --debug, --dashboard, and --headless) are passed to Electron as well
            // mainProcessArgs: ['--arg-name', 'arg-value']
        }
    }
}