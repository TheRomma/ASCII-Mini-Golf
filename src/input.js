class Input {
    constructor() {
        g_cnv.addEventListener("mousemove", (e) => {
            this.mouseX = e.clientX - g_cnv_bounds.left;
            this.mouseY = e.clientY - g_cnv_bounds.top;
        });
        g_cnv.addEventListener("mousedown", (e) => {
            this.mouse1 = true;
        });
        g_cnv.addEventListener("mouseup", (e) => {
            this.mouse1 = false;
        });
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouse1 = false;

        document.addEventListener("keydown", (e) => {
            if (e.code == "KeyW") this.KeyW = true;
            else if (e.code == "KeyA") this.KeyA = true;
            else if (e.code == "KeyS") this.KeyS = true;
            else if (e.code == "KeyD") this.KeyD = true;
            else if (e.code == "KeyR") this.KeyR = true;
        });
        document.addEventListener("keyup", (e) => {
            if (e.code == "KeyW") this.KeyW = false;
            else if (e.code == "KeyA") this.KeyA = false;
            else if (e.code == "KeyS") this.KeyS = false;
            else if (e.code == "KeyD") this.KeyD = false;
            else if (e.code == "KeyR") this.KeyR = false;
        });
        this.KeyW = false;
        this.KeyA = false;
        this.KeyS = false;
        this.KeyD = false;
        this.KeyR = false;
    }
}