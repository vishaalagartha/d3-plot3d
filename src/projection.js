export default function({p, settings}){
  const {yaw, pitch, roll, scale, origin, shift, rotationFactor, zoomFactor} = settings

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
