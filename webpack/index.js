// webpack最主要的四个核心概念为： 入口 entry， 输出 output， loader，插件 plugins 

// 1. 安装webpack npm install webpack webpack-cli --save-dev

// 2. 调整 package.json 文件，以便确保我们安装包是私有的(private)，并且移除 main 入口。（不移除也可以）

// 3. 在没有webpack的配置文件时，入口文件是当前运行文件夹下的src/index.js,输出文件是dist/main.js

// 4. 配置webpack，文件夹根目录下创建webpack.config.js (自己配置webpack)

// 5. 执行npx webpack --config webpack.config.js

/** 
6. 对css进行打包 
    1.安装style-loader和css-loader 
    2.配置config文件, 当文件的后缀是.css时，使用style-loader和css-loader进行解析
         module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                    'style-loader',
                    'css-loader'
                    ]
                }
            ]
        }
*/
/**
 * 
    7. 对图片进行打包, 引入图片， 最后将图片也打包到dist文件夹下
        1. 安装file - loader
        2. webpack.config.js中的rules添加 {
            test: /\.(png|svg|jpg|gif)$/,
            use: ['file-loader']
        }
*/
/**
 * 8. 输入， 输出， 文件
    1. 入口文件是. / src / index.js， 输出会在dist下创建一个bundle.js
    entry: './src/index.js'
    output: {
            filename: 'bundle.js'
        },
        2.
    entry: {
        app: './src/index.js',
        print: './src/con.js'
    }
    output: {
        filename: '[name].bundle.js',
        name: 入口文件的键（ app， print）,
        输出的形式与没打包之前一样
        path: path.resolve(__dirname, 'dist')
    }
 */

/**
 * 9. 添加plugins
   1. 安装 npm install--save - dev html - webpack - plugin
   2. webpack.fonfig.js中的plugins添加
   plugins：[
       // dist文件下创建一个html，绑定输出的js文件
       new HtmlWebpackPlugin({
           title: 'title'
       })
   ]
 */

/**
  * 
    10. 打包后只生成一个js文件， 当有错误时， 提示的错误并不能精确到某个文件。
    webpack.config.js中添加devtool: 'inline-source-map'
    错误提示将指出发生错误的文件以及具体的位置
  */

/**
 * 11. 代码更改重新编译, 热加载
        1. 使用观察者模式
        package.json的script中添加 "watch": "webpack --watch"
        缺点： 必须每次都刷新浏览器
        使用： npm run watch
        2. 使用webpack - dev - server(vue - cli中使用)
            a.安装插件 npm install--save - dev webpack - dev - server
            b.webpack.config.js中添加
            devServer: {
                    contentBase: './dist',
                    (或者false)
                },
            c.package.json的script中添加 "start": "webpack-dev-server --open"
            d.使用： npm start
        3. 使用 webpack - dev - middleware
            a.安装 npm install--save - dev express webpack - dev - middleware
            
            b.webpack.config.js中添加
            output: {
                    publicPath: '/' // publicPath 也会在服务器脚本用到，以确保文件资源能够在 http://localhost:端口号 下正确访问
                },

            c.设置一个node服务， 创建一个server.js
            const express = require('express');
            const webpack = require('webpack');
            const webpackDevMiddleware = require('webpack-dev-middleware');
            const app = express();
            const config = require('./webpack.config.js');
            const compiler = webpack(config);
            app.use(webpackDevMiddleware(compiler, {
                publicPath: config.output.publicPath
            }));

            // Serve the files on port 3000.
            app.listen(3000, function() {
                console.log('Example app listening on port 3000!\n');
            });

            d.package.json的script中添加 "server": "node server.js"
            
            e.npm run server
 */

/**
 * 
    12. HMR模式（ Hot Module Replacement） 启用模块热替换： 在运行时更新各种模块， 而不需完全刷新
    在webpacker - dev - server中使用
        a.修改webpack.config.js, 入口文件只有一个， devServer中添加hot: true
        b.plugins中添加 new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()
        c.在入口文件中添加需要启动模块热替换的模块
        if (module.hot) {
            module.hot.accept('./con.js', function() {
                console.log('Accepting the updated printMe module!');
                print();
            })
        }
        d.HMR 不适用于生产环境， 只在开发环境使用。
 * 
 */

/**
  * 
    13. 生产环境构建
    开发环境要求实时重新加载或者热模块替换能力的source map 和localhost serve。
    生产环境要求更小的包， 优化资源， 更少的加载时间。
    webpack配置文件应该开发环境与生产环境单独开来， 但也应该遵循不重复的原则， 保留通用配置。
    a.使用webpack - merge进行管理， 安装 npm install--save - dev webpack - merge
  */