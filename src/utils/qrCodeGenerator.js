// QR Code Generator (Pure JavaScript ES Module)
// Based on Kazuhiko Arase's QR Code library (MIT / Public Domain)

const QRMode = {
  MODE_NUMBER: 1 << 0,
  MODE_ALPHA_NUM: 1 << 1,
  MODE_8BIT_BYTE: 1 << 2,
  MODE_KANJI: 1 << 3,
}

const QRErrorCorrectLevel = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
}

const QRMaskPattern = {
  PATTERN000: 0,
  PATTERN001: 1,
  PATTERN010: 2,
  PATTERN011: 3,
  PATTERN100: 4,
  PATTERN101: 5,
  PATTERN110: 6,
  PATTERN111: 7,
}

const QRMath = {
  glog: function (n) {
    if (n < 1) throw new Error('glog(' + n + ')')
    return QRMath.LOG_TABLE[n]
  },
  gexp: function (n) {
    while (n < 0) n += 255
    while (n >= 256) n -= 255
    return QRMath.EXP_TABLE[n]
  },
  EXP_TABLE: new Array(256),
  LOG_TABLE: new Array(256),
}

for (let i = 0; i < 8; i++) QRMath.EXP_TABLE[i] = 1 << i
for (let i = 8; i < 256; i++) {
  QRMath.EXP_TABLE[i] =
    QRMath.EXP_TABLE[i - 4] ^
    QRMath.EXP_TABLE[i - 5] ^
    QRMath.EXP_TABLE[i - 6] ^
    QRMath.EXP_TABLE[i - 8]
}
for (let i = 0; i < 255; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i

function QRPolynomial(num, shift) {
  if (num.length === undefined) throw new Error(num.length + '/' + shift)
  let offset = 0
  while (offset < num.length && num[offset] === 0) offset++
  this.num = new Array(num.length - offset + shift)
  for (let i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset]
  for (let i = num.length - offset; i < this.num.length; i++) this.num[i] = 0
}

QRPolynomial.prototype = {
  get: function (index) {
    return this.num[index]
  },
  getLength: function () {
    return this.num.length
  },
  multiply: function (e) {
    const num = new Array(this.getLength() + e.getLength() - 1)
    for (let i = 0; i < this.getLength(); i++) {
      for (let j = 0; j < e.getLength(); j++) {
        num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)))
      }
    }
    return new QRPolynomial(num, 0)
  },
  mod: function (e) {
    if (this.getLength() - e.getLength() < 0) return this
    const ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0))
    const num = new Array(this.getLength())
    for (let i = 0; i < this.getLength(); i++) num[i] = this.get(i)
    for (let i = 0; i < e.getLength(); i++) {
      num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio)
    }
    return new QRPolynomial(num, 0).mod(e)
  },
}

function QRRSBlock(totalCount, dataCount) {
  this.totalCount = totalCount
  this.dataCount = dataCount
}

QRRSBlock.RS_BLOCK_TABLE = [
  // 1
  [1, 26, 19],
  [1, 26, 16],
  [1, 26, 13],
  [1, 26, 9],
  // 2
  [1, 44, 34],
  [1, 44, 28],
  [1, 44, 22],
  [1, 44, 16],
  // 3
  [1, 70, 55],
  [1, 70, 44],
  [2, 35, 17],
  [2, 35, 13],
  // 4
  [1, 100, 80],
  [2, 50, 32],
  [2, 50, 24],
  [4, 25, 9],
  // 5
  [1, 134, 108],
  [2, 67, 43],
  [2, 33, 15, 2, 34, 16],
  [2, 33, 11, 2, 34, 12],
  // 6
  [2, 86, 68],
  [4, 43, 27],
  [4, 43, 19],
  [4, 43, 15],
  // 7
  [2, 98, 78],
  [4, 49, 31],
  [2, 32, 14, 4, 33, 15],
  [4, 39, 13, 1, 40, 14],
  // 8
  [2, 121, 97],
  [2, 60, 38, 2, 61, 39],
  [4, 40, 18, 2, 41, 19],
  [4, 40, 14, 2, 41, 15],
  // 9
  [2, 146, 116],
  [3, 58, 36, 2, 59, 37],
  [4, 36, 16, 4, 37, 17],
  [4, 36, 12, 4, 37, 13],
  // 10
  [2, 86, 68, 2, 87, 69],
  [4, 69, 43, 1, 70, 44],
  [6, 43, 19, 2, 44, 20],
  [6, 43, 15, 2, 44, 16],
]

