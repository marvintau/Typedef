/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/Main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CanvasExtend.js":
/*!*****************************!*\
  !*** ./src/CanvasExtend.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

CanvasRenderingContext2D.prototype.lineToVec = function (vec) {
  this.lineTo(vec.x, vec.y);
};

CanvasRenderingContext2D.prototype.moveToVec = function (vec) {
  this.moveTo(vec.x, vec.y);
};

CanvasRenderingContext2D.prototype.bezierCurveTo = function (cv1, cv2, ev) {
  this.bezierCurveTo(cv1.x, cv1.y, cv2.x, cv2.y, ev.x, ev.y);
};

CanvasRenderingContext2D.prototype.point = function (v) {
  if (v != undefined) {
    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height / dpr;
    this.beginPath();
    this.arc(v.x * ratio, v.y * ratio, 3, 0, Math.PI * 2);
    this.stroke();
  }
};

CanvasRenderingContext2D.prototype.drawSegs = function (segs) {
  let dpr = window.devicePixelRatio,
      ratio = this.canvas.height / 2 / dpr;

  try {
    this.beginPath();
    this.moveToVec(segs[0].head.mult(ratio));

    for (let seg of segs) {
      this.lineToVec(seg.tail.mult(ratio));
    }

    this.stroke();
  } catch {
    console.log('Illegal line segs: ', segs);
  }
};

CanvasRenderingContext2D.prototype.drawContours = function (contours) {
  let dpr = window.devicePixelRatio,
      ratio = this.canvas.height / 2 / dpr;

  try {
    for (let contour of contours) {
      this.moveToVec(contour[0].head.mult(ratio));

      for (let seg of contour) {
        this.lineToVec(seg.tail.mult(ratio));
      }

      this.closePath();
    }
  } catch {
    console.log('Illegal line segs: ', contours);
  }
};

CanvasRenderingContext2D.prototype.text = function (text, vec) {
  if (vec != undefined) {
    let dpr = window.devicePixelRatio,
        ratio = this.canvas.height / 2 / dpr;
    this.fillText(text, vec.x * ratio, vec.y * ratio);
  }
};

CanvasRenderingContext2D.prototype.drawBound = function (vecs, num, {
  r,
  g,
  b
}) {
  let centroid = toPolyCentroid(vecs);

  if (num !== undefined) {
    this.save();
    this.fillStyle = 'rgb(128, 0, 0, 0.3)';
    this.text(num, centroid);
    this.restore();
  } else {
    this.point(centroid);
  }

  this.fillStyle = `rgba(${r * 128}, ${g}, ${b}, 0.1)`;
  this.beginPath();
  this.drawZig(vecs);
  this.closePath();
  this.fill();
};

/***/ }),

/***/ "./src/List.js":
/*!*********************!*\
  !*** ./src/List.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return List; });
// Extended JavaScript native Array class with handy methods.
class List extends Array {
  constructor(...args) {
    super(...args);
  }

  last() {
    return this[this.length - 1];
  }

  sum(sumFunc = e => e) {
    return this.reduce((acc, n) => acc + sumFunc(n), 0);
  }

  same(func = e => e) {
    return this.every((v, i, a) => func(v) === func(a[0]));
  }

  accum(accumFunc = e => e) {
    return this.reduce((acc, x) => acc.concat(acc.last() + accumFunc(x)), [0]);
  } // copy the list, and try to clone the elements if
  // a copy method exists.


  copy() {
    return this.map(e => e.copy ? e.copy() : e);
  }

  zip(func = e => e) {
    if (this[0].length && this[0].length > 0 && this.same(e => e.length)) {
      let newList = this[0].map((_e, i) => {
        return func(this.map(e => e[i]));
      });
      return new List(...newList);
    } else throw Error('Invalid array dimension for zipping');
  }

}

(() => {
  let list = new List(1, 2, 3);
  console.assert(list[0] === 1 && list.length === 3, 'List: Constructor failed');
  console.assert(list.sum(e => e * 2) === 12, 'List: sum failed');
  console.assert(list.same(e => Number.isInteger(e)), 'List: same failed');
  let listMapped = list.map(e => [e, e * 2]);
  console.assert(listMapped.zip().last().sum() == 12, 'List: zip failed');
})();

/***/ }),

/***/ "./src/Main.js":
/*!*********************!*\
  !*** ./src/Main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CanvasExtend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CanvasExtend */ "./src/CanvasExtend.js");
