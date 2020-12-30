const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const sync = require("browser-sync").create();

const styles = () => {
    return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(sourcemap.write(".")) // точка означает положить в этуже папку
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles; // обозначаем задачу, и присваиваем ей написанную функцию

// задачи по Server
// ПРИ ОШИБКЕ CANNOT GET, значит в папке source нет индексного файла

const server = (done) => {
    sync.init({
        server: {
            baseDir: 'source'
        },
        cors: true,
        notify: false, // Отключаем уведомления
        online: true, // Нужно отключить, при отсутствии интернета
        ui: false
    });
    done();
}

exports.server = server;

// Настраиваем "наблюдатели" Watcher
const watcher = () => {
    gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
    gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, server, watcher
);
