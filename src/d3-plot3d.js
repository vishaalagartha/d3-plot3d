import { drawPoints, drawLines, drawPolygons, drawCurves, drawSurfaces } from './drawShapes'

export default function(){  
  // Default settings
  let settings = {
    origin: {x: 0, y: 0, z:0},
    scale: 100,
    yaw: -2,
    pitch: 0.66,
    roll: 0,
    dragging: false,
    rotationFactor: 1000,
    zoomFactor: 1,
    shift: {x: 0, y: 0}
  }
  let context = null
  let data = []

  
  let plot3d = (parentContext, rotate = true, zoom = true) => {
    const createContext = ({parentContext}) => {
      const parentWidth = parentContext.node().getBoundingClientRect().width
      const parentHeight = parentContext.node().getBoundingClientRect().height
      settings.shift = {x: parentWidth/2, y: parentHeight/2} 
      context = parentContext.append('g')
                             .attr('class', 'plot3d')
    }
    createContext({parentContext})

    if(rotate) {
      let mouse
      parentContext.on('mousedown', () => {
          settings.dragging = true
          mouse = {x: d3.event.pageX, y: d3.event.pageY}
          })
         .on('mouseup', () => {
          settings.dragging = false
          })
         .on('mousemove', () => {
          if(settings.dragging){
            settings.yaw += (d3.event.pageX - mouse.x)/settings.rotationFactor
            settings.pitch += (d3.event.pageY - mouse.y)/settings.rotationFactor
            plot3d.draw()
          }
         })
    }

    if(zoom) {
      const zoomIn = () => {
        settings.zoomFactor*=1.1
        plot3d.draw()
      }

      const zoomOut = () => {
        settings.zoomFactor/=1.1
        plot3d.draw()
      }

      const zoomInButtonGroup = context.append('g')
                                       .style('cursor', 'pointer')
      zoomInButtonGroup.append('rect')
                       .attr('x', 20)
                       .attr('y', 20)
                       .attr('width', 20)
                       .attr('height', 20)
                       .style('stroke', 'black')

      zoomInButtonGroup.append('text')
                       .text('+')
                       .attr('dx', 25)
                       .attr('dy', 35)
                       .style('fill', 'white')
                       .style('user-select', 'none')

      zoomInButtonGroup.on('click', () => zoomIn())

      const zoomOutButtonGroup = context.append('g')
                                        .style('cursor', 'pointer')
      zoomOutButtonGroup.append('rect')
                       .attr('x', 20)
                       .attr('y', 50)
                       .attr('width', 20)
                       .attr('height', 20)

      zoomOutButtonGroup.append('text')
                       .text('-')
                       .attr('dx', 25)
                       .attr('dy', 65)
                       .style('fill', 'white')
                       .style('font-size', 25)
                       .style('user-select', 'none')

      zoomOutButtonGroup.on('click', () => zoomOut())
    }

    return plot3d
  }

  plot3d.axes = ({xRange=1, yRange=1, zRange=1, xAttr={}, yAttr={}, zAttr={}}) => {
    const origin = settings.origin
    const xAxis = {type: 'line', data: [origin, {...origin, x: origin.x+xRange}], attributes: {stroke_width: 1, stroke: 'blue', ...xAttr}} 
    const yAxis = {type: 'line', data: [origin, {...origin, y: origin.y+yRange}], attributes: {stroke_width: 1, stroke: 'red', ...yAttr}} 
    const zAxis = {type: 'line', data: [origin, {...origin, z: origin.z+zRange}], attributes: {stroke_width: 1, stroke: 'green', ...zAttr}} 
    data.push(xAxis)
    data.push(yAxis)
    data.push(zAxis)

    return plot3d
  }

  plot3d.scale = ({scale=100}) => {
    settings.scale = scale

    return plot3d
  }

  plot3d.origin = ({origin={x:0, y:0, z:0}}) => {
    settings.origin = origin

    return plot3d
  }

  plot3d.rotation = ({yaw=-2, pitch=0.66, roll=0}) => { 
    settings.yaw = yaw
    settings.pitch = pitch
    settings.roll = roll

    return plot3d
  }

  plot3d.rotationFactor= ({rotationFactor=1000}) => { 
    settings.rotationFactor = rotationFactor

    return plot3d
  }

  plot3d.zoomFactor = ({zoomFactor=1}) => { 
    settings.zoomFactor = zoomFactor

    return plot3d
  }

  plot3d.plot = (plot) => {
    data.push(plot)

    return plot3d
  }

  plot3d.draw = () => {
    const points = data.filter(d => d.type==='point')
    const lines = data.filter(d => d.type==='line')
    const polygons = data.filter(d => d.type==='polygon')
    const curves = data.filter(d => d.type==='curve')
    const surfaces = data.filter(d => d.type==='surface')

    drawPoints({points, context, settings})
    drawLines({lines, context, settings})
    drawPolygons({polygons, context, settings})
    drawCurves({curves, context, settings})
    drawSurfaces({surfaces, context, settings})

    return plot3d
  }

  return plot3d
}
