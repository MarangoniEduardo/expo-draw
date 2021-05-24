const line = (pointA, pointB) => {
  const lengthX = pointB.x - pointA.x
  const lengthY = pointB.y - pointA.y
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

const controlPoint = (current, previous, next, reverse) => {
  const p = previous || current
  const n = next || current
  const o = line(p, n)
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * 0.2
  const x = current.x + Math.cos(angle) * length
  const y = current.y + Math.sin(angle) * length
  return [x, y]
}

const command = (point, i, a) => {
  const cps = controlPoint(a[i - 1], a[i - 2], point)
  const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
  return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point.x},${point.y}`
}

export default class Pen {
  constructor(strokes) {
    this.strokes = strokes || [];
    this._offsetX = 0;
    this._offsetY = 0;
  }

  addStroke(points) {
    if (points.length > 0) {
      this.strokes.push(points);
    }
  }

  rewindStroke() {
    if (this.strokes.length < 1) return
    this.strokes.pop()
  }

  setOffset(options) {
    if (!options) return
    this._offsetX = options.x;
    this._offsetY = options.y;
  }

  pointsToSvg(data, currentBox) {
    const points = [];
    const xProp = currentBox.width / data.box.width;
    const yProp = currentBox.height / data.box.height;

    for(var i in data.points) {
      points.push({x: data.points[i].x * xProp, y: data.points[i].y * yProp})
    }

    if (points.length > 0) {
      var path = points.reduce((acc, point, i, a) => i === 0
      ? `M ${point.x},${point.y}`
      : `${acc} ${command(point, i, a)}`
    , '')
      return path;
    } else {
      return ''
    }
  }

  clear = () => {
    this.strokes = []
  }

  copy() {
    return new Reaction(this.strokes.slice());
  }
}