const isMobile = ("ontouchstart" in document.documentElement) ? true : false;
const mousedown = (isMobile) ? "touchstart" : "mousedown";
const mouseup = (isMobile) ? "touchend" : "mouseup";
const mousemove = (isMobile) ? "touchmove" : "mousemove";

const parent = document.createElement('div');
const canvas = document.getElementById('blob');
const gravityButton = document.createElement('div');
gravityButton.innerHTML = '&#10507;';
gravityButton.style.backgroundColor = "rgb(0, 0, 0)";
gravityButton.style.textAlign = 'center';
gravityButton.style.padding = '5px';
gravityButton.style.fontWeight = 'bold';
gravityButton.style.color = '#ffffff';
gravityButton.style.height = '40px';
gravityButton.style.display = 'flex';
gravityButton.style.justifyContent = 'center';
gravityButton.style.alignItems = 'center';
gravityButton.style.width = '40px';
gravityButton.style.fontSize = '28px';
gravityButton.style.borderRadius = '10px';
gravityButton.style.position = 'absolute';
gravityButton.style.right = '15px';
gravityButton.style.bottom = '15px';
gravityButton.style.cursor = 'pointer';
gravityButton.style.opacity = '0.7';
gravityButton.style.borderRadius = '10%';
gravityButton.style.zIndex = '99999999';

if (window.screen.width > 1024) {
    canvas.setAttribute('width', `${window.screen.width - 17}`);
} else {
    canvas.setAttribute('width', `${window.screen.width}`);
}

parent.style.position = 'fixed';
parent.style.right = '0px';
parent.style.bottom = '0px';
parent.id = 'parent';
parent.style.zIndex = '999999';

if (window.screen.width < 1024) {
    parent.style.width = `${window.screen.width}px`;
} else {
    parent.style.width = `${window.screen.width - 17}px`;
}


document.body.appendChild(parent);
parent.appendChild(canvas);
// parent.appendChild(button);
parent.appendChild(gravityButton);

const blob = {
    countSplit: 0,
    jump: true,
    array: [],
    x: 0,
    y: 0,
    split: true,
    isStart: false,
    isGravityOn: false,
    quantityActiveBlobs: 0,
    dragDownTime: Date.now(),
    dragUpTime: Date.now()
};

let close = false;
let canv;

var window_focus;
window.onload = function () {
    init()

    const splitInterval = setInterval(() => {
        if (blob.countSplit === 8) {
            clearInterval(splitInterval);
            blob.split = false;
        } else {
            blobColl.split();
            blob.countSplit++;
        }

        blob.isStart = true;
    }, 400);
};

function Vector(b, d) {
    this.x = b, this.y = d, this.equal = function (e) {
        return this.x == e.getX() && this.y == e.getY()
    }, this.getX = function () {
        return this.x
    }, this.getY = function () {
        return this.y
    }, this.setX = function (e) {
        this.x = e
    }, this.setY = function (e) {
        this.y = e
    }, this.addX = function (e) {
        this.x += e
    }, this.addY = function (e) {
        this.y += e
    }, this.set = function (e) {
        this.x = e.getX(), this.y = e.getY()
    }, this.add = function (e) {
        this.x += e.getX(), this.y += e.getY()
    }, this.sub = function (e) {
        this.x -= e.getX(), this.y -= e.getY()
    }, this.dotProd = function (e) {
        return this.x * e.getX() + this.y * e.getY()
    }, this.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }, this.scale = function (e) {
        this.x *= e, this.y *= e
    }, this.toString = function () {
        return ' X: ' + this.x + ' Y: ' + this.y
    }
}

function Environment(b, d, e, g) {
    this.left = b, this.right = b + e, this.top = d, this.buttom = d + g, this.r = new Vector(0, 0), this.collision = function (k) {
        var m = !1;
        return k.getX() < this.left ? (k.setX(this.left), m = !0) : k.getX() > this.right && (k.setX(this.right), m = !0), k.getY() < this.top ? (k.setY(this.top), m = !0) : k.getY() > this.buttom && (k.setY(this.buttom), m = !0), m
    }, this.draw = function () {
    }
}

