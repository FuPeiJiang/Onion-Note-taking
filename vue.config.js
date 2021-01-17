module.exports = {
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
                "files": [
                    "./build/**/*",
                    "./dist/**/*",
                    "./node_modules/**/*",
                    "./public/**/*",
                    "*.js"
                ],
                "directories": {
                    "buildResources": "public"
                }
            }
        }
    }
}