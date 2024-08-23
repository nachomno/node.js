// ruta del proyecto
const path= require ('path');
// exportar métodos webpack y html
const webpack=require('webpack');
const htmlWebpackPlugin=require('html-webpack-plugin');


module.exports={
    mode:'development',
    entry:'./src/cliente/js/index.js',
    output:{
        path:path.join(__dirname,'dist'),
        filename:'bundle.js'
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use: ['style-loader','css-loader']
            }
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:'./src/cliente/index.html'
        })
    ],
    resolve: {
        fallback: {
          "stream": require.resolve("stream-browserify"),
          "buffer": require.resolve("buffer/"),
          "crypto": require.resolve("crypto-browserify"),
          "vm": require.resolve("vm-browserify")
        }
      }
};