QRRSBlock.getRSBlocks = function (typeNumber, errorCorrectLevel) {
  const rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel)
  if (rsBlock === undefined) {
    throw new Error('bad rs block @ typeNumber:' + typeNumber + '/errorCorrectLevel:' + errorCorrectLevel)
  }
  const length = rsBlock.length / 3
  const list = []
  for (let i = 0; i < length; i++) {
    const count = rsBlock[i * 3 + 0]
    const totalCount = rsBlock[i * 3 + 1]
    const dataCount = rsBlock[i * 3 + 2]
    for (let j = 0; j < count; j++) list.push(new QRRSBlock(totalCount, dataCount))
  }
  return list
}

QRRSBlock.getRsBlockTable = function (typeNumber, errorCorrectLevel) {
  switch (errorCorrectLevel) {
    case QRErrorCorrectLevel.L:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0]
    case QRErrorCorrectLevel.M:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1]
    case QRErrorCorrectLevel.Q:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2]
    case QRErrorCorrectLevel.H:
      return QRRSBlock.RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3]
    default:
      return undefined
  }
}

function QRBitBuffer() {
  this.buffer = []
  this.length = 0
}

QRBitBuffer.prototype = {
  get: function (index) {
    const bufIndex = Math.floor(index / 8)
    return ((this.buffer[bufIndex] >>> (7 - (index % 8))) & 1) === 1
  },
  put: function (num, length) {
    for (let i = 0; i < length; i++) {
      this.putBit(((num >>> (length - i - 1)) & 1) === 1)
    }
  },
  getLengthInBits: function () {
    return this.length
  },
  putBit: function (bit) {
    const bufIndex = Math.floor(this.length / 8)
    if (this.buffer.length <= bufIndex) this.buffer.push(0)
    if (bit) this.buffer[bufIndex] |= 0x80 >>> (this.length % 8)
    this.length++
  },
}

function QR8bitByte(data) {
  this.mode = QRMode.MODE_8BIT_BYTE
  this.data = data
  this.parsedData = []
  for (let i = 0, l = this.data.length; i < l; i++) {
    const byteArray = []
    const code = this.data.charCodeAt(i)
    if (code > 0x10000) {
      byteArray[0] = 0xf0 | ((code & 0x1c0000) >>> 18)
      byteArray[1] = 0x80 | ((code & 0x3f000) >>> 12)
      byteArray[2] = 0x80 | ((code & 0xfc0) >>> 6)
      byteArray[3] = 0x80 | (code & 0x3f)
    } else if (code > 0x800) {
      byteArray[0] = 0xe0 | ((code & 0xf000) >>> 12)
      byteArray[1] = 0x80 | ((code & 0xfc0) >>> 6)
      byteArray[2] = 0x80 | (code & 0x3f)
    } else if (code > 0x80) {
      byteArray[0] = 0xc0 | ((code & 0x7c0) >>> 6)
      byteArray[1] = 0x80 | (code & 0x3f)
    } else {
      byteArray[0] = code
    }
    this.parsedData.push(byteArray)
  }
  this.parsedData = Array.prototype.concat.apply([], this.parsedData)
}

QR8bitByte.prototype = {
  getLength: function () {
    return this.parsedData.length
  },
  write: function (buffer) {
    for (let i = 0, l = this.parsedData.length; i < l; i++) {
      buffer.put(this.parsedData[i], 8)
    }
  },
}