function PointMass(b, d, e) {
    this.cur = new Vector(b, d), this.prev = new Vector(b, d), this.mass = e, this.force = new Vector(0, 0), this.result = new Vector(0, 0), this.friction = 0.01, this.getXPos = function () {
        return this.cur.getX()
    }, this.getYPos = function () {
        return this.cur.getY()
    }, this.getPos = function () {
        return this.cur
    }, this.getXPrevPos = function () {
        return this.prev.getX()
    }, this.getYPrevPos = function () {
        return this.prev.getY()
    }, this.getPrevPos = function () {
        return this.prev
    }, this.addXPos = function (g) {
        this.cur.addX(g)
    }, this.addYPos = function (g) {
        this.cur.addY(g)
    }, this.setForce = function (g) {
        this.force.set(g)
    }, this.addForce = function (g) {
        this.force.add(g)
    }, this.getMass = function () {
        return this.mass
    }, this.setMass = function (g) {
        this.mass = g
    }, this.move = function (g) {
        var k, l, m, n;
        n = g * g, l = this.force.getX() / this.mass, m = this.cur.getX(), k = (2 - this.friction) * m - (1 - this.friction) * this.prev.getX() + l * n, this.prev.setX(m), this.cur.setX(k), l = this.force.getY() / this.mass, m = this.cur.getY(), k = (2 - this.friction) * m - (1 - this.friction) * this.prev.getY() + l * n, this.prev.setY(m), this.cur.setY(k)
    }, this.setFriction = function (g) {
        this.friction = g
    }, this.getVelocity = function () {
        var g, k;

        return g = this.cur.getX() - this.prev.getX(), k = this.cur.getY() - this.prev.getY(), g * g + k * k
    }, this.draw = function (g, k) {
        g.lineWidth = 2, g.fillStyle = '#000000', g.strokeStyle = '#000000', g.beginPath(), g.arc(this.cur.getX() * k, this.cur.getY() * k, 4, 0, 2 * Math.PI, !0), g.fill()
    }
}

function ConstraintY(b, d, e, g) {
    this.pointMass = b, this.y = d, this.delta = new Vector(0, 0), this.shortConst = e, this.longConst = g, this.sc = function () {
        var k;
        if (k = Math.abs(this.pointMass.getYPos() - this.y), this.delta.setY(-k), 0 != this.shortConst && k < this.shortConst) {
            var l;
            l = this.shortConst / k, this.delta.scale(l), b.getPos().sub(this.delta)
        } else if (0 != this.longConst && k > this.longConst) {
            var l;
            l = this.longConst / k, this.delta.scale(l), b.getPos().sub(this.delta)
        }
    }
}

function Joint(b, d, e, g) {
    this.pointMassA = b, this.pointMassB = d, this.delta = new Vector(0, 0), this.pointMassAPos = b.getPos(), this.pointMassBPos = d.getPos(), this.delta.set(this.pointMassBPos), this.delta.sub(this.pointMassAPos), this.shortConst = this.delta.length() * e, this.longConst = this.delta.length() * g, this.scSquared = this.shortConst * this.shortConst, this.lcSquared = this.longConst * this.longConst, this.setDist = function (k, l) {
        this.shortConst = k, this.longConst = l, this.scSquared = this.shortConst * this.shortConst, this.lcSquared = this.longConst * this.longConst
    }, this.scale = function (k) {
        this.shortConst *= k, this.longConst *= k, this.scSquared = this.shortConst * this.shortConst, this.lcSquared = this.longConst * this.longConst
    }, this.sc = function () {
        this.delta.set(this.pointMassBPos), this.delta.sub(this.pointMassAPos);
        var k = this.delta.dotProd(this.delta);
        if (0 != this.shortConst && k < this.scSquared) {
            var l;
            l = this.scSquared / (k + this.scSquared) - 0.5, this.delta.scale(l), this.pointMassAPos.sub(this.delta), this.pointMassBPos.add(this.delta)
        } else if (0 != this.longConst && k > this.lcSquared) {
            var l;
            l = this.lcSquared / (k + this.lcSquared) - 0.5, this.delta.scale(l), this.pointMassAPos.sub(this.delta), this.pointMassBPos.add(this.delta)
        }
    }
}

