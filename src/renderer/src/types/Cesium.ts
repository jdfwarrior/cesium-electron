export interface CameraAndOrientation {
  destination: {
    x: number
    y: number
    z: number
  }
  orientation: {
    heading: number
    pitch: number
    roll: number
  }
}

type CesiumLeftEvents = 'left_down' | 'left_up' | 'left_click' | 'left_double_click'

type CesiumRightEvents = 'right_down' | 'right_up' | 'right_click'
type CesiumMiddleEvents = 'middle_down' | 'middle_up' | 'middle_click'
type CesiumMouseEvents = 'mouse_move' | 'wheel' | 'pinch_start' | 'pinch_end' | 'pinch_move'

export type CesiumEvents =
  | CesiumLeftEvents
  | CesiumRightEvents
  | CesiumMiddleEvents
  | CesiumMouseEvents