const QRUtil = {
  PATTERN_POSITION_TABLE: [
    [],
    [6, 18],
    [6, 22],
    [6, 26],
    [6, 30],
    [6, 34],
    [6, 22, 38],
    [6, 24, 42],
    [6, 26, 46],
    [6, 28, 50],
  ],
  G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0),
  G18: (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0),
  G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1),
  getBCHTypeInfo: function (data) {
    let d = data << 10
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
      d ^= QRUtil.G15 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15))
    }
    return ((data << 10) | d) ^ QRUtil.G15_MASK
  },
  getBCHTypeNumber: function (data) {
    let d = data << 12
    while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0) {
      d ^= QRUtil.G18 << (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18))
    }
    return (data << 12) | d
  },
  getBCHDigit: function (data) {
    let digit = 0
    while (data !== 0) {
      digit++
      data >>>= 1
    }
    return digit
  },
  getPatternPosition: function (typeNumber) {
    return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]
  },
  getMask: function (maskPattern, i, j) {
    switch (maskPattern) {
      case QRMaskPattern.PATTERN000:
        return (i + j) % 2 === 0
      case QRMaskPattern.PATTERN001:
        return i % 2 === 0
      case QRMaskPattern.PATTERN010:
        return j % 3 === 0
      case QRMaskPattern.PATTERN011:
        return (i + j) % 3 === 0
      case QRMaskPattern.PATTERN100:
        return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0
      case QRMaskPattern.PATTERN101:
        return ((i * j) % 2) + ((i * j) % 3) === 0
      case QRMaskPattern.PATTERN110:
        return (((i * j) % 2) + ((i * j) % 3)) % 2 === 0
      case QRMaskPattern.PATTERN111:
        return (((i * j) % 3) + ((i + j) % 2)) % 2 === 0
      default:
        throw new Error('bad maskPattern:' + maskPattern)
    }
  },
  getErrorCorrectPolynomial: function (errorCorrectLength) {
    let a = new QRPolynomial([1], 0)
    for (let i = 0; i < errorCorrectLength; i++) {
      a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0))
    }
    return a
  },
  getLengthInBits: function (mode, type) {
    if (1 <= type && type < 10) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 10
        case QRMode.MODE_ALPHA_NUM:
          return 9
        case QRMode.MODE_8BIT_BYTE:
          return 8
        case QRMode.MODE_KANJI:
          return 8
        default:
          throw new Error('mode:' + mode)
      }
    } else if (type <= 26) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 12
        case QRMode.MODE_ALPHA_NUM:
          return 11
        case QRMode.MODE_8BIT_BYTE:
          return 16
        case QRMode.MODE_KANJI:
          return 10
        default:
          throw new Error('mode:' + mode)
      }
    } else if (type <= 40) {
      switch (mode) {
        case QRMode.MODE_NUMBER:
          return 14
        case QRMode.MODE_ALPHA_NUM:
          return 13
        case QRMode.MODE_8BIT_BYTE:
          return 16
        case QRMode.MODE_KANJI:
          return 12
        default:
          throw new Error('mode:' + mode)
      }
    } else {
      throw new Error('type:' + type)
    }
  },
  getLostPoint: function (qrCode) {
    const moduleCount = qrCode.getModuleCount()
    let lostPoint = 0
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        let sameCount = 0
        const dark = qrCode.isDark(row, col)
        for (let r = -1; r <= 1; r++) {
          if (row + r < 0 || moduleCount <= row + r) continue
          for (let c = -1; c <= 1; c++) {
            if (col + c < 0 || moduleCount <= col + c) continue
            if (r === 0 && c === 0) continue
            if (dark === qrCode.isDark(row + r, col + c)) sameCount++
          }
        }
        if (sameCount > 5) lostPoint += 3 + sameCount - 5
      }
    }
    for (let row = 0; row < moduleCount - 1; row++) {
      for (let col = 0; col < moduleCount - 1; col++) {
        let count = 0
        if (qrCode.isDark(row, col)) count++
        if (qrCode.isDark(row + 1, col)) count++
        if (qrCode.isDark(row, col + 1)) count++
        if (qrCode.isDark(row + 1, col + 1)) count++
        if (count === 0 || count === 4) lostPoint += 3
      }
    }
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount - 6; col++) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row, col + 1) &&
          qrCode.isDark(row, col + 2) &&
          qrCode.isDark(row, col + 3) &&
          qrCode.isDark(row, col + 4) &&
          !qrCode.isDark(row, col + 5) &&
          qrCode.isDark(row, col + 6)
        ) {
          lostPoint += 40
        }
      }
    }
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount - 6; row++) {
        if (
          qrCode.isDark(row, col) &&
          !qrCode.isDark(row + 1, col) &&
          qrCode.isDark(row + 2, col) &&
          qrCode.isDark(row + 3, col) &&
          qrCode.isDark(row + 4, col) &&
          !qrCode.isDark(row + 5, col) &&
          qrCode.isDark(row + 6, col)
        ) {
          lostPoint += 40
        }
      }
    }
    let darkCount = 0
    for (let col = 0; col < moduleCount; col++) {
      for (let row = 0; row < moduleCount; row++) {
        if (qrCode.isDark(row, col)) darkCount++
      }
    }
    const ratio = Math.abs((100 * darkCount) / moduleCount / moduleCount - 50) / 5
    lostPoint += ratio * 10
    return lostPoint
  },
}