function Stick(b, d) {
    this.length = function (g, k) {
        var l, m;
        return l = g.getXPos() - k.getXPos(), m = g.getYPos() - k.getYPos(), Math.sqrt(l * l + m * m)
    }(b, d), this.lengthSquared = this.length * this.length, this.pointMassA = b, this.pointMassB = d, this.delta = new Vector(0, 0), this.getPointMassA = function () {
        return this.pointMassA
    }, this.getPointMassB = function () {
        return this.pointMassB
    }, this.scale = function (g) {
        this.length *= g, this.lengthSquared = this.length * this.length
    }, this.sc = function () {
        var k, l, m, n;
        m = this.pointMassA.getPos(), n = this.pointMassB.getPos(), this.delta.set(n), this.delta.sub(m), k = this.delta.dotProd(this.delta), l = this.lengthSquared / (k + this.lengthSquared) - 0.5, this.delta.scale(l), m.sub(this.delta), n.add(this.delta)
    }, this.setForce = function (g) {
        this.pointMassA.setForce(g), this.pointMassB.setForce(g)
    }, this.addForce = function (g) {
        this.pointMassA.addForce(g), this.pointMassB.addForce(g)
    }, this.move = function (g) {
        this.pointMassA.move(g), this.pointMassB.move(g)
    }, this.draw = function (g, k) {
        this.pointMassA.draw(g, k), this.pointMassB.draw(g, k), g.lineWidth = 3, g.fillStyle = '#000000', g.strokeStyle = '#000000', g.beginPath(), g.moveTo(this.pointMassA.getXPos() * k, this.pointMassA.getYPos() * k), g.lineTo(this.pointMassB.getXPos() * k, this.pointMassB.getYPos() * k), g.stroke()
    }
}

function Spring(b, d, e, g, k) {
    this.restLength = b, this.stiffness = d, this.damper = e, this.pointMassA = g, this.pointMassB = k, this.tmp = Vector(0, 0), this.sc = function (l) {
        l.collistion(this.pointMassA.getPos(), this.pointMassA.getPrevPos()), l.collistion(this.pointMassB.getPos(), this.pointMassB.getPrevPos())
    }, this.move = function (l) {
        var m, n, o, q;
        m = this.pointMassA.getXPos() - this.pointMassB.getXPos(), n = this.pointMassA.getYPos() - this.pointMassB.getYPos(), q = Math.sqrt(m * m + n * n), o = this.stiffness * (q / this.restLength - 1);
        var r, s, u;
        r = this.pointMassA.getXVel() - this.pointMassB.getXVel(), s = this.pointMassA.getYVel() - this.pointMassB.getYVel(), u = r * m + s * n, u *= this.damper;
        var z, A;
        z = (o + u) * m, A = (o + u) * n, this.tmp.setX(-z), this.tmp.setY(-ft), this.pointMassA.addForce(this.tmp), this.tmp.setX(z), this.tmp.setY(ft), this.pointMassB.addForce(this.tmp), this.pointMassA.move(l), this.pointMassB.move(l)
    }, this.addForce = function (l) {
        this.pointMassA.addForce(l), this.pointMassB.addForce(l)
    }, this.draw = function (l, m) {
        this.pointMassA.draw(l, m), this.pointMassB.draw(l, m), l.fillStyle = '#000000', l.strokeStyle = '#000000', l.beginPath(), l.moveTo(this.pointMassA.getXPos() * m, this.pointMassA.getYPos() * m), l.lineTo(this.pointMassB.getXPos() * m, this.pointMassB.getXPos() * m), l.stroke()
    }
}

