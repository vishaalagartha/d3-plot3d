import projection from './projection'

const drawPoints = ({points, context, settings}) => {
  const transformedData = points.map(d => 
    { return {...d, data: d.data.map(p => projection({p, settings}))} } 
  )

  let pointsDataJoin = context.selectAll('circle.data').data(transformedData)

  pointsDataJoin.enter().append('circle')
                        .merge(pointsDataJoin)
                        .transition()
                        .duration(() => settings.dragging ? 0 : 1000)
                        .attr('class', d => `data ${d.attributes.class}`)
                        .attr('cx', d => d.data[0].x)
                        .attr('cy', d => d.data[0].y)
                        .attr('r', d => d.attributes.radius ? d.attributes.radius : 3)
                        .attr('fill', d => d.attributes.fill ? d.attributes.fill : 'black')
                        
  pointsDataJoin.exit().remove()
}

const drawLines = ({lines, context, settings}) => {
  const transformedData = lines.map(d => 
    { return {...d, data: d.data.map(p => projection({p, settings}))} } 
  )

  let linesDataJoin = context.selectAll('line.data').data(transformedData)

  linesDataJoin.enter().append('line')
                       .merge(linesDataJoin)
                       .transition()
                       .duration(() => settings.dragging ? 0 : 200)
                       .attr('class', d => `data ${d.attributes.class}`)
                       .attr('x1', d => d.data[0].x)
                       .attr('y1', d => d.data[0].y)
                       .attr('x2', d => d.data[1].x)
                       .attr('y2', d => d.data[1].y)
                       .attr('stroke-width', d => d.attributes.stroke_width ? d.attributes.stroke_width : 0.3)
                       .attr('stroke', d => d.attributes.stroke ? d.attributes.stroke : 'black')
  
  linesDataJoin.exit().remove()
}

const drawPolygons = ({polygons, context, settings}) => {
  const transformedData = polygons.map(d => 
    { return {...d, data: d.data.map(p => projection({p, settings}))} } 
  )

  let polygonsDataJoin = context.selectAll('polygon.data').data(transformedData)

  polygonsDataJoin.enter().append('polygon')
                       .merge(polygonsDataJoin)
                       .transition()
                       .duration(() => settings.dragging ? 0 : 200)
                       .attr('class', d => `data ${d.attributes.class}`)
                       .attr('points', d => d.data.map(p => [p.x, p.y].join(','))) 
                       .attr('fill', d => d.attributes.fill ? d.attributes.fill : 'black')
                       .attr('opacity', d => d.attributes.opacity ? d.attributes.opacity : 0.8)
  
  polygonsDataJoin.exit().remove()
}

const drawCurves = ({curves, context, settings}) => {
  let computedCurves = []
  curves.forEach(plot => {
    let computedPoints = []
    let t
    for(t=plot.data.tMin; t<=plot.data.tMax; t+=plot.data.tStep) {
      computedPoints.push({x: plot.data.x(t), y: plot.data.y(t), z: plot.data.z(t)})
    }
    computedCurves.push({...plot, data: computedPoints})
  })

  const transformedData = computedCurves.map(d => 
    { return {...d, data: d.data.map(p => projection({p, settings}))} } 
  )

  let curveGenerator = d3.line()
                        .curve(d3.curveCardinal)

  let curvesDataJoin = context.selectAll('path.data').data(transformedData)

  curvesDataJoin.enter().append('path')
                       .merge(curvesDataJoin)
                       .transition()
                       .attr('class', d => `data ${d.attributes.class}`)
                       .duration(() => settings.dragging ? 0 : 200)
                       .attr('d', d => curveGenerator(d.data.map(p => [p.x, p.y])))
                       .attr('fill', 'none')
                       .attr('stroke-width', d => d.attributes.stroke_width ? d.attributes.stroke_width : 0.3)
                       .attr('stroke', d => d.attributes.stroke ? d.attributes.stroke : 'black')

  
  curvesDataJoin.exit().remove()
}

const drawSurfaces = ({surfaces, context, settings}) => {
  let polygons = []
  const colorSchemes = ['Blues', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds']
  surfaces.forEach((surface, i) => {
    polygons.push({data: []})

    let x = -settings.scale+settings.origin.x
    let minZ = Infinity
    let maxZ = -Infinity
    const increment = 1/settings.zoomFactor
    while(x<=settings.scale+settings.origin.x){
      let y = -settings.scale+settings.origin.y
      while(y<=settings.scale+settings.origin.y){
        const z1 = surface.data.z(x, y)
        const z2 = surface.data.z(x+increment, y)
        const z3 = surface.data.z(x, y+increment)
        const z4 = surface.data.z(x+increment, y+increment)
        const p1 = projection({p: {x, y, z: z1}, settings})
        if(z1<minZ) minZ = z1 
        if(z1>maxZ) maxZ = z1
        const p2 = projection({p: {x: x+increment, y, z: z2}, settings})
        if(z2<minZ) minZ = z2 
        if(z2>maxZ) maxZ = z2
        const p3 = projection({p: {x, y: y+increment, z: z3}, settings})
        if(z3<minZ) minZ = z3 
        if(z3>maxZ) maxZ = z3
        const p4 = projection({p: {x: x+increment, y: y+increment, z: z4}, settings})
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
    polygons[polygons.length-1].opacity = surface.attributes.opacity ? surface.attributes.opacity : null
    polygons[polygons.length-1].class = surface.attributes.class ? surface.attributes.class : null
  })

    
  polygons.forEach((surface, i) => {
    let polygonsDataJoin = context.selectAll(`polygon.surface${i}`).data(surface.data)

    polygonsDataJoin.enter().append('polygon')
                         .merge(polygonsDataJoin)
                         .transition()
                         .duration(() => settings.dragging ? 0 : 200)
                         .attr('class', d => `surface${i} ${surface.class}`)
                         .attr('points', d => d.points.map(p => [p.x, p.y].join(','))) 
                         .attr('fill', d => surface.colorScheme(d.avgZ))
                         .attr('opacity', d => surface.opacity ? surface.opacity : 0.8)
    polygonsDataJoin.exit().remove()

  })
}

export { drawPoints, drawLines, drawPolygons, drawCurves, drawSurfaces }
