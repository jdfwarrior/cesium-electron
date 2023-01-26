import { ref, reactive, toRefs } from "vue";
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
  Timeline,
} from "cesium";
import type { Entity } from "cesium";
import type { CameraAndOrientation, CesiumEvents } from "@/types/Cesium";

// Intialize the default camera view within Cesium
// We could initialize Cesium with a custom Camera but then we wouldn't
// get the nice animation when the UI loads.
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

let viewer: Viewer | undefined;
let defaultScreenSpaceHandler: ScreenSpaceEventHandler | undefined;
const datasource = new CzmlDataSource("entities");
const mouseLatitude = ref(0);
const mouseLongitude = ref(0);
const isPlaying = ref(true);
const currentTime = ref("");
const czmlCallbacks = new Set<(entity: Entity, packet: any) => void>();
const selectedEntityChangedCallbacks = new Set<
  (entity: Entity | undefined) => void
>();

const state = reactive<{
  selected: Entity | undefined;
  timeline: Timeline | undefined;
  currentISO: string | undefined;
  currentJulian: JulianDate | undefined;
}>({
  selected: undefined,
  timeline: undefined,
  currentISO: undefined,
  currentJulian: undefined,
});

export const useCesium = () => {
  const init = (id: string) => {
    viewer = new Viewer(id, {
      navigationHelpButton: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      animation: false,
      shouldAnimate: true,
      targetFrameRate: 40,
      requestRenderMode: true,
      infoBox: false,
      selectionIndicator: false,
      timeline: false,
    });

    // Set the default view when loaded
    home();

    // Add the default czml datasource into Cesium
    viewer.dataSources.add(datasource);

    // Add a default screenspaceeventhandler for managing events within Cesium
    const { canvas } = viewer.scene;
    defaultScreenSpaceHandler = new ScreenSpaceEventHandler(canvas);

    // Track mouse location so that it can be displayed to the user
    watchMousePosition();
    // Track the current animation time and reformat it for display
    watchClock();

    // Add the base czml datasource updater that will loop through the list
    // of czml callbacks that have been added to the application and call each
    // with the current entity and czml packet.
    CzmlDataSource.updaters.push((entity: Entity, packet: any) => {
      czmlCallbacks.forEach((callback) => callback(entity, packet));
    });

    viewer.selectedEntityChanged.addEventListener(
      (entity: Entity | undefined) => {
        selectedEntityChangedCallbacks.forEach((callback) => callback(entity));
        state.selected = entity;
      }
    );
  };

  const process = (czml: any[]) => datasource?.process(czml);

  /**
   * Gets and returns the current camera view and orientation so that it can be
   * saved or restored later
   */
  function getCamera(): CameraAndOrientation | undefined {
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

      return result;
    } catch (err) {
      console.warn(`[getCamera]`);
      console.warn(err);
      return undefined;
    }
  }

  /**
   * Resets the current camera view back to the default saved camera and orientation
   */
  function home() {
    if (!viewer) throw new Error(`No viewer instance available`);

    try {
      viewer.camera.flyTo(defaultView);
    } catch (err) {
      console.warn(`[home]`);
      console.warn(err);
    }
  }

  /**
   * Enables Cesium animation functionality
   */
  function play() {
    if (!viewer) throw new Error(`No viewer instance available`);
    viewer.clock.shouldAnimate = true;
    isPlaying.value = true;
  }

  /**
   * Pauses the Cesium animation functionality
   */
  function pause() {
    if (!viewer) throw new Error(`No viewer instance available`);
    viewer.clock.shouldAnimate = false;
    isPlaying.value = false;
  }

  /**
   * Removes all entities from the default czml data source
   */
  function clear() {
    datasource.entities.removeAll();
  }

  /**
   * Watches the current mouse location on the Cesium visualization
   * and updates local references to the new latitude/longitude values
   */
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

  /**
   * Watches for the clock `tick` event within Cesium and converts
   * the new julian date/time to a standard Gregorian date/time
   * and sets the value of a local ref to that date/time in a standardized
   * format for consumption
   * @example `Apr 25 2022 20:30:47`
   */
  function watchClock() {
    if (!viewer) throw new Error(`No viewer instance available`);

    viewer.clock.onTick.addEventListener(() => {
      const julian = viewer?.clock.currentTime;
      if (!julian) return;
      const asDate = JulianDate.toDate(julian);
      currentTime.value = format(asDate, "MMM dd yyyy HH:mm:ss");
      state.currentISO = asDate.toISOString();
      state.currentJulian = julian;
    });
  }

  /**
   * Wrapper around the Cesium screenspace event handler to standardize it's use
   * and make it similar to how most other event listeners function within Nodejs.
   * @param event the event to listen for
   * @param callback the callback function to execute when that event is fired
   */
  function on(event: CesiumEvents, callback: (...params: any[]) => any) {
    if (!defaultScreenSpaceHandler) return;
    defaultScreenSpaceHandler.setInputAction(
      callback,
      ScreenSpaceEventType[event.toUpperCase()]
    );
  }

  /**
   * Converts a provided Cartesian2 or Cartesian3 value to a Cartographic
   * value and converts the latitude/longitude result values to degrees
   * as opposed to radians (the default)
   * @param position
   */
  function getCartographic(position: Cartesian2 | Cartesian3):
    | {
        latitude: number;
        longitude: number;
      }
    | undefined {
    let latitude = 0;
    let longitude = 0;

    try {
      if (position instanceof Cartesian2) {
        const cartesian = viewer?.scene.camera.pickEllipsoid(position);
        if (!cartesian) return;
        const cartographic = Cartographic.fromCartesian(cartesian);
        if (!cartographic) return;
        latitude = CMath.toDegrees(cartographic.latitude);
        longitude = CMath.toDegrees(cartographic.longitude);
      } else if (position instanceof Cartesian3) {
        const cartographic = Cartographic.fromCartesian(position);
        if (!cartographic) return;
        latitude = CMath.toDegrees(cartographic.latitude);
        longitude = CMath.toDegrees(cartographic.longitude);
      }

      return { latitude, longitude };
    } catch (err) {
      return { latitude, longitude };
    }
  }

  /**
   * Returns an array of picked entity ids at the given location
   * @param position the picked cartesian2 location
   * @param limit limit to X number of picked entities. can increase performance (default: 5)
   */
  function getPicked(position: Cartesian2, limit = 5): string[] {
    try {
      if (!viewer) return [];
      const picked = viewer?.scene.drillPick(position, limit);
      return picked.map((entity) => entity.id.id);
    } catch (err) {
      return [];
    }
  }

  /**
   * Set the animation playback multiplier to the provided numeric value
   * @param multiplier the numeric multiplier
   */
  function setSpeed(multiplier: number) {
    try {
      if (!viewer) return;
      viewer.clock.multiplier = multiplier;
    } catch (err) {
      console.warn(`Unable to set the playback multiplier`);
    }
  }

  /**
   * Simple function that will, as czml packets are processed, will add a modified
   * date of the current date/time to the entity so that we can track when it was
   * last updated
   * @param entity the entity that matches the provided czml packet
   * @param packet the czml packet being processed
   */
  function addModified(entity: Entity & { modified?: string }, packet: any) {
    if (!entity?.modified) entity.addProperty("modified");
    entity.modified = new Date().toISOString();
  }

  czmlCallbacks.add(addModified);

  function whenEntitySelected(callback: (entity: Entity | undefined) => void) {
    selectedEntityChangedCallbacks.add(callback);
    return () => selectedEntityChangedCallbacks.delete(callback);
  }

  function createTimeline(selector: string) {
    const ele = document.querySelector(selector);
    if (!ele) return;
    if (!viewer) return;
    state.timeline = new Timeline(ele, viewer?.clock);

    window.addEventListener("resize", refreshTimeline);
  }

  function refreshTimeline() {
    state.timeline?.resize();
  }

  function selectById(id: string) {
    try {
      if (!viewer) return;
      if (!datasource) return;
      const entity = datasource.entities.values.find(
        (entity) => entity.id === id
      );
      if (!entity) return;
      viewer.selectedEntity = entity;
    } catch (err) {
      console.warn(`[cesium] unable to select entity with the provided id`);
    }
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
    on,
    getCartographic,
    getPicked,
    setSpeed,
    whenEntitySelected,
    createTimeline,
    refreshTimeline,
    selectById,
    ...toRefs(state),
  };
};