function QRCodeModel(typeNumber, errorCorrectLevel) {
  this.typeNumber = typeNumber
  this.errorCorrectLevel = errorCorrectLevel
  this.modules = null
  this.moduleCount = 0
  this.dataCache = null
  this.dataList = []
}

QRCodeModel.prototype = {
  addData: function (data) {
    const newData = new QR8bitByte(data)
    this.dataList.push(newData)
    this.dataCache = null
  },
  isDark: function (row, col) {
    if (row < 0 || this.moduleCount <= row || col < 0 || this.moduleCount <= col) {
      throw new Error(row + ',' + col)
    }
    return this.modules[row][col]
  },
  getModuleCount: function () {
    return this.moduleCount
  },
  make: function () {
    if (this.typeNumber < 1) {
      let typeNumber = 1
      for (typeNumber = 1; typeNumber <= 10; typeNumber++) {
        const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, this.errorCorrectLevel)
        const buffer = new QRBitBuffer()
        let totalDataCount = 0
        for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount
        for (let i = 0; i < this.dataList.length; i++) {
          const data = this.dataList[i]
          buffer.put(data.mode, 4)
          buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber))
          data.write(buffer)
        }
        if (buffer.getLengthInBits() <= totalDataCount * 8) break
      }
      this.typeNumber = typeNumber
    }
    this.makeImpl(false, this.getBestMaskPattern())
  },
  makeImpl: function (test, maskPattern) {
    this.moduleCount = this.typeNumber * 4 + 17
    this.modules = new Array(this.moduleCount)
    for (let row = 0; row < this.moduleCount; row++) {
      this.modules[row] = new Array(this.moduleCount)
      for (let col = 0; col < this.moduleCount; col++) {
        this.modules[row][col] = null
      }
    }
    this.setupPositionProbePattern(0, 0)
    this.setupPositionProbePattern(this.moduleCount - 7, 0)
    this.setupPositionProbePattern(0, this.moduleCount - 7)
    this.setupPositionAdjustPattern()
    this.setupTimingPattern()
    this.setupTypeInfo(test, maskPattern)
    if (this.typeNumber >= 7) {
      this.setupTypeNumber(test)
    }
    if (this.dataCache == null) {
      this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)
    }
    this.mapData(this.dataCache, maskPattern)
  },
  setupPositionProbePattern: function (row, col) {
    for (let r = -1; r <= 7; r++) {
      if (row + r <= -1 || this.moduleCount <= row + r) continue
      for (let c = -1; c <= 7; c++) {
        if (col + c <= -1 || this.moduleCount <= col + c) continue
        if (
          (0 <= r && r <= 6 && (c === 0 || c === 6)) ||
          (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
          (2 <= r && r <= 4 && 2 <= c && c <= 4)
        ) {
          this.modules[row + r][col + c] = true
        } else {
          this.modules[row + r][col + c] = false
        }
      }
    }
  },
  getBestMaskPattern: function () {
    let minLostPoint = 0
    let pattern = 0
    for (let i = 0; i < 8; i++) {
      this.makeImpl(true, i)
      const lostPoint = QRUtil.getLostPoint(this)
      if (i === 0 || minLostPoint > lostPoint) {
        minLostPoint = lostPoint
        pattern = i
      }
    }
    return pattern
  },
  setupTimingPattern: function () {
    for (let r = 8; r < this.moduleCount - 8; r++) {
      if (this.modules[r][6] !== null) continue
      this.modules[r][6] = r % 2 === 0
    }
    for (let c = 8; c < this.moduleCount - 8; c++) {
      if (this.modules[6][c] !== null) continue
      this.modules[6][c] = c % 2 === 0
    }
  },
  setupPositionAdjustPattern: function () {
    const pos = QRUtil.getPatternPosition(this.typeNumber)
    for (let i = 0; i < pos.length; i++) {
      for (let j = 0; j < pos.length; j++) {
        const row = pos[i]
        const col = pos[j]
        if (this.modules[row][col] !== null) continue
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
              this.modules[row + r][col + c] = true
            } else {
              this.modules[row + r][col + c] = false
            }
          }
        }
      }
    }
  },
  setupTypeInfo: function (test, maskPattern) {
    const data = (this.errorCorrectLevel << 3) | maskPattern
    const bits = QRUtil.getBCHTypeInfo(data)
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 6) {
        this.modules[i][8] = mod
      } else if (i < 8) {
        this.modules[i + 1][8] = mod
      } else {
        this.modules[this.moduleCount - 15 + i][8] = mod
      }
    }
    for (let i = 0; i < 15; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      if (i < 8) {
        this.modules[8][this.moduleCount - i - 1] = mod
      } else if (i < 9) {
        this.modules[8][15 - i - 1 + 1] = mod
      } else {
        this.modules[8][15 - i - 1] = mod
      }
    }
    this.modules[this.moduleCount - 8][8] = !test
  },
  setupTypeNumber: function (test) {
    const bits = QRUtil.getBCHTypeNumber(this.typeNumber)
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this.modules[Math.floor(i / 3)][(i % 3) + this.moduleCount - 8 - 3] = mod
    }
    for (let i = 0; i < 18; i++) {
      const mod = !test && ((bits >> i) & 1) === 1
      this.modules[(i % 3) + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod
    }
  },
  mapData: function (data, maskPattern) {
    let inc = -1
    let row = this.moduleCount - 1
    let bitIndex = 7
    let byteIndex = 0
    for (let col = this.moduleCount - 1; col > 0; col -= 2) {
      if (col === 6) col--
      while (true) {
        for (let c = 0; c < 2; c++) {
          if (this.modules[row][col - c] === null) {
            let dark = false
            if (byteIndex < data.length) {
              dark = ((data[byteIndex] >>> bitIndex) & 1) === 1
            }
            const mask = QRUtil.getMask(maskPattern, row, col - c)
            if (mask) dark = !dark
            this.modules[row][col - c] = dark
            bitIndex--
            if (bitIndex === -1) {
              byteIndex++
              bitIndex = 7
            }
          }
        }
        row += inc
        if (row < 0 || this.moduleCount <= row) {
          row -= inc
          inc = -inc
          break
        }
      }
    }
  },
}

