import type { Entity } from "cesium";

export function hasBillboard(entity: Entity | undefined) {
  return !!entity?.billboard;
}

export function hasBox(entity: Entity | undefined) {
  return !!entity?.box;
}

export function hasCorridor(entity: Entity | undefined) {
  return !!entity?.corridor;
}

export function hasCylinder(entity: Entity | undefined) {
  return !!entity?.cylinder;
}

export function hasEllipse(entity: Entity | undefined) {
  return !!entity?.ellipse;
}

export function hasEllipsoid(entity: Entity | undefined) {
  return !!entity?.ellipsoid;
}

export function hasLabel(entity: Entity | undefined) {
  return !!entity?.label;
}

export function hasModel(entity: Entity | undefined) {
  return !!entity?.model;
}

export function hasPath(entity: Entity | undefined) {
  return !!entity?.path;
}

export function hasPoint(entity: Entity | undefined) {
  return !!entity?.point;
}

export function hasPolygon(entity: Entity | undefined) {
  return !!entity?.polygon;
}

export function hasPolyline(entity: Entity | undefined) {
  return !!entity?.polyline;
}

export function hasPolylineVolume(entity: Entity | undefined) {
  return !!entity?.polylineVolume;
}

export function hasRectangle(entity: Entity | undefined) {
  return !!entity?.rectangle;
}

export function hasWall(entity: Entity | undefined) {
  return !!entity?.wall;
}
