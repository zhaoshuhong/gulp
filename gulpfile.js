/**
 * Created by 24596 on 2019/9/18.
 */
//引入相应插件-----------------------------------------------------------------

    //设置变量
const imageLevel = 5;                     //图片优化等级
const webpack = require('webpack');         //引入webpack
new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')             //设置默认环境变量
});
const env = process.env.NODE_ENV || 'development';                  //获取设置的环境变量
console.log('设置-----------------------------', process.env.NODE_ENV);


const gulp = require('gulp'),                       //gulp
    gulprequire = require('gulp-requirejs'),       //r.js 合并
    gulpautoprefixer = require('gulp-autoprefixer'),   //css 添加前缀      #会有警告  因为版本过高 但不影响效果
    gulpconcat = require('gulp-concat'),               //文件合并
    gulpbabel = require('gulp-babel'),               //ES6->ES5     #需要引入额外的 @babel/core @babel/preset-env
    gulphtmlmin = require('gulp-htmlmin'),               //html简化
    gulpless = require('gulp-less'),               //less编译
    jsmin = require('gulp-uglify'),                     //js简化
    cssmin = require('gulp-minify-css'),                //css简化
    rename = require('gulp-rename'),                    //文件重命名
    copy = require('gulp-copy'),                         //文件复制
    clean = require('gulp-clean'),                      //文件清除
    gulpif = require('gulp-if'),                      //判断执行
    imagemin = require('gulp-imagemin')              //图片压缩
//清空dist 文件 ---------------------------------------------------------------------------
gulp.task('clean', function () {
    return gulp.src('./dist/*')
        .pipe(clean());
});
//copy  文件  不进行编译的 文件   libs   template
// 拷贝
gulp.task('copy', function () {
    return gulp.src(['./common/libs/**/*', './common/template/**/*', './common/assets/**/*','./common/**/*.{json,xml}','./common/js/pugin/*'], {base: './common/'})
        .pipe(gulp.dest('dist/'));
});
//copy  end----------------------------------------

//任务执行------------------------------------------------------------------
// less的编译   编译less->css ->添加前缀 ->合并 -输出
gulp.task('less-build', function () {
    return gulp.src(['./common/css/initial.less','./common/css/businesstreasure/initial.less','./common/css/main.less','./common/css/businesstreasure/main.less'], {base: './common/'})
    // return gulp.src(['./common/css/index.less'], {base: './common/'})
        .pipe(gulpless())	// 编译less
        .pipe(gulpautoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,	// 是否美化
        }))
        // .pipe(gulpconcat('main.min.css'))           //合并css文件
        .pipe(gulpif(env==='production', cssmin()))    // 判断是否压缩压缩css
        .pipe(gulp.dest('./dist/'));              //编译后的路径
});
// less的编译end-------------------------------------------------------------

//图片压缩--------------------------------------------------------------------
gulp.task('Imagemin', function () {
    return gulp.src('./common/images/**/*.{png,jpg,gif,ico,svg}')
        .pipe(imagemin({
            optimizationLevel: imageLevel, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest('dist/images'));
});
//图片压缩end------------------------------------------------------------------------


//压缩html ---------------------------------------------------------------------
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        // collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        // removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        // removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        // removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        // minifyJS: true,//压缩页面JS
        // minifyCSS: true//压缩页面CSS
    };
    return gulp.src(['./common/pages/**/*.html', './common/main.html'], {base: './common/'})
        .pipe(gulphtmlmin(options))
        .pipe(gulp.dest('./dist/'));
});
//压缩html end--------------------------------------------------------------------------------------


//js部分------------------------------------------------------------------------------------------------
//1.js ES6 - > ES5
//2.js 的压缩

gulp.task('js-build', function () {
    return gulp.src('./common/js/**/*.js',{base:'./common/'})
        .pipe(gulpbabel())
        .pipe(gulpif(env==='production', jsmin()))
        // .pipe(rev())
        .pipe(gulp.dest('./dist/'))
        // .pipe(rev.manifest('rev-js-manifest.json'))
        // .pipe(gulp.dest('./dist/'));

});

//3.requirejs 优化
//4.manifest.json 设置
//5.watch


//打包执行 run
gulp.task('dist', gulp.series('clean', gulp.parallel('less-build','html', 'Imagemin', 'copy','js-build')));        //gulp 4+ 的新应用方式  series()顺序执行   parallel 并行执行
// gulp.task('dist', gulp.series('clean', gulp.parallel('less-build')));        //gulp 4+ 的新应用方式  series()顺序执行   parallel 并行执行


