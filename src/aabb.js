class AABB {
    constructor(a_min, a_max) {
        this.m_min = a_min;
        this.m_max = a_max;
    }

    dimentions(a_pos) {
        let min = MathUtil.addVectors([this.m_min, a_pos]);
        let max = MathUtil.addVectors([this.m_max, a_pos]);
        let dim = [min, max];

        return dim;
    }

    static againstAABB(a_dimA, a_dimB) {
        let check1 = MathUtil.reduceVectors([a_dimA[0], a_dimB[1]]);
        let check2 = MathUtil.reduceVectors([a_dimB[0], a_dimA[1]]);

        let result = new Float32Array([Math.max(check1[0], check2[0]), Math.max(check1[1], check2[1]), Math.max(check1[2], check2[2])]);

        if (result[0] < 0 && result[1] < 0 && result[2] < 0) {
            return true;
        }
        else {
            return false;
        }
    }

    static againstMouse(a_dimA, a_mouse) {
        let check1 = MathUtil.reduceVectors([a_dimA[0], a_mouse]);
        let check2 = MathUtil.reduceVectors([a_mouse, a_dimA[1]]);

        let result = new Float32Array([Math.max(check1[0], check2[0]), Math.max(check1[1], check2[1])]);

        if (result[0] < 0 && result[1] < 0) {
            return true;
        }
        else {
            return false;
        }
    }
}