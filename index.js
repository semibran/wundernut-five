var image = new Image
image.src = 'wundernut-five.png'
image.onload = function () {
  var canvas = mark(image)
  document.body.appendChild(canvas)
}

var mark = function () {
  return function (image) {
    var width  = image.width
    var height = image.height

    var canvas = document.createElement('canvas')
    canvas.width  = width
    canvas.height = height

    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0)

    var reference = context.getImageData(0, 0, width, height).data

    var imageData = context.createImageData(width, height)
    var data = imageData.data

    var marker = [153, 153, 153] // Marker color (gray#999)

    var position  = null  // Draw position
    var direction = null  // Draw direction

    var UP    = [ 0, -1]
    var RIGHT = [ 1,  0]
    var DOWN  = [ 0,  1]
    var LEFT  = [-1,  0]

    var directionNames = [UP, RIGHT, DOWN, LEFT]
    var directions = directionNames.length

    for (var i = 0, max = reference.length; i < max; i += 4) {
      var color = getColor(reference, i)
      if (color === 'rgb(7, 84, 19)')
        direction = UP
      if (color === 'rgb(139, 57, 137)')
        direction = LEFT
      if (direction) {
        setColor(data, i, marker)
        position = indexToCoord(i / 4, width)
        do
          draw()
        while (!!direction)
      }
    }

    context.putImageData(imageData, 0, 0)
    return canvas

    function isOutside(coord) {
      var x = coord[0]
      var y = coord[1]
      return x < 0 || x >= width || y < 0 || y >= height
    }

    function draw() {
      move()
      if (isOutside(position))
        return stopDraw()
      index = coordToIndex(position, width)
      color = getColor(reference, index * 4)
      setColor(data, index * 4, marker)
      switch (color) {
        case 'rgb(51, 69, 169)':   return stopDraw()
        case 'rgb(123, 131, 154)': return turnLeft()
        case 'rgb(182, 149, 72)':  return turnRight()
      }
    }

    function move() {
      position[0] += direction[0]
      position[1] += direction[1]
    }

    function turn(value) {
      var index = directionNames.indexOf(direction)
      index += value
      while (index < 0)
        index += directions
      while (index >= directions)
        index -= directions
      direction = directionNames[index]
    }

    function turnLeft() {
      turn(-1)
    }

    function turnRight() {
      turn(1)
    }

    function stopDraw() {
      direction = null
    }
  }

  function indexToCoord(index, width) {
    var x = index % width
    var y = (index - x) / width
    var coord = [x, y]
    return coord
  }

  function coordToIndex(coord, width) {
    var x = coord[0]
    var y = coord[1]
    var index = y * width + x
    return index
  }

  function rgbToColor(red, green, blue) {
    var color = 'rgb(' + red + ', ' + green + ', ' + blue + ')'
    return color
  }

  function getColor(data, index) {
    return rgbToColor(data[index], data[index + 1], data[index + 2])
  }

  function setColor(data, index, color) {
    data[index]     = color[0]
    data[index + 1] = color[1]
    data[index + 2] = color[2]
    data[index + 3] = 255 // Alpha channel
  }

}()
