//ASCII Mini Golf for Terminal Jam Reboot by Jere Koivisto May / 2020

function main() {
    app.execute();
    window.requestAnimationFrame(main);
}



const g_cnv = document.getElementById("cnv");
const g_cnv_bounds = g_cnv.getBoundingClientRect();

const s_basic_vertex = FileUtil.fileToString("res/shd/basic.vs");
const s_basic_fragment = FileUtil.fileToString("res/shd/basic.fs");

const s_screen_vertex = FileUtil.fileToString("res/shd/screen.vs");
const s_screen_fragment = FileUtil.fileToString("res/shd/screen.fs");

const s_title_vertex = FileUtil.fileToString("res/shd/title.vs");
const s_title_fragment = FileUtil.fileToString("res/shd/title.fs");

const s_game_vertex = FileUtil.fileToString("res/shd/game.vs");
const s_game_fragment = FileUtil.fileToString("res/shd/game.fs");

const gl = g_cnv.getContext("webgl2");

const input = new Input();

const app = new Application(new Layer_splash);

main();