/* harmony import */ var _CanvasExtend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_CanvasExtend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./List */ "./src/List.js");
/* harmony import */ var _Segs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Segs */ "./src/Segs.js");
/* harmony import */ var _Poly__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Poly */ "./src/Poly.js");
/* harmony import */ var _Stroke__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Stroke */ "./src/Stroke.js");






let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    dpr = window.devicePixelRatio;
canvas.width = 400 * dpr;
canvas.height = 400 * dpr;
canvas.style.width = 400;
canvas.style.height = 400;
document.getElementById('canvas-container').appendChild(canvas);
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.scale(dpr, dpr);

function testPoly() {
  let len = 19,
      range = 5;
  let vecsCircles = new _List__WEBPACK_IMPORTED_MODULE_2__["default"](0);

  for (let r = 0; r < 6; r++) {
    let vecs = Array(len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / len * 360).mult(0.8 * (r + 1) / range));
    vecsCircles.push(new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecs));

    if (r % 2 === 1) {
      console.log(vecsCircles[r]);
      vecsCircles[r].flip();
    }
  }

  let poly = new _Poly__WEBPACK_IMPORTED_MODULE_4__["default"](vecsCircles),
      polyCopy = poly.copy();
  console.log(poly);
  poly.shrink(0.05, ctx); // polyCopy.draw(ctx);
  // poly.draw(ctx);
}

testPoly();

function testStroke() {
  let len = 15;
  let vecsCricle = Array(len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / len * 360).mult(0.5));
  let vecsLine = Array(len).fill(0).map((e, i) => new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](i / (6 - 1) * 2 - 1, 0.3));
  let stroke1 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecsCricle), true),
      stroke2 = new _Stroke__WEBPACK_IMPORTED_MODULE_5__["default"](new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](0).fromVecs(vecsLine));
  let enter = 3;
  stroke1.segs.cutEnter(enter, 0.5);
  stroke1.segs.cutGoing(enter + 1, new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0, 0));
  stroke1.segs.cutGoing(enter + 2, new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](-0.1, 0));
  let cuts = stroke1.segs.cutLeave(enter + 3, 15, 0.5);
  console.log(cuts[0].map(e => e.head), 'cutresult');
  let poly1 = new _Poly__WEBPACK_IMPORTED_MODULE_4__["default"](new _List__WEBPACK_IMPORTED_MODULE_2__["default"](cuts[0])),
      poly2 = new _Poly__WEBPACK_IMPORTED_MODULE_4__["default"](new _List__WEBPACK_IMPORTED_MODULE_2__["default"](cuts[1]));
  poly1 = poly1.copy();
  poly2 = poly2.copy(); // poly1.shrink(0.5);
  // poly2.shrink(0.5);
  // poly1.trans(new Vec(0.1, -0.1));

  poly2.trans(new _Vec__WEBPACK_IMPORTED_MODULE_1__["default"](0.1, -0.2));
  poly1.draw(ctx, true);
  poly2.draw(ctx, true); // stroke1.draw(ctx);
  // stroke2.draw(ctx);
  // segs1.flip();
  // console.assert(segs1[0].head === segs2.last().tail, 'Segs: flip error');

  let segsLine = new _Segs__WEBPACK_IMPORTED_MODULE_3__["default"](vecsLine); // console.log(segsLine.torque().center);
}

testStroke();

/***/ }),

/***/ "./src/Poly.js":
/*!*********************!*\
  !*** ./src/Poly.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Poly; });
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./List */ "./src/List.js");
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");


class Poly {
  constructor(contours = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](0)) {
    this.contours = contours;
    this.close();
  }

  close() {
    for (let contour of this.contours) {
      if (contour.last().tail !== contour[0].head) {
        let conn = new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](contour.last().tail, contour[0].head);
        contour.push(conn);
      }
    }
  }

  copy() {
    let poly = new Poly(this.contours.copy());
    poly.close();
    return poly;
  }

  trans(vec) {
    for (let contour of this.contours) {
      contour.trans(vec);
      contour.last().tail.iadd(vec.neg()); // contour.last().tail.iadd(vec.neg());
    }
  }

  draw(ctx, stroke) {
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'rgb(0, 0, 0, 0.1)';
    ctx.beginPath();
    ctx.drawContours(this.contours);
    ctx.fill();
    if (stroke) ctx.stroke();
    ctx.save();
    ctx.fillStyle = 'rgb(0, 0, 0, 0.5)';

    for (let contour of this.contours) {
      for (let [index, seg] of contour.entries()) {
        ctx.text(index, seg.head);
      }
    }

    ctx.restore();
  }

  shrink(shrink) {
    let bisecs = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](0);

    for (let contour of this.contours) {
      bisecs.push([]);

      for (let i = 0; i < contour.length; i++) {
        let last = i === 0 ? contour.length - 1 : i - 1;
        let bisec = contour[last].angleBisect(contour[i]);
        bisecs.last().push(bisec.mult(shrink));
      }
    }

    for (let i = 0; i < this.contours.length; i++) {
      let contour = this.contours[i];

      for (let j = 0; j < contour.length; j++) {
        contour[j].head.iadd(bisecs[i][j]);
      }
    }
  }

}