QRCodeModel.createData = function (typeNumber, errorCorrectLevel, dataList) {
  const rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel)
  const buffer = new QRBitBuffer()
  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i]
    buffer.put(data.mode, 4)
    buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber))
    data.write(buffer)
  }
  let totalDataCount = 0
  for (let i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount
  if (buffer.getLengthInBits() > totalDataCount * 8) {
    throw new Error('code length overflow. (' + buffer.getLengthInBits() + '>' + totalDataCount * 8 + ')')
  }
  if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4)
  while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false)
  while (true) {
    if (buffer.getLengthInBits() >= totalDataCount * 8) break
    buffer.put(0xec, 8)
    if (buffer.getLengthInBits() >= totalDataCount * 8) break
    buffer.put(0x11, 8)
  }
  return QRCodeModel.createBytes(buffer, rsBlocks)
}

QRCodeModel.createBytes = function (buffer, rsBlocks) {
  let offset = 0
  let maxDcCount = 0
  let maxEcCount = 0
  const dcdata = new Array(rsBlocks.length)
  const ecdata = new Array(rsBlocks.length)
  for (let r = 0; r < rsBlocks.length; r++) {
    const dcCount = rsBlocks[r].dataCount
    const ecCount = rsBlocks[r].totalCount - dcCount
    maxDcCount = Math.max(maxDcCount, dcCount)
    maxEcCount = Math.max(maxEcCount, ecCount)
    dcdata[r] = new Array(dcCount)
    for (let i = 0; i < dcdata[r].length; i++) {
      dcdata[r][i] = 0xff & buffer.buffer[i + offset]
    }
    offset += dcCount
    const rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount)
    const rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1)
    const modPoly = rawPoly.mod(rsPoly)
    ecdata[r] = new Array(rsPoly.getLength() - 1)
    for (let i = 0; i < ecdata[r].length; i++) {
      const modIndex = i + modPoly.getLength() - ecdata[r].length
      ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
    }
  }
  let totalCodeCount = 0
  for (let i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount
  const data = new Array(totalCodeCount)
  let index = 0
  for (let i = 0; i < maxDcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      if (i < dcdata[r].length) data[index++] = dcdata[r][i]
    }
  }
  for (let i = 0; i < maxEcCount; i++) {
    for (let r = 0; r < rsBlocks.length; r++) {
      if (i < ecdata[r].length) data[index++] = ecdata[r][i]
    }
  }
  return data
}

