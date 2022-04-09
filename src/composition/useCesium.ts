import { ref } from "vue";
import { format } from "date-fns";
import {
  Viewer,
  CzmlDataSource,
  Cartesian2,
  Cartesian3,
  Cartographic,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Math as CMath,
  JulianDate,
} from "cesium";

const defaultView = {
  destination: new Cartesian3(
    -225044.32383565657,
    -10753773.416297555,
    7907327.864891608
  ),
  orientation: {
    heading: 1.7763568394002505e-15,
    pitch: -1.5707963267948966,
    roll: 0,
  },
};

let viewer: Viewer | undefined = undefined;
let datasource = new CzmlDataSource("entities");
const mouseLatitude = ref(0);
const mouseLongitude = ref(0);
const isPlaying = ref(true);
const currentTime = ref("");

export const useCesium = () => {

  const init = (id: string) => {
    console.log("loading cesium...");

    viewer = new Viewer(id, {
      navigationHelpButton: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      animation: false,
      shouldAnimate: true,
    });

    home();

    viewer.dataSources.add(datasource);

    watchMousePosition();
    watchClock();
  };

  const process = (czml: any[]) => [datasource?.process(czml)];

  function getCamera() {
    if (!viewer) throw new Error(`No viewer instance available`);

    try {
      const position = viewer.camera.positionWC;
      const { x, y, z } = position;
      const heading = viewer.camera.heading;
      const pitch = viewer.camera.pitch;
      const roll = viewer.camera.roll;
      const result = {
        destination: { x, y, z },
        orientation: {
          heading,
          pitch,
          roll,
        },
      };

      console.log(result);
      return result;
    } catch (err) {
      console.warn(`[getCamera]`);
      console.warn(err);
      return undefined;
    }
  }

  function home() {
    if (!viewer) throw new Error(`No viewer instance available`);

    try {
      viewer.camera.flyTo(defaultView);
    } catch (err) {
      console.warn(`[home]`);
      console.warn(err);
    }
  }

  function play() {
    if (!viewer) throw new Error(`No viewer instance available`);
    viewer.clock.shouldAnimate = true;
    isPlaying.value = true;
  }

  function pause() {
    if (!viewer) throw new Error(`No viewer instance available`);
    viewer.clock.shouldAnimate = false;
    isPlaying.value = false;
  }

  function clear() {
    datasource.entities.removeAll()
  }

  function watchMousePosition() {
    if (!viewer) throw new Error(`No viewer instance available`);

    try {
      const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(
        (event: { startPosition: Cartesian2; endPosition: Cartesian2 }) => {
          const { endPosition } = event;
          if (endPosition) {
            const cartesian = viewer?.scene.camera.pickEllipsoid(endPosition);
            if (!cartesian) return;
            const cartographic = Cartographic.fromCartesian(cartesian);
            if (!cartographic) return;
            const latitude = CMath.toDegrees(cartographic.latitude);
            const longitude = CMath.toDegrees(cartographic.longitude);

            mouseLatitude.value = +latitude.toFixed(4);
            mouseLongitude.value = +longitude.toFixed(4);
          } else {
            console.warn(`No end position found`);
          }
        },
        ScreenSpaceEventType.MOUSE_MOVE
      );
    } catch (err) {
      console.warn(`[watchMousePosition]`);
      console.warn(err);
    }
  }

  function watchClock() {
    if (!viewer) throw new Error(`No viewer instance available`);

    viewer.clock.onTick.addEventListener(() => {
      const julian = viewer?.clock.currentTime;
      if (!julian) return;
      const asDate = JulianDate.toDate(julian);
      currentTime.value = format(asDate, "MMM dd yyyy HH:mm:ss");
    });
  }

  return {
    viewer,
    init,
    datasource,
    process,
    home,
    getCamera,
    mouseLatitude,
    mouseLongitude,
    isPlaying,
    play,
    pause,
    clear,
    currentTime,
  };
};
