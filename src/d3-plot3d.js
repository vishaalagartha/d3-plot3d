export default function(){  
  var origin = {x: 0, y: 0, z:0}
  var scale = 100
  var yaw = -2
  var pitch = 0.66
  var roll = 0
  var dragging = false
  var rotationSpeed = 1000
  var zoomFactor = 1
  var context = null
  var shift = null

  let data = []

  const createContext = (parentContext) => {
    const parentWidth = parentContext.node().getBoundingClientRect().width
    const parentHeight = parentContext.node().getBoundingClientRect().height
    shift = {x: parentWidth/2, y: parentHeight/2} 
    context = parentContext.append('g')
                           .attr('class', 'plot3d')
  }
  
  let plot3d = (parentContext, rotate = true, zoom = true) => {

    createContext(parentContext)

    if(zoom) {
      const zoomIn = () => {
        zoomFactor*=1.1
        plot3d.draw()
      }

      const zoomOut = () => {
        zoomFactor/=1.1
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

    if(rotate) {
      parentContext.on('mousedown', () => {
          dragging = true
          mouse = {x: d3.event.pageX, y: d3.event.pageY}
          })
         .on('mouseup', () => {
          dragging = false
          })
         .on('mousemove', () => {
          if(dragging){
            yaw += (d3.event.pageX - mouse.x)/rotationSpeed
            pitch += (d3.event.pageY - mouse.y)/rotationSpeed
            plot3d.draw()
          }
         })
    }

    return plot3d
  }

  plot3d.axes = (xRange, yRange, zRange, xAttr={}, yAttr={}, zAttr={}) => {

    const xAxis = {type: 'line', data: [origin, {...origin, x: origin.x+xRange}], attributes: {stroke_width: 1, stroke: 'blue', ...xAttr}} 
    const yAxis = {type: 'line', data: [origin, {...origin, y: origin.y+yRange}], attributes: {stroke_width: 1, stroke: 'red', ...yAttr}} 
    const zAxis = {type: 'line', data: [origin, {...origin, z: origin.z+zRange}], attributes: {stroke_width: 1, stroke: 'green', ...zAttr}} 
    data.push(xAxis)
    data.push(yAxis)
    data.push(zAxis)

    return plot3d
  }

  plot3d.scale = (scale_) => {
    scale = scale_

    return plot3d
  }

  plot3d.origin = (origin_) => {
    origin = origin_

    return plot3d
  }
  plot3d.rotation = (yaw_, pitch_, roll_) => { 
    yaw = yaw_
    pitch = pitch_
    roll = roll_

    return plot3d
  }

  plot3d.rotationSpeed = (rotationSpeed_) => { 
    rotationSpeed = rotationSpeed_

    return plot3d
  }

  plot3d.zoomFactor = (zoomFactor_) => { 
    zoomFactor = zoomFactor_

    return plot3d
  }

  plot3d.plot = (plot) => {
    if(plot.type=='curve'){
      let computedPoints = []
      for(t=plot.data.tMin; t<=plot.data.tMax; t+=plot.data.tStep) {
        computedPoints.push({x: plot.data.x(t), y: plot.data.y(t), z: plot.data.z(t)})
      }
      plot = {...plot, data: computedPoints}
    }
    data.push(plot)

    return plot3d
  }


  const computePixelCoordinates = (p) => {
    const cosA = Math.cos(yaw)
    const sinA = Math.sin(yaw)
    const cosB = Math.cos(pitch)
    const sinB = Math.sin(pitch)
    const cosC = Math.cos(roll)
    const sinC = Math.sin(roll)

    const zoomedP = {x: (p.x-origin.x)*zoomFactor+origin.x, y: (p.y-origin.y)*zoomFactor+origin.y, z: (p.z-origin.z)*zoomFactor+origin.z}
    const shiftedP = {x: scale*(zoomedP.x-origin.x), y: scale*(zoomedP.y-origin.y), z: scale*(zoomedP.z-origin.z)}

    const xVec = {x: cosA*cosC-sinC*sinA*sinB, y: cosC*sinA*sinB+sinC*cosA}
    const yVec = {x: -cosC*sinA-sinC*cosA*sinB, y: cosC*cosA*sinB-sinC*sinA}
    const zVec = {x: -sinC*cosB, y: cosC*cosB}
    
    const x = shiftedP.x*xVec.x+shiftedP.y*yVec.x+shiftedP.z*zVec.x
    const y = shiftedP.x*xVec.y+shiftedP.y*yVec.y+shiftedP.z*zVec.y
    return {x: x + shift.x, y: -y + shift.y}
  }

  const drawPoints = (data) => {
    let pointsDataJoin = context.selectAll('circle.data').data(data)

    pointsDataJoin.enter().append('circle')
                          .merge(pointsDataJoin)
                          .transition()
                          .duration(() => dragging ? 0 : 1000)
                          .attr('class', 'data')
                          .attr('cx', d => d.data[0].x)
                          .attr('cy', d => d.data[0].y)
                          .attr('r', 3)
                          
    pointsDataJoin.exit().remove()
  }

  const drawLines = (data) => {
    let linesDataJoin = context.selectAll('line.data').data(data)

    linesDataJoin.enter().append('line')
                         .merge(linesDataJoin)
                         .transition()
                         .duration(() => dragging ? 0 : 200)
                         .attr('class', 'data')
                         .attr('x1', d => d.data[0].x)
                         .attr('y1', d => d.data[0].y)
                         .attr('x2', d => d.data[1].x)
                         .attr('y2', d => d.data[1].y)
                         .attr('stroke-width', d => d.attributes.stroke_width ? d.attributes.stroke_width : 0.3)
                         .attr('stroke', d => d.attributes.stroke ? d.attributes.stroke : 'black')
    
    linesDataJoin.exit().remove()
  }

  const drawPolygons = (data) => {
    let polygonsDataJoin = context.selectAll('polygon.data').data(data)

    polygonsDataJoin.enter().append('polygon')
                         .merge(polygonsDataJoin)
                         .transition()
                         .duration(() => dragging ? 0 : 200)
                         .attr('class', 'data')
                         .attr('points', d => d.data.map(p => [p.x, p.y].join(','))) 
                         .attr('fill', d => d.attributes.fill ? d.attributes.fill : 'black')
                         .attr('opacity', d => d.attributes.opacity ? d.attributes.opacity : 0.8)
    
    polygonsDataJoin.exit().remove()
  }

  const drawCurves = (data) => {
    let curveGenerator = d3.line()
                          .curve(d3.curveCardinal)


    let curvesDataJoin = context.selectAll('path.data').data(data)

    curvesDataJoin.enter().append('path')
                         .merge(curvesDataJoin)
                         .transition()
                         .attr('class', 'data')
                         .duration(() => dragging ? 0 : 200)
                         .attr('d', d => curveGenerator(d.data.map(p => [p.x, p.y])))
                         .attr('fill', 'none')
                         .attr('stroke-width', d => d.attributes.stroke_width ? d.attributes.stroke_width : 0.3)
                         .attr('stroke', d => d.attributes.stroke ? d.attributes.stroke : 'black')

    
    curvesDataJoin.exit().remove()
  }

  const drawSurfaces = (data) => {
    let polygons = []
    const colorSchemes = ['Blues', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds']
    data.forEach((surface, i) => {
      polygons.push({data: [], colorScheme: null})

      let x = -scale+origin.x
      let minZ = Infinity
      let maxZ = -Infinity
      let increment = 1/zoomFactor
      while(x<=scale+origin.x){
        let y = -scale+origin.y
        while(y<=scale+origin.y){
          const z1 = surface.data.z(x, y)
          const z2 = surface.data.z(x+increment, y)
          const z3 = surface.data.z(x, y+increment)
          const z4 = surface.data.z(x+increment, y+increment)
          const p1 = computePixelCoordinates({x, y, z: z1})
          if(z1<minZ) minZ = z1 
          if(z1>maxZ) maxZ = z1
          const p2 = computePixelCoordinates({x: x+increment, y, z: z2})
          if(z2<minZ) minZ = z2 
          if(z2>maxZ) maxZ = z2
          const p3 = computePixelCoordinates({x, y: y+increment, z: z3})
          if(z3<minZ) minZ = z3 
          if(z3>maxZ) maxZ = z3
          const p4 = computePixelCoordinates({x: x+increment, y: y+increment, z: z4})
          if(z4<minZ) minZ = z4 
          if(z4>maxZ) maxZ = z4

          const avgZ = (z1+z2+z3+z4)/4.0
          polygons[polygons.length-1].data.push({points: [p1, p2, p4, p3], avgZ})
          y+=increment
        }
        x+=increment
      }
      const selectedScheme = surface.attributes.fill ? `${surface.attributes.fill.charAt(0).toUpperCase() + surface.attributes.fill.slice(1)}s` : colorSchemes[i]

      const colorScheme = d3.scaleSequential(d3[`interpolate${selectedScheme}`]).domain([maxZ, minZ])
      polygons[polygons.length-1].colorScheme = colorScheme
    })

      
    polygons.forEach((surface, i) => {
      let polygonsDataJoin = context.selectAll(`polygon.surface${i}`).data(surface.data)

      polygonsDataJoin.enter().append('polygon')
                           .merge(polygonsDataJoin)
                           .transition()
                           .duration(() => dragging ? 0 : 200)
                           .attr('class', `surface${i}`)
                           .attr('points', d => d.points.map(p => [p.x, p.y].join(','))) 
                           .attr('fill', d => surface.colorScheme(d.avgZ))
                           .attr('opacity', d => d.opacity ? d.opacity : 0.8)
      polygonsDataJoin.exit().remove()

    })
  }

  plot3d.draw = () => {
    let transformedData = data.map(d => {
      if(d.type==='surface') return d
      return {...d, data: d.data.map(p => computePixelCoordinates(p, yaw, pitch, roll, origin))}
    })

    let points = transformedData.filter(d => d.type==='point')
    let lines = transformedData.filter(d => d.type==='line')
    let polygons = transformedData.filter(d => d.type==='polygon')
    let curves = transformedData.filter(d => d.type==='curve')
    let surfaces = transformedData.filter(d => d.type==='surface')
    drawPoints(points)
    drawLines(lines)
    drawPolygons(polygons)
    drawCurves(curves)
    drawSurfaces(surfaces)

    return plot3d
  }

  return plot3d
}