function Blob(b, d, e, g) {
    function k(s, u) {
        return s += u, s % u
    }

    this.x = b, this.y = d, this.sticks = [], this.pointMasses = [], this.joints = [], this.middlePointMass, this.radius = e, this.drawFaceStyle = 1, this.drawEyeStyle = 1, this.selected = !1, g = 8;
    var m = 0.95, n = 1.05, o, q, r;
    for (q = 0, o = 0; q < g; q++) this.pointMasses[q] = new PointMass(Math.cos(o) * e + b, Math.sin(o) * e + d, 1), o += 2 * Math.PI / g;
    for (this.middlePointMass = new PointMass(b, d, 1), this.pointMasses[0].setMass(4), this.pointMasses[1].setMass(4), q = 0; q < g; q++) this.sticks[q] = new Stick(this.pointMasses[q], this.pointMasses[k(q + 1, g)]);
    for (q = 0, r = 0; q < g; q++) this.joints[r++] = new Joint(this.pointMasses[q], this.pointMasses[k(q + g / 2 + 1, g)], m, n), this.joints[r++] = new Joint(this.pointMasses[q], this.middlePointMass, 0.9 * n, 1.1 * m);
    this.addBlob = function (s) {
        var u = this.joints.length, z;
        this.joints[u] = new Joint(this.middlePointMass, s.getMiddlePointMass(), 0, 0), z = this.radius + s.getRadius(), this.joints[u].setDist(0.95 * z, 0)
    }, this.getMiddlePointMass = function () {
        return this.middlePointMass
    }, this.getRadius = function () {
        return this.radius
    }, this.getXPos = function () {
        return this.middlePointMass.getXPos()
    }, this.getYPos = function () {
        return this.middlePointMass.getYPos()
    }, this.scale = function (s) {
        var u;
        for (u = 0; u < this.joints.length; u++) this.joints[u].scale(s);
        for (u = 0; u < this.sticks.length; u++) this.sticks[u].scale(s);
        this.radius *= s
    }, this.move = function (s) {
        var u;
        for (u = 0; u < this.pointMasses.length; u++) this.pointMasses[u].move(s);
        this.middlePointMass.move(s)
    }, this.sc = function (s) {
        var u, z;
        for (z = 0; 4 > z; z++) {
            for (u = 0; u < this.pointMasses.length; u++) !0 == s.collision(this.pointMasses[u].getPos(), this.pointMasses[u].getPrevPos()) ? this.pointMasses[u].setFriction(0.75) : this.pointMasses[u].setFriction(0.01);
            for (u = 0; u < this.sticks.length; u++) this.sticks[u].sc(s);
            for (u = 0; u < this.joints.length; u++) this.joints[u].sc()
        }
    }, this.setForce = function (s) {
        var u;
        for (u = 0; u < this.pointMasses.length; u++) this.pointMasses[u].setForce(s);
        this.middlePointMass.setForce(s)
    }, this.addForce = function (s) {
        var u;
        for (u = 0; u < this.pointMasses.length; u++) this.pointMasses[u].addForce(s);
        this.middlePointMass.addForce(s), this.pointMasses[0].addForce(s), this.pointMasses[0].addForce(s), this.pointMasses[0].addForce(s), this.pointMasses[0].addForce(s)
    }, this.moveTo = function (s, u) {
        var z, A;
        for (A = this.middlePointMass.getPos(), s -= A.getX(s), u -= (window.pageYOffset / scaleFactor) + A.getY(u), z = 0; z < this.pointMasses.length; z++) A = this.pointMasses[z].getPos(), A.addX(s), A.addY(u);
        A = this.middlePointMass.getPos(), A.addX(s), A.addY(u)
    }, this.setSelected = function (s) {
        this.selected = s
    }, this.drawEars = function (s, u) {
        s.strokeStyle = '#000000', s.fillStyle = '#FFFFFF', s.lineWidth = 2, s.beginPath(), s.moveTo(-0.55 * this.radius * u, -0.35 * this.radius * u), s.lineTo(-0.52 * this.radius * u, -0.55 * this.radius * u), s.lineTo(-0.45 * this.radius * u, -0.4 * this.radius * u), s.fill(), s.stroke(), s.beginPath(), s.moveTo(0.55 * this.radius * u, -0.35 * this.radius * u), s.lineTo(0.52 * this.radius * u, -0.55 * this.radius * u), s.lineTo(0.45 * this.radius * u, -0.4 * this.radius * u), s.fill(), s.stroke()
    }, this.drawHappyEyes1 = function (s, u) {
        s.lineWidth = 1, s.fillStyle = '#FFFFFF', s.beginPath(), s.arc(-0.15 * this.radius * u, -0.2 * this.radius * u, 0.12 * this.radius * u, 0, 2 * Math.PI, !1), s.fill(), s.stroke(), s.beginPath(), s.arc(0.15 * this.radius * u, -0.2 * this.radius * u, 0.12 * this.radius * u, 0, 2 * Math.PI, !1), s.fill(), s.stroke(), s.fillStyle = '#000000', s.beginPath(), s.arc(-0.15 * this.radius * u, -0.17 * this.radius * u, 0.06 * this.radius * u, 0, 2 * Math.PI, !1), s.fill(), s.beginPath(), s.arc(0.15 * this.radius * u, -0.17 * this.radius * u, 0.06 * this.radius * u, 0, 2 * Math.PI, !1), s.fill()
    }, this.drawHappyEyes2 = function (s, u) {
        s.lineWidth = 1, s.fillStyle = '#FFFFFF', s.beginPath(), s.arc(-0.15 * this.radius * u, -0.2 * this.radius * u, 0.12 * this.radius * u, 0, 2 * Math.PI, !1), s.stroke(), s.beginPath(), s.arc(0.15 * this.radius * u, -0.2 * this.radius * u, 0.12 * this.radius * u, 0, 2 * Math.PI, !1), s.stroke(), s.lineWidth = 1, s.beginPath(), s.moveTo(-0.25 * this.radius * u, -0.2 * this.radius * u), s.lineTo(-0.05 * this.radius * u, -0.2 * this.radius * u), s.stroke(), s.beginPath(), s.moveTo(0.25 * this.radius * u, -0.2 * this.radius * u), s.lineTo(0.05 * this.radius * u, -0.2 * this.radius * u), s.stroke()
    }, this.drawHappyFace1 = function (s, u) {
        s.lineWidth = 2, s.strokeStyle = '#000000', s.fillStyle = '#000000', s.beginPath(), s.arc(0, 0, 0.25 * this.radius * u, 0, Math.PI, !1), s.stroke()
    }, this.drawHappyFace2 = function (s, u) {
        s.lineWidth = 2, s.strokeStyle = '#000000', s.fillStyle = '#000000', s.beginPath(), s.arc(0, 0, 0.25 * this.radius * u, 0, Math.PI, !1), s.fill()
    }, this.drawOohFace = function (s, u) {
        s.lineWidth = 2, s.strokeStyle = '#000000', s.fillStyle = '#000000', s.beginPath(), s.arc(0, 0.1 * this.radius * 400, 0.25 * this.radius * u, 0, Math.PI, !1), s.fill(), s.beginPath(), s.moveTo(-0.25 * this.radius * u, -0.3 * this.radius * u), s.lineTo(-0.05 * this.radius * u, -0.2 * this.radius * u), s.lineTo(-0.25 * this.radius * u, -0.1 * this.radius * u), s.moveTo(0.25 * this.radius * u, -0.3 * this.radius * u), s.lineTo(0.05 * this.radius * u, -0.2 * this.radius * u), s.lineTo(0.25 * this.radius * u, -0.1 * this.radius * u), s.stroke()
    }, this.drawFace = function (s, u) {
        this.drawCross(s, u);
        if (this !== blobColl.blobs[blobColl.blobs.length - 1] && blobColl.numActive !== 1) {
            1 == this.drawFaceStyle && 0.05 > Math.random() ? this.drawFaceStyle = 2 : 2 == this.drawFaceStyle && 0.1 > Math.random() && (this.drawFaceStyle = 1), 1 == this.drawEyeStyle && 0.025 > Math.random() ? this.drawEyeStyle = 2 : 2 == this.drawEyeStyle && 0.3 > Math.random() && (this.drawEyeStyle = 1), 4e-3 < this.middlePointMass.getVelocity() ? this.drawOohFace(s, u) : (1 == this.drawFaceStyle ? this.drawHappyFace1(s, u, 0, -0.3) : this.drawHappyFace2(s, u, 0, -0.3), 1 == this.drawEyeStyle ? this.drawHappyEyes1(s, u, 0, -0.3) : this.drawHappyEyes2(s, u, 0, -0.3))
        } else if (blobColl.numActive === 1) {
            1 == this.drawFaceStyle && 0.05 > Math.random() ? this.drawFaceStyle = 2 : 2 == this.drawFaceStyle && 0.1 > Math.random() && (this.drawFaceStyle = 1), 1 == this.drawEyeStyle && 0.025 > Math.random() ? this.drawEyeStyle = 2 : 2 == this.drawEyeStyle && 0.3 > Math.random() && (this.drawEyeStyle = 1), 4e-3 < this.middlePointMass.getVelocity() ? this.drawOohFace(s, u) : (1 == this.drawFaceStyle ? this.drawHappyFace1(s, u, 0, -0.3) : this.drawHappyFace2(s, u, 0, -0.3), 1 == this.drawEyeStyle ? this.drawHappyEyes1(s, u, 0, -0.3) : this.drawHappyEyes2(s, u, 0, -0.3))
        }
    }, this.getPointMass = function (s) {
        return s += this.pointMasses.length, s %= this.pointMasses.length, this.pointMasses[s]
    }, this.drawCross = function (s, u = 200) {
        if (this === blobColl.blobs[blobColl.blobs.length - 1] && blobColl.numActive !== 1) {
            s.strokeStyle = '#FF0000', s.fillStyle = '#FF0000', s.lineWidth = 4
            s.beginPath();
            s.moveTo(this.pointMasses[0].getXPos() - this.radius * 70, this.pointMasses[0].getYPos() - this.radius * 70);
            s.lineTo(this.pointMasses[0].getXPos() + this.radius * 70, this.pointMasses[0].getYPos() + this.radius * 100);
            s.moveTo(this.pointMasses[0].getXPos() + this.radius * 70, this.pointMasses[0].getYPos() - this.radius * 70);
            s.lineTo(this.pointMasses[0].getXPos() - this.radius * 70, this.pointMasses[0].getYPos() + this.radius * 100);
            s.stroke();
        }
    }, this.drawBody = function (s, u) {
        var z;
        for (s.strokeStyle = '#000000', s.fillStyle = !0 == this.selected ? '#FFCCCC' : '#FFFFFF', s.lineWidth = 5, s.beginPath(), s.moveTo(this.pointMasses[0].getXPos() * u, this.pointMasses[0].getYPos() * u), z = 0; z < this.pointMasses.length; z++) {
            var A, B, C, D, E, F, G, H, I, J, K, L;
            I = this.getPointMass(z - 1), J = this.pointMasses[z], K = this.getPointMass(z + 1), L = this.getPointMass(z + 2), E = K.getXPos(), F = K.getYPos(), G = J.getXPos(), H = J.getYPos(), A = 0.5 * G + 0.5 * E, B = 0.5 * H + 0.5 * F, C = G - I.getXPos() + E - L.getXPos(), D = H - I.getYPos() + F - L.getYPos(), A += 0.16 * C, B += 0.16 * D, A *= u, B *= u, E *= u, F *= u, s.bezierCurveTo(A, B, E, F, E, F)
        }
        s.closePath(), s.stroke(), s.fill()
    }, this.drawSimpleBody = function (s, u) {
        for (q = 0; q < this.sticks.length; q++) this.sticks[q].draw(s, u)
    }, this.draw = function (s, u, m) {
        var A, B, C;

        this.drawBody(s, u), s.strokeStyle = '#000000', s.fillStyle = '#000000', s.save(), s.translate(this.middlePointMass.getXPos() * u, (this.middlePointMass.getYPos() - 0.35 * this.radius) * u), A = new Vector(0, -1), B = new Vector(0, 0), B.set(this.pointMasses[0].getPos()), B.sub(this.middlePointMass.getPos()), C = Math.acos(B.dotProd(A) / B.length()), 0 > B.getX() ? s.rotate(-C) : s.rotate(C), this.drawFace(s, u),
            s.restore()
    }
}

