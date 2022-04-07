import { Viewer, CzmlDataSource } from 'cesium'

export const useCesium = () => {

    let viewer = undefined
    let datasource = new CzmlDataSource('entities')

    const init = (id: string) => {
        console.log('loading cesium...')

        viewer = new Viewer(id, {
            navigationHelpButton: false,
            geocoder: false,
        })

        viewer.dataSources.add(datasource)
    }

    const process = (czml: any[]) => [
        datasource?.process(czml)
    ]

    return {
        viewer,
        init,
        datasource,
        process
    }
}