/***/ }),

/***/ "./src/Seg.js":
/*!********************!*\
  !*** ./src/Seg.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Seg; });
/* harmony import */ var _Vec__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vec */ "./src/Vec.js");
// https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line
// 
// note that:
// |x1-x3 x3-x4|
// |           | (determinant) is equivalent to
// |y1-y3 y3-y4|
// 
// cross((x1-x3, y1-y3), (x3-x4, y3-y4)), or
// 
// cross(P1-P3, P3-P4)
function segIntersect(head1, tail1, head2, tail2) {
  let h1h2 = head1.sub(head2),
      h1t1 = head1.sub(tail1),
      h2t2 = head2.sub(tail2),
      detT = h1h2.cross(h2t2),
      detU = h1t1.cross(h1h2),
      detS = h1t1.cross(h2t2),
      t = detT / detS,
      u = -detU / detS,
      p = head1.add(tail1.sub(head1).mult(t));
  return {
    t,
    u,
    p
  };
}


class Seg {
  constructor(hd, tl) {
    this.head = hd;
    this.tail = tl;
  }

  diff() {
    return this.tail.sub(this.head);
  }

  len() {
    return this.tail.sub(this.head).mag();
  }

  dir() {
    return this.tail.sub(this.head).norm();
  }

  lerp(ratio) {
    return this.head.add(this.tail.sub(this.head).mult(ratio));
  }

  trans(vec) {
    this.head.iadd(vec);
    this.tail.iadd(vec);
  }

  rotate(angle) {
    this.head.irotate(angle);
    this.tail.irotate(angle);
  }

  scale(mag) {
    this.head.imult(mag);
    this.tail.imult(mag);
  }

  torque() {
    return new Torque({
      center: this.lerp(0.5),
      mass: this.len()
    });
  }

  intersect(that) {
    return segIntersect(this.head, this.tail, that.head, that.tail);
  }

  cross() {
    return this.head.cross(this.tail);
  } // the previous one connect with the 


  angleBisect(that) {
    if (that.head == this.tail) {
      let thisDir = this.dir().neg(),
          thatDir = that.dir();
      return thisDir.add(thatDir).mult(Math.sign(thisDir.cross(thatDir))).norm();
    } else console.error('angleBisector is only permitted if two segs share same vec', this, that);
  }

  reverse() {
    let temp = this.head;
    this.head = this.tail;
    this.tail = temp;
  }

  copy() {
    return new Seg(this.head.copy(), this.tail.copy());
  }

}

/***/ }),

/***/ "./src/Segs.js":
/*!*********************!*\
  !*** ./src/Segs.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Segs; });
/* harmony import */ var _List__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./List */ "./src/List.js");
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");