let splitInterval, spitInterval2;
let x, y;

function getActiveBlobs() {
    let quantityDestroyBlobs = 0, quantity = 0;

    blobColl.blobs.forEach((i, blobIndex) => {
        if (i === null) quantityDestroyBlobs++;
        if (i !== null) quantity++;
    });

    const index = blobColl.blobs.findIndex(i => i !== null);

    return {quantity, index};
}

function BlobCollective(b, d, e, g) {
    this.maxNum = g, this.numActive = 1, this.blobs = [], this.tmpForce = new Vector(0, 0), this.selectedBlob = null, this.blobs[0] = new Blob(b, d, 0.4, 7),
        this.split = function () {
            var k, m = 0, n, o, q;

            if (this.numActive != this.maxNum) {
                for (n = this.blobs.length, k = 0; k < this.blobs.length; k++) null != this.blobs[k] && this.blobs[k].getRadius() > m ? (m = this.blobs[k].getRadius(), o = this.blobs[k]) : null == this.blobs[k] && (n = k);
                for (o.scale(0.75), q = new Blob(o.getXPos(), o.getYPos(), o.getRadius(), 8), k = 0; k < this.blobs.length; k++) null != this.blobs[k] && (this.blobs[k].addBlob(q), q.addBlob(this.blobs[k]));
                this.blobs[n] = q, this.numActive++
            }
        }, this.findSmallest = function (k) {
        var m, l = 1e3, n;
        for (n = 0; n < this.blobs.length; n++) n != k && null != this.blobs[n] && this.blobs[n].getRadius() < l && (m = n, l = this.blobs[n].getRadius());
        return m
    }, this.findClosest = function (k) {
        var m, n, o, q, l = 1e3, r, s, u;
        for (s = this.blobs[k].getMiddlePointMass(), r = 0; r < this.blobs.length; r++) r != k && null != this.blobs[r] && (u = this.blobs[r].getMiddlePointMass(), o = s.getXPos() - u.getXPos(), q = s.getYPos() - u.getYPos(), n = o * o + q * q, n < l && (l = n, m = r));
        return m
    }, this.join = function () {
        var k, l, o, q, r;
        1 == this.numActive || (k = this.findSmallest(-1), l = this.findClosest(k), o = this.blobs[k].getRadius(), q = this.blobs[l].getRadius(), r = Math.sqrt(o * o + q * q), this.blobs[k] = null, this.blobs[l].scale(0.945 * r / q), this.numActive--)
    }, this.selectBlob = function (k, l) {
        var m, o, n = 1e4, r = null;

        if (null == this.selectedBlob) {
            for (m = 0; m < this.blobs.length; m++) null != this.blobs[m] && (o = this.blobs[m].getMiddlePointMass(), aXbX = k - o.getXPos(), aYbY = l - (o.getYPos() + ((window.innerHeight - parseInt(getComputedStyle(canvas).height)) / scaleFactor + window.pageYOffset / scaleFactor)), dist = aXbX * aXbX + aYbY * aYbY, dist < n && (n = dist, dist < 0.5 * this.blobs[m].getRadius() && (this.selectedBlob = this.blobs[m], r = {
                x: aXbX,
                y: aYbY
            })));

            return null != this.selectedBlob && this.selectedBlob.setSelected(!0), r
        }
    }, this.unselectBlob = function () {
        if (blob.dragUpTime - blob.dragDownTime < 150) {
            const {quantity, index} = getActiveBlobs();

            if (this.selectedBlob === blobColl.blobs[blobColl.blobs.length - 1] && !blob.split && quantity > 1) {
                blob.quantityActiveBlobs = getActiveBlobs().quantity;

                splitInterval = setInterval(() => {
                    const {quantity, index} = getActiveBlobs();

                    if (quantity === 1) {
                        clearInterval(splitInterval)
                    } else {
                        blobColl.join();
                    }
                }, 300);
            }

            if (quantity === 1 && this.selectedBlob !== null) {
                splitInterval2 = setInterval(() => {
                    const {quantity, index} = getActiveBlobs();

                    if (quantity === blob.quantityActiveBlobs) {
                        clearInterval(splitInterval2);
                        blob.split = false;
                    } else {
                        blobColl.split();
                    }
                }, 400);
            }

            if (this.selectedBlob !== null && this.numActive !== 1) {
                1 == this.numActive || (this.numActive--)

                const index = this.blobs.findIndex(blob => blob === this.selectedBlob);
                this.blobs[index] = null;

            }
        }

        null == this.selectedBlob || (this.selectedBlob.setSelected(!1), this.selectedBlob = null)
    }, this.selectedBlobMoveTo = function (k, l) {
        null == this.selectedBlob || this.selectedBlob.moveTo(k, l)
    }, this.move = function (k) {
        var l;

        for (l = 0; l < this.blobs.length; l++) null != this.blobs[l] && this.blobs[l].move(k)
    }, this.sc = function (k) {
        var l;
        for (l = 0; l < this.blobs.length; l++) null != this.blobs[l] && this.blobs[l].sc(k);
        null != this.blobAnchor && this.blobAnchor.sc()
    }, this.setForce = function (k) {
        var l;
        for (l = 0; l < this.blobs.length; l++) if (null != this.blobs[l]) {
            if (this.blobs[l] == this.selectedBlob) {
                this.blobs[l].setForce(new Vector(0, 0));
                continue
            }
            this.blobs[l].setForce(k)
        }
    }, this.addForce = function (k) {
        var l;
        for (l = 0; l < this.blobs.length; l++) null != this.blobs[l] && this.blobs[l] != this.selectedBlob && (this.tmpForce.setX(k.getX() * (0.75 * Math.random() + 0.25)), this.tmpForce.setY(k.getY() * (0.75 * Math.random() + 0.25)), this.blobs[l].addForce(this.tmpForce))
    }, this.draw = function (k, l) {
        var m;
        for (m = 0; m < this.blobs.length; m++) null != this.blobs[m] && this.blobs[m].draw(k, l, m)
    }
}

