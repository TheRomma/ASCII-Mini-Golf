class Application {
    constructor(a_layer, a_cnv) {
        this.m_layer = a_layer;
        this.m_prevTime = new Date();
    }

    execute() {
        let delta = this.calculateDt();

        let now = this.m_layer;
        this.m_layer = this.m_layer.update(delta);
        if (this.m_layer == now) {
            this.m_layer.draw();
        }

        
    }

    calculateDt() {
        let time = new Date();
        let dt = time - this.m_prevTime;
        this.m_prevTime = time;
        return dt / 1000;
    }
}