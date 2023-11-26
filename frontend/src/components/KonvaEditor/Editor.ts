import { Stage } from "konva/lib/Stage"
import { Group } from "konva/lib/Group"
import { Image } from "konva/lib/shapes/Image"

export interface GridCoords {
    x: number,
    y: number
}

export interface ConfigKonva {
    width: number,
    height: number,
    draggable?: boolean,
    name: string,
}

export interface KonvaStage {
    getNode (): Stage
}

export interface KonvaGroup {
    getNode (): Group
}

export interface KonvaImage {
    getNode (): Group
}

export interface KonvaWheelEvent {
    currentTarget?: Stage |Image |null;
    evt: WheelEvent;
    type: string
    target: Stage |Image |null
}

export interface KonvaDragEvent {
    currentTarget?: Stage |Image |null;
    evt: WheelEvent;
    type: string
    target: Stage |Image |null
}