class Segs extends _List__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(...segs) {
    super(...segs);
  } // torque calculation will be added here.


  fromVecs(vecs) {
    let list = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](vecs.slice(0, -1), vecs.slice(1)).zip(e => new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](...e));

    while (list.length > 0) {
      this.push(list.pop());
    }

    this.reverse();
    return this;
  }

  flip() {
    this.reverse();

    for (let seg of this) {
      seg.reverse();
    }
  }

  lens() {
    let lens = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](0);

    for (let seg of this) {
      lens.push(seg.len());
    }

    return lens;
  }

  intersect(other) {
    let intersects = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](0);

    for (let seg of this) {
      intersects.push(other.intersect(seg));
    }
  }

  partialSums(component) {
    let sum = [];

    for (let seg of this) {
      sum.push(seg.head[component] + seg.tail[component]);
    }

    return sum;
  }

  crosses() {
    let crosses = [];

    for (let seg of this) {
      crosses.push(seg.head.cross(seg.tail));
    }
  }

  trans(transVec) {
    for (let seg of this) {
      console.log('yay');
      seg.head.iadd(transVec);
    }

    this.last().tail.iadd(transVec);
  }

  rotate(angle) {
    let headOffset = this[0].head.copy();
    this.trans(headOffset.neg());

    for (let seg of this) {
      seg.tail.irotate(angle);
    }

    this.trans(headOffset);
  }

  scale(ratio) {
    let headOffset = this.segs[0].head.copy();
    this.trans(headOffset.neg());

    for (let seg of this) {
      seg.tail.imult(ratio);
    }

    this.trans(headOffset);
  }

  pointAt(ratio) {
    let lens = this.lens(),
        accum = lens.accum(),
        given = accum.last() * ratio;
    var ithSeg = 0,
        lenInSeg = 0;

    for (let [index, len] of accum.entries()) {
      if (given < len) {
        ithSeg = index - 1;
        lenInSeg = len - given;
        break;
      }
    }

    return {
      point: this[ithSeg].lerp(1 - lenInSeg / lens[ithSeg]),
      tan: this[ithSeg].dir()
    };
  }

  cutEnter(ithSeg, ratio) {
    let seg = this[ithSeg],
        lerp = seg.lerp(ratio),
        succ = new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](lerp, seg.tail);
    seg.tail = lerp;
    this.splice(ithSeg + 1, 0, succ);
    console.log(this, 'cutpoint');
  }

  cutGoing(ithSeg, point) {
    let seg = this[ithSeg];
    this.splice(ithSeg, 0, new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](seg.head, point), new _Seg__WEBPACK_IMPORTED_MODULE_1__["default"](point, seg.head));
  }

  cutLeave(notchTip, ithSeg, ratio) {
    // 1. the leaving point is created over the ith segment
    //    by this moment, the tail of the ith seg or the head
    //    of the ith+1 seg is the leaving point.
    this.cutEnter(ithSeg, ratio); // 2. make the current notch tip reach the leaving point
    //    NOTE that the actual tip point is the tail of notchTip.

    this.cutGoing(notchTip, this[ithSeg].tail);
    let result = new _List__WEBPACK_IMPORTED_MODULE_0__["default"](this.slice(notchTip + 1, ithSeg + 3), this.slice(1, notchTip + 1).concat(this.slice(ithSeg + 3)));
    return result;
  }

  torque() {
    let product = new Vec();

    for (let seg of this) {
      product.iadd(seg.torque().toProduct());
    }

    let mass = this.lens().sum();
    let center = product.mult(this.length === 0 ? 0 : 1 / mass);
    return new Torque({
      center,
      mass
    });
  }

  copy() {
    // console.log(this);
    let segs = this.map(seg => seg.copy ? seg.copy() : seg);

    for (let i = 0; i < segs.length - 1; i++) {
      segs[i].tail = segs[i + 1].head;
    }

    return segs;
  }

}

/***/ }),

/***/ "./src/Stroke.js":
/*!***********************!*\
  !*** ./src/Stroke.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Stroke; });
/* harmony import */ var _Seg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Seg */ "./src/Seg.js");

class Stroke {
  constructor(segList, closed) {
    this.segs = segList;

    if (closed) {
      this.closed = true;
      let conn = new _Seg__WEBPACK_IMPORTED_MODULE_0__["default"](this.segs.last().tail.copy(), this.segs[0].head.copy());
      this.segs.push(conn);
    }
  }

  draw(ctx) {
    ctx.strokeStyle = 'black';
    ctx.beginPath();
    ctx.drawSegs(this.segs);
    ctx.stroke();
    ctx.save();
    ctx.fillStyle = "black";

    for (let [index, seg] of this.segs.entries()) {
      ctx.text(index, seg.head);
    }

    ctx.restore();
  }

  cut(poly) {// 1. test if the head of the stroke is inside of any
  }

}

/***/ }),

