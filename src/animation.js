class Animation {
    constructor(a_length, a_chain) {
        this.m_timer = 0.0;
        this.m_index = 0;
        this.m_frameLength = a_length;
        this.m_swapChain = a_chain;
    }

    update(a_delta) {
        this.m_timer += a_delta;

        if (this.m_timer >= this.m_frameLength) {
            this.m_timer = 0.0;
            if (this.m_index >= this.m_swapChain.length - 1) {
                this.m_index = 0;
            }
            else {
                this.m_index++;
            }
        }
    }

    get getFrame() {
        return this.m_swapChain[this.m_index];
    }
}