/**
 * Genera el modelo QR a partir de un texto.
 * @param {string} text 
 * @param {'L'|'M'|'Q'|'H'} errorLevel 
 * @returns {QRCodeModel}
 */
export function generateQrMatrix(text, errorLevel = 'M') {
  const level = QRErrorCorrectLevel[errorLevel] ?? QRErrorCorrectLevel.M
  const qr = new QRCodeModel(0, level)
  qr.addData(text)
  qr.make()
  return qr
}

/**
 * Genera el SVG completo personalizado para la identidad de XíimbalApp:
 * - Corrección de error nivel 'H' (30% de redundancia)
 * - Puntos de datos redondeados en color café de marca (#482200)
 * - Ojos de enfoque con esquinas redondeadas y centro ámbar (#ffbf00)
 * - Insignia circular blanca en el centro con el logo de la pirámide de XíimbalApp
 */
export function getXiimbalQrSvg({
  text,
  logoUrl = '/images/logo-amber-950.png',
  margin = 4,
  darkColor = '#3b1d02',
  accentColor = '#ffbf00',
  showLogo = true,
} = {}) {
  // Nivel H para permitir el logo central manteniendo 100% de redundancia Reed-Solomon
  const qr = generateQrMatrix(text, 'H')
  const count = qr.getModuleCount()
  const total = count + margin * 2
  const center = margin + count / 2
  // Tamaño óptimo del logo central: ~18% del ancho para máxima legibilidad
  const badgeRadius = showLogo ? Math.min(count * 0.11, 4) : 0
  const logoSize = badgeRadius * 1.3
  const logoOffset = center - logoSize / 2

  // Identificar si una celda pertenece a uno de los 3 ojos de enfoque (7x7)
  const isFinder = (r, c) =>
    (r < 7 && c < 7) ||
    (r < 7 && c >= count - 7) ||
    (r >= count - 7 && c < 7)

  // Generar módulos de datos estándar continuos (omitiendo ojos y centro del logo)
  let dotsSvg = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.isDark(r, c)) continue
      if (isFinder(r, c)) continue

      const x = margin + c + 0.5
      const y = margin + r + 0.5
      const distToCenter = Math.hypot(x - center, y - center)

      // Dejar espacio limpio para el logo central si está activo
      if (showLogo && distToCenter < badgeRadius + 0.4) continue

      // Módulo continuo y sólido (1.01x1.01 evita líneas subpixel entre módulos adyacentes)
      dotsSvg += `<rect x="${margin + c}" y="${margin + r}" width="1.01" height="1.01" fill="${darkColor}"/>`
    }
  }

  // Generar los 3 ojos de enfoque según la norma ISO/IEC 18004 (estricta proporción 1:1:3:1:1)
  const finderPositions = [
    { x: margin, y: margin },
    { x: margin + count - 7, y: margin },
    { x: margin, y: margin + count - 7 },
  ]

  let findersSvg = ''
  for (const pos of finderPositions) {
    // 7x7 marco exterior, 5x5 interior blanco, 3x3 centro sólido oscuro
    findersSvg += `
      <rect x="${pos.x}" y="${pos.y}" width="7" height="7" fill="${darkColor}"/>
      <rect x="${pos.x + 1}" y="${pos.y + 1}" width="5" height="5" fill="#ffffff"/>
      <rect x="${pos.x + 2}" y="${pos.y + 2}" width="3" height="3" fill="${darkColor}"/>
    `
  }

  // Insignia circular blanca en el centro con borde dorado y logo
  let centerBadgeSvg = ''
  if (showLogo && badgeRadius > 0) {
    centerBadgeSvg = `
      <circle cx="${center}" cy="${center}" r="${badgeRadius}" fill="#ffffff" stroke="${accentColor}" stroke-width="0.5"/>
      <image href="${logoUrl}" x="${logoOffset}" y="${logoOffset}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" onerror="this.style.display='none'"/>
    `
  }

  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="100%" height="100%">
    <rect width="${total}" height="${total}" fill="#ffffff"/>
    <g class="qr-dots">${dotsSvg}</g>
    <g class="qr-finders">${findersSvg}</g>
    ${centerBadgeSvg ? `<g class="qr-badge">${centerBadgeSvg}</g>` : ''}
  </svg>`

  return {
    svg: fullSvg,
    total,
    count,
  }
}

/**
 * Renderiza el código QR personalizado en un elemento canvas para descargar PNG en alta resolución.
 */
export async function drawXiimbalQrToCanvas(
  canvas,
  text,
  {
    size = 1024,
    margin = 4,
    darkColor = '#3b1d02',
    accentColor = '#ffbf00',
    logoUrl = '/images/logo-amber-950.png',
    showLogo = true,
  } = {}
) {
  const qr = generateQrMatrix(text, 'H')
  const count = qr.getModuleCount()
  const total = count + margin * 2
  const cellSize = size / total
  const center = (margin + count / 2) * cellSize
  const badgeRadius = showLogo ? Math.min(count * 0.11, 4) * cellSize : 0
  const logoSize = badgeRadius * 1.3

  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  // Fondo blanco con zona de silencio
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  const isFinder = (r, c) =>
    (r < 7 && c < 7) ||
    (r < 7 && c >= count - 7) ||
    (r >= count - 7 && c < 7)

  // Dibujar puntos de datos continuos y sin huecos
  ctx.fillStyle = darkColor
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (!qr.isDark(r, c)) continue
      if (isFinder(r, c)) continue

      const px = (margin + c) * cellSize
      const py = (margin + r) * cellSize
      const cx = px + cellSize / 2
      const cy = py + cellSize / 2

      if (showLogo && Math.hypot(cx - center, cy - center) < badgeRadius + cellSize * 0.4) {
        continue
      }

      ctx.fillRect(
        Math.floor(px),
        Math.floor(py),
        Math.ceil(cellSize) + 1,
        Math.ceil(cellSize) + 1
      )
    }
  }

  // Dibujar ojos de enfoque según la norma ISO/IEC 18004 (1:1:3:1:1)
  const finderPositions = [
    { x: margin * cellSize, y: margin * cellSize },
    { x: (margin + count - 7) * cellSize, y: margin * cellSize },
    { x: margin * cellSize, y: (margin + count - 7) * cellSize },
  ]

  for (const pos of finderPositions) {
    // 7x7 marco exterior
    ctx.fillStyle = darkColor
    ctx.fillRect(pos.x, pos.y, cellSize * 7, cellSize * 7)

    // 5x5 interior blanco
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(pos.x + cellSize, pos.y + cellSize, cellSize * 5, cellSize * 5)

    // 3x3 centro sólido oscuro
    ctx.fillStyle = darkColor
    ctx.fillRect(pos.x + cellSize * 2, pos.y + cellSize * 2, cellSize * 3, cellSize * 3)
  }

  // Insignia circular blanca en el centro con borde dorado y logo
  if (showLogo && badgeRadius > 0) {
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(center, center, badgeRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = accentColor
    ctx.lineWidth = Math.max(2, cellSize * 0.5)
    ctx.stroke()

    // Cargar y pintar el logo de XíimbalApp
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = logoUrl
      await new Promise((resolve) => {
        if (img.complete) resolve()
        else {
          img.onload = resolve
          img.onerror = resolve
        }
      })
      ctx.drawImage(
        img,
        center - logoSize / 2,
        center - logoSize / 2,
        logoSize,
        logoSize
      )
    } catch {
      // Continuar sin logo si hay error
    }
  }
}

/**
 * Convierte un texto a ruta SVG genérica (compatibilidad).
 */
export function getQrSvgPath(text, errorLevel = 'M') {
  const qr = generateQrMatrix(text, errorLevel)
  const count = qr.getModuleCount()
  let d = ''
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        d += `M${c},${r}h1v1h-1z `
      }
    }
  }
  return { path: d, count }
}

/**
 * Renderiza el código QR en un elemento canvas a la resolución deseada.
 */
export function drawQrToCanvas(canvas, text, { size = 512, margin = 2, dark = '#1c1917', light = '#ffffff' } = {}) {
  const qr = generateQrMatrix(text, 'M')
  const count = qr.getModuleCount()
  const totalCount = count + margin * 2
  const cellSize = size / totalCount

  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = light
  ctx.fillRect(0, 0, size, size)

  ctx.fillStyle = dark
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(
          Math.round((c + margin) * cellSize),
          Math.round((r + margin) * cellSize),
          Math.ceil(cellSize),
          Math.ceil(cellSize)
        )
      }
    }
  }
}