function debug(b, d, e) {
    !0 == confirm(b) && null != d ? d() : null != e && e()
}

var env, width = 1000, height = 400, scaleFactor = 200, blobColl, gravity, stopped, savedMouseCoords = null,
    selectOffset = null;

if (window.screen.width < 1024) {
    width = window.screen.width;
    height = window.innerHeight;
    scaleFactor = width / 3;
    canvas.setAttribute('height', `${window.innerHeight}`);
    parent.style.height = `${getComputedStyle(canvas).height}px`;
} else {
    width = window.screen.width;
    height = window.innerHeight;
    canvas.setAttribute('height', `${window.innerHeight}`);
    parent.style.height = `${getComputedStyle(canvas).height}px`;
}

function update() {
    null != savedMouseCoords && null != selectOffset && blobColl.selectedBlobMoveTo(savedMouseCoords.x - selectOffset.x, savedMouseCoords.y - selectOffset.y), blobColl.sc(env);
    const {quantity, index} = getActiveBlobs();

    if (quantity > 1) {
        blobColl.move(0.05), blobColl.setForce(gravity)
    }

    if (quantity > 1) {
        if (isMobile) {
            document.body.style.overflow = 'hidden';
        }

        parent.style.pointerEvents = 'auto';
        canvas.style.pointerEvents = 'auto';
    }
    ;

    if (quantity === 1 && blob.isStart) {
        if (blobColl.blobs[index].getXPos() < width / scaleFactor - 1) {
            blobColl.blobs[index].moveTo(blobColl.blobs[index].getXPos() + 0.3, window.pageYOffset / scaleFactor + blobColl.blobs[index].getYPos());
        } else {
            if (isMobile) {
                document.body.style.overflow = 'auto';
            }

            parent.style.pointerEvents = 'none';
            canvas.style.pointerEvents = 'none';
        }

        if (blobColl.blobs[index].getYPos() < height / scaleFactor - 0.5) {
            blobColl.blobs[index].moveTo(blobColl.blobs[index].getXPos(), (window.pageYOffset / scaleFactor + blobColl.blobs[index].getYPos() + 0.2));
        }
    }
}

