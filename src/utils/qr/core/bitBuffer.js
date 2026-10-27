import { QRMode } from './constants.js'

export function QRBitBuffer() {
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

export function QR8bitByte(data) {
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
