class Camera {
    constructor(a_proj, a_pos) {
        this.m_proj = a_proj;
        this.m_view = MathUtil.transMat(a_pos);
    }

    project(a_proj) {
        this.m_proj = a_proj;
    }

    absTranslate(a_pos) {
        this.m_view = MathUtil.transMat(a_pos);
    }

    translate(a_pos) {
        MathUtil.multiplyMatrices([this.m_view, MathUtil.transMat(a_pos)]);
    }

    get getPV() {
        return MathUtil.multiplyMatrices([this.m_proj, this.m_view]);
    }
}