function draw() {
    var b = document.getElementById('blob');
    if (b && null != b.getContext) {
        var d = canv = b.getContext('2d');
        d.clearRect(0, 0, width, height), env.draw(d, scaleFactor), blobColl.draw(d, scaleFactor)
    }
}

function timeout() {
    draw(), update(), !1 == stopped && setTimeout('timeout()', 30)
}

function init() {
    function b(e) {
        return null == e && (e = window.event), null == e ? null : e.pageX || e.pageY ? {
            x: e.pageX / scaleFactor,
            y: e.pageY / scaleFactor
        } : null
    }

    var d = document.getElementById('blob');
    return null == d.getContext ? void alert('You need Firefox version 1.5 or higher for this to work, sorry.') : void (document.onkeydown = function (e) {
    }, document.addEventListener(mousedown, function (e) {
        // e.preventDefault();
        blob.dragDownTime = Date.now();
        var g;
        !0 != stopped && (g = b(e), null == g || (selectOffset = blobColl.selectBlob(g.x, g.y)))
    }, false), document.addEventListener(mouseup, function (e) {
        // e.preventDefault();
        blob.dragUpTime = Date.now();
        blobColl.unselectBlob(), savedMouseCoords = null, selectOffset = null
    }, false), document.addEventListener(mousemove, function (e) {
        // e.preventDefault();
        var g;
        !0 != stopped && null != selectOffset && (g = b(e), null == g || (blobColl.selectedBlobMoveTo(g.x - selectOffset.x, g.y - selectOffset.y), savedMouseCoords = g))
    }, false), env = new Environment(0.1, 0.2, window.screen.width / scaleFactor - 0.2, height / scaleFactor - 0.25), blobColl = new BlobCollective(window.screen.width / 2 / scaleFactor, 1, 1, 200), gravity = new Vector(0, 1), stopped = !1, timeout())
}