/***/ "./src/Vec.js":
/*!********************!*\
  !*** ./src/Vec.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Vec; });
class Vec {
  /**
   * Simple Vector class.
   * 
   * @param {any} x 
   * @param {any} y 
   */
  constructor(x, y, attr) {
    if (attr === undefined) {
      this.attr = {};

      if (y === undefined) {
        if (x === undefined) {
          // For nothing given, new vec created
          this.x = 0;
          this.y = 0;
        } else if (x.x !== undefined && x.y !== undefined) {
          // if argument given as {x:1, y:1}
          this.x = x.x;
          this.y = x.y;
        } else if (x.len !== undefined && x.ang !== undefined) {
          // if argument given as {len: 1, ang: 0}
          this.x = x.len * Math.cos(x.ang * Math.PI / 180);
          this.y = x.len * Math.sin(x.ang * Math.PI / 180);
        } else if (typeof x === 'number') {
          // if x is a number 
          this.x = Math.cos(x * Math.PI / 180);
          this.y = Math.sin(x * Math.PI / 180);
        }
      } else {
        this.x = x;
        this.y = y;
      }
    } else {
      this.attr = attr;
      this.x = x;
      this.y = y;
    }
  }
  /**
   * 
   * @param {Vec} vec another vec to be added
   * @returns {Vec}
   */


  add(vec) {
    return new Vec(this.x + vec.x, this.y + vec.y);
  }

  iadd(vec) {
    this.x += vec.x;
    this.y += vec.y;
  }
  /**
   * 
   * @param {Vec} vec another vec to be subtracted
   * @returns {Vec}
   */


  sub(vec) {
    return new Vec(this.x - vec.x, this.y - vec.y);
  }

  isub(vec) {
    this.x -= vec.x;
    this.y -= vec.y;
  }
  /**
   * 
   * @param {Vec, number} vec can be either a vec or a scalar. If it's a scalar,
   *                          then times it both to x and y.
   * @returns {Vec}
   */


  mult(vec) {
    if (vec.x === undefined) {
      return new Vec(this.x * vec, this.y * vec);
    } else {
      return new Vec(this.x * vec.x, this.y * vec.y);
    }
  }

  imult(vec) {
    if (vec.x === undefined) {
      this.y *= vec;
      this.x *= vec;
    } else {
      this.x *= vec.x;
      this.y *= vec.y;
    }
  }
  /**
   * transform point in polar manner. returns a new vector relative
   * to this one.
   * @param {number} len length
   * @param {number} ang angle in degree
   */


  polar(vec) {
    return new Vec(this.x + vec.len * Math.cos(vec.ang * Math.PI / 180), this.y + vec.len * Math.sin(vec.ang * Math.PI / 180));
  }

  ipolar(vec) {
    this.x += vec.len * Math.cos(vec.ang * Math.PI / 180);
    this.y += vec.len * Math.sin(vec.ang * Math.PI / 180);
  }

  iscale(ratio, about) {
    // console.log(this, ratio, about, "iscale");
    this.isub(about);
    this.imult(ratio);
    this.iadd(about);
  }
  /**
  * rotate
  * @param {number} theta angle to rotate in degree.
  */


  rotate(theta) {
    switch (theta) {
      case 90:
        return new Vec(-this.y, this.x);

      case -90:
        return new Vec(this.y, -this.x);

      case 180:
      case -180:
        return new Vec(-this.x, -this.y);

      default:
        let rad = theta / 180 * Math.PI,
            sin = Math.sin(rad),
            cos = Math.cos(rad);
        return new Vec(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
  }

  irotate(theta) {
    let vec = this.rotate(theta);
    this.x = vec.x;
    this.y = vec.y;
  }

  neg() {
    return new Vec(-this.x, -this.y);
  }
  /**
   * returns the cross product between this and vec.
   * also is the result of det
   * 
   * |this.x   that.x|
   * |               |
   * |this.y   that.y|
   * 
   * @param {Vec} that another vector
   */


  cross(that) {
    return this.x * that.y - that.x * this.y;
  }

  mag() {
    return Math.hypot(this.x, this.y);
  }

  norm() {
    let mag = this.mag();
    return this.mult(mag === 0 ? 0 : 1 / mag);
  }

  angle() {
    return Math.atan2(this.y, this.x) / Math.PI * 180;
  }

  isNaN() {
    return isNaN(this.x) || isNaN(this.y);
  }

  addAttr(attr) {
    this.attr.push(attr);
  }
  /**
   * Set attribute to Vector. overwrite existing attributes.
   * @param {object} attrObject 
   */


  setAttr(attrObject) {
    return Object.assign(this.attr, attrObject);
  }

  removeAttr(attrKey) {
    this.attr[attrKey] = undefined;
  }
  /**
   * copy: duplicate an object instance of this.
   * @returns {Vec}
   */


  copy() {
    return new Vec(this.x, this.y, JSON.parse(JSON.stringify(this.attr)));
  }

  toArray() {
    return [this.x, this.y];
  }

  draw(ctx) {
    ctx.save();
    ctx.strokeStyle = 'gray';
    ctx.point(this);
    ctx.restore();
  }

}

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map