function stop() {
    stopped = !0
}

function start() {
    stopped = !1, timeout()
}

function toggleGravity() {
    if (0 < gravity.getY()) {
        gravity.setY(-0.5);

        setTimeout(() => {
            blobColl.addForce(new Vector(0, 0));
            gravity.setY(0)
        }, 400)
    } else {
        gravity.setY(1)
    }
}

gravityButton.addEventListener(mousedown, (e) => {
    toggleGravity();
    blob.isGravityOn = !blob.isGravityOn;

    if (blob.isGravityOn) {
        blobColl.addForce(new Vector(0, -10));
        gravityButton.style.transform = 'rotate(180deg)';
    } else {
        gravityButton.style.transform = 'rotate(0deg)';
    }
}, false);


function showIframe() {
    const div = document.getElementById('wrapper-iframe');

    div.classList.remove('disabled');

    document.body.style.overflow = 'hidden';
    document.body.setAttribute('scroll', 'no');


    var n = 0;
    const int = setInterval(function () {
        if (n >= 1) {
            n = 1;
            clearInterval(int);
        }
        n = n + 0.1;
        div.style.opacity = n;
        div.style.filter = 'alpha(opacity=' + 100 * n + ')';
    }, 30);
}

document.getElementById('js-close-modal').onclick = function () {
    var div = document.getElementById('wrapper-iframe');

    var n = 1;

    const int = setInterval(function () {
        if (n <= 0) {
            n = 0;
            clearInterval(int);
        }
        n = n - 0.1;
        div.style.opacity = n;
        div.style.filter = 'alpha(opacity=' + 100 * n + ')';
    }, 30);


    div.classList.add('disabled');

    document.body.style.overflow = 'auto';
    document.body.setAttribute('scroll', 'yes');
}