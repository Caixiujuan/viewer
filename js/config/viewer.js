define([
    'esri/units',
    'esri/geometry/Extent',
    'esri/config',
    /*'esri/urlUtils',*/
    'esri/tasks/GeometryService',
    'esri/layers/ImageParameters',
    'gis/plugins/Google',
    'dojo/i18n!./nls/main',
    'dojo/topic',
    'dojo/sniff'
], function (units, Extent, esriConfig, /*urlUtils,*/ GeometryService, ImageParameters, GoogleMapsLoader, i18n, topic, has) {

    // url to your proxy page, must be on same machine hosting you app. See proxy folder for readme.
    esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
    esriConfig.defaults.io.alwaysUseProxy = false;

    // add a proxy rule to force specific domain requests through proxy
    // be sure the domain is added in proxy.config
    /*urlUtils.addProxyRule({
        urlPrefix: 'www.example.com',
        proxyUrl: 'proxy/proxy.ashx'
    });*/

    // url to your geometry server.
    esriConfig.defaults.geometryService = new GeometryService('https://10.10.11.94:6443/arcgis/rest/services/Utilities/Geometry/GeometryServer');

    // Use your own Google Maps API Key.
    // https://developers.google.com/maps/documentation/javascript/get-api-key
    GoogleMapsLoader.KEY = 'NOT-A-REAL-API-KEY';

    // helper function returning ImageParameters for dynamic layers
    // example:
    // imageParameters: buildImageParameters({
    //     layerIds: [0],
    //     layerOption: 'show'
    // })
    function buildImageParameters (config) {
        config = config || {};
        var ip = new ImageParameters();
        //image parameters for dynamic services, set to png32 for higher quality exports
        ip.format = 'png32';
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                ip[key] = config[key];
            }
        }
        return ip;
    }

    //some example topics for listening to menu item clicks
    //these topics publish a simple message to the growler
    //in a real world example, these topics would be used
    //in their own widget to listen for layer menu click events
    topic.subscribe('layerControl/hello', function (event) {
        topic.publish('growler/growl', {
            title: 'Hello!',
            message: event.layer._titleForLegend + ' ' +
                (event.subLayer ? event.subLayer.name : '') +
                ' says hello'
        });
    });
    topic.subscribe('layerControl/goodbye', function (event) {
        topic.publish('growler/growl', {
            title: 'Goodbye!',
            message: event.layer._titleForLegend + ' ' +
                (event.subLayer ? event.subLayer.name : '') +
                ' says goodbye'
        });
    });

    return {
        // used for debugging your app
        isDebug: true,

        //default mapClick mode, mapClickMode lets widgets know what mode the map is in to avoid multipult map click actions from taking place (ie identify while drawing).
        defaultMapClickMode: 'identify',
        // map options, passed to map constructor. see: https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1
        mapOptions: {
            basemap: 'streets',
            center: [132.58, 46.84],
            zoom: 8,
            sliderStyle: 'small'
        },

        //webMapId: 'ef9c7fbda731474d98647bebb4b33c20',  // High Cost Mortgage
        // webMapOptions: {},

        // panes: {
        // 	left: {
        // 		splitter: true
        // 	},
        // 	right: {
        // 		id: 'sidebarRight',
        // 		placeAt: 'outer',
        // 		region: 'right',
        // 		splitter: true,
        // 		collapsible: true
        // 	},
        // 	bottom: {
        // 		id: 'sidebarBottom',
        // 		placeAt: 'outer',
        // 		splitter: true,
        // 		collapsible: true,
        // 		region: 'bottom'
        // 	},
        // 	top: {
        // 		id: 'sidebarTop',
        // 		placeAt: 'outer',
        // 		collapsible: true,
        // 		splitter: true,
        // 		region: 'top'
        // 	}
        // },
        // collapseButtonsPane: 'center', //center or outer

        // custom titles
        titles: {
            header: i18n.viewer.titles.header,
            subHeader: i18n.viewer.titles.subHeader,
            pageTitle: i18n.viewer.titles.pageTitle
        },

        layout: {
            /*  possible options for sidebar layout:
                    true - always use mobile sidebar, false - never use mobile sidebar,
                    'mobile' - use sidebar for phones and tablets, 'phone' - use sidebar for phones,
                    'touch' - use sidebar for all touch devices, 'tablet' - use sidebar for tablets only (not sure why you'd do this?),
                    other feature detection supported by dojo/sniff and dojo/has- http://dojotoolkit.org/reference-guide/1.10/dojo/sniff.html

                default value is 'phone'
            */
            //sidebar: 'phone'
        },

        // user-defined layer types
        /*
        layerTypes: {
            myCustomLayer: 'widgets/MyCustomLayer'
        },
        */

        // user-defined widget types
        /*
        widgetTypes: [
            'myWidgetType'
        ],
        */

        // operationalLayers: Array of Layers to load on top of the basemap: valid 'type' options: 'dynamic', 'tiled', 'feature'.
        // The 'options' object is passed as the layers options for constructor. Title will be used in the legend only. id's must be unique and have no spaces.
        // 3 'mode' options: MODE_SNAPSHOT = 0, MODE_ONDEMAND = 1, MODE_SELECTION = 2
        operationalLayers: [{
            type: 'feature',
            url: 'https://10.10.11.94:6443/arcgis/rest/services/HLJwetland/Heilongjiangwetland/FeatureServer/0',
            title: 'Sanhuanpao NNR boundaryline',
            options: {
                id: 'HLJwetlands',
                opacity: 1.0,
                visible: true,
                outFields: ['*'],
                mode: 0
            },
            editorLayerInfos: {
                disableGeometryUpdate: false
            },
            legendLayerInfos: {
                exclude: false,
                layerInfo: {
                    title: i18n.viewer.operationalLayers.restaurants
                }
            },
            layerControlLayerInfos: {
                layerGroup: 'NNR basic layers'
            }
        }, {
            type: 'feature',
            url: 'https://10.10.11.94:6443/arcgis/rest/services/HLJwetland/Heilongjiangwetland/FeatureServer/1',
            title: 'Sanhuanpao NNR boundaryPolgon',
            options: {
                id: 'sf311Incidents',
                opacity: 1.0,
                visible: false,
                outFields: ['req_type', 'req_date', 'req_time', 'address', 'district'],
                mode: 0
            },
            layerControlLayerInfos: {
                layerGroup: 'NNR basic Layers',
                menu: [{
                    topic: 'hello',
                    label: 'Say Hello Custom',
                    iconClass: 'fa fa-smile-o'
                }]
            }
        }, {
            type: 'dynamic',
            url: 'https://10.10.11.94:6443/arcgis/rest/services/HLJwetland/Heilongjiangwetland/MapServer',
            title: 'Heilongjiangwetland layers',
            options: {
                id: 'louisvillePubSafety',
                opacity: 1.0,
                visible: true,
                imageParameters: buildImageParameters({
                    //layerIds: [0, 2, 4, 5, 8, 10, 12, 21],
					layerIds: [0, 1, 2, 3, 4, 10, 12, 21],
                    layerOption: 'show'
                })
            },
            identifyLayerInfos: {
               // layerIds: [2, 4, 5, 8, 12, 21]
			   layerIds: [0, 1, 2, 3, 4, 21]
            },
            layerControlLayerInfos: {
                //layerIds: [0, 2, 4, 5, 8, 9, 10, 12, 21]
				 layerIds: [0, 1, 2, 3, 4, 9, 10, 12, 21]
            },
            legendLayerInfos: {
                layerInfo: {
                    hideLayers: [21]
                }
            }
        }, {
            type: 'dynamic',
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
            title: i18n.viewer.operationalLayers.damageAssessment,
            options: {
                id: 'damageAssessment',
                opacity: 1.0,
                visible: true,
                imageParameters: buildImageParameters()
            },
            legendLayerInfos: {
                exclude: true
            },
            layerControlLayerInfos: {
                swipe: true,
                metadataUrl: true,
                expanded: true,

                //override the menu on this particular layer
                subLayerMenu: [{
                    topic: 'hello',
                    label: 'Say Hello',
                    iconClass: 'fa fa-smile-o'
                }]
            }
        }, {
            type: 'dynamic',
            url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/SampleWorldCities/MapServer',
            title: i18n.viewer.operationalLayers.cities,
            options: {
                id: 'cities',
                visible: false
            }
        /*
        //examples of vector tile layers (beta in v3.15)
        }, {
            type: 'vectortile',
            title: 'Light Gray Canvas Vector',
            url: 'https//www.arcgis.com/sharing/rest/content/items/bdf1eec3fa79456c8c7c2bb62f86dade/resources/styles/root.json',
            options: {
                id: 'vectortile1',
                opacity: 0.8,
                visible: true
            }	
        }, {
           //  taken from this demo: https://github.com/ycabon/presentations/blob/gh-pages/2015-berlin-plenary/demos/3.15-vectortile/create-by-style-object.html
            type: 'vectortile',
            title: 'Custom Vector Style',
            options: {
                id: 'vectortile2',
                opacity: 1.0,
                visible: true,
                'glyphs': 'https://www.arcgis.com/sharing/rest/content/items/00cd8e843bae49b3a040423e5d65416b/resources/fonts/{fontstack}/{range}.pbf',
                'sprite': 'https://www.arcgis.com/sharing/rest/content/items/00cd8e843bae49b3a040423e5d65416b/resources/sprites/sprite',
                'version': 8,
                'sources': {
                    'esri': {
                        'url': 'https://basemapsdev.arcgis.com/arcgis/rest/services/World_Basemap/VectorTileServer',
                        'type': 'vector'
                    }
                },
                'layers': [{
                    'id': 'background',
                    'type': 'background',
                    'paint': {
                        'background-color': '#556688'
                    }
                }, {
                    'id': 'Land',
                    'type': 'fill',
                    'source': 'esri',
                    'source-layer': 'Land',
                    'paint': {
                        'fill-color': '#273344'
                    },
                }, {
                    'id': 'roads',
                    'type': 'line',
                    'source': 'esri',
                    'source-layer': 'Road',
                    'layout': {
                        'line-join': 'round'
                    },
                    'paint': {
                        'line-width': 1,
                        'line-color': '#131622'
                    }
                }]
            }
        */
        }],
        // set include:true to load. For titlePane type set position the the desired order in the sidebar
        widgets: {
            growler: {
                include: true,
                id: 'growler',
                type: 'layout',
                path: 'gis/dijit/Growler',
                placeAt: document.body,
                options: {
                    style: 'position:absolute;top:15px;' + (has('phone') ? 'left:50%;transform:translate(-50%,0);' : 'right:15px;')
                }
            },
            search: {
                include: true,
                type: has('phone') ? 'titlePane' : 'ui',
                path: 'esri/dijit/Search',
                placeAt: has('phone') ? null : 'top-center',
                title: i18n.viewer.widgets.search,
                iconClass: 'fa-search',
                position: 0,
                options: {
                    map: true,
                    visible: true,
                    enableInfoWindow: false,
                    enableButtonMode: has('phone') ? false : true,
                    expanded: has('phone') ? true : false
                }
            },
            basemaps: {
                include: true,
                id: 'basemaps',
                type: 'ui',
                path: 'gis/dijit/Basemaps',
                placeAt: 'top-right',
                position: 'first',
                options: 'config/basemaps'
            },
            identify: {
                include: true,
                id: 'identify',
                type: 'titlePane',
                path: 'gis/dijit/Identify',
                title: i18n.viewer.widgets.identify,
                iconClass: 'fa-info-circle',
                open: false,
                preload: true,
                position: 3,
                options: 'config/identify'
            },
            mapInfo: {
                include: false,
                id: 'mapInfo',
                type: 'domNode',
                path: 'gis/dijit/MapInfo',
                srcNodeRef: 'mapInfoDijit',
                options: {
                    map: true,
                    mode: 'dms',
                    firstCoord: 'y',
                    unitScale: 3,
                    showScale: true,
                    xLabel: '',
                    yLabel: '',
                    minWidth: 286
                }
            },
            scalebar: {
                include: true,
                id: 'scalebar',
                type: 'map',
                path: 'esri/dijit/Scalebar',
                options: {
                    map: true,
                    attachTo: 'bottom-left',
                    scalebarStyle: 'line',
                    scalebarUnit: 'dual'
                }
            },
            locateButton: {
                include: true,
                id: 'locateButton',
                type: 'ui',
                path: 'gis/dijit/LocateButton',
                placeAt: 'top-left',
                position: 'last',
                options: {
                    map: true,
                    publishGPSPosition: true,
                    highlightLocation: true,
                    useTracking: true,
                    geolocationOptions: {
                        maximumAge: 0,
                        timeout: 15000,
                        enableHighAccuracy: true
                    }
                }
            },
            overviewMap: {//鹰眼地图
                include: has('phone') ? false : true,
                id: 'overviewMap',
                type: 'map',
                path: 'esri/dijit/OverviewMap',
                options: {
                    map: true,
                    attachTo: 'bottom-right',//位置概览图将出现在地图对象上location overview map will appear on Map object 
                    color: '#0000CC',
                    height: 100,
                    width: 125,
                    opacity: 0.30,
                    visible: false
                }
            },
            /*homeButton: {
                include: true,
                id: 'homeButton',
                type: 'ui',
                path: 'esri/dijit/HomeButton',
                placeAt: 'top-left',
                options: {
                    map: true,
                    extent: new Extent({
                        xmin: -180,
                        ymin: -85,
                        xmax: 180,
                        ymax: 85,
                        spatialReference: {
                            wkid: 4326
                        }
                    })
                }
            },*/
			fullScreen: {
                include: true,
                id: 'homeButton',
                type: 'domNode',
                path: 'gis/dijit/FullScreen',
                srcNodeRef: 'homeButton',
                options: {
				    map: true,
                    extent: new Extent({
                        xmin: -180,
                        ymin: -85,
                        xmax: 180,
                        ymax: 85,
                        spatialReference: {
                            wkid: 4326
                        }
                    })
			    }
            },
            legend: {
                include: true,
                id: 'legend',
                type: 'titlePane',
                path: 'gis/dijit/Legend',
                title: i18n.viewer.widgets.legend,
                iconClass: 'fa-picture-o',
                open: false,
                position: 1,
                options: {
                    map: true,
                    legendLayerInfos: true
                }
            },
            layerControl: {
                include: true,
                id: 'layerControl',
                type: 'titlePane',
                path: 'gis/dijit/LayerControl',
                title: i18n.viewer.widgets.layerControl,
                iconClass: 'fa-th-list',
                open: false,
                position: 0,
                options: {
                    map: true,
                    layerControlLayerInfos: true,
                    separated: true,
                    vectorReorder: true,
                    overlayReorder: true,
                    // create a custom menu entry in all of these feature types
                    // the custom menu item will publish a topic when clicked
                    menu: {
                        feature: [{
                            topic: 'hello',
                            iconClass: 'fa fa-smile-o',
                            label: 'Say Hello'
                        }]
                    },
                    //create a example sub layer menu that will
                    //apply to all layers of type 'dynamic'
                    subLayerMenu: {
                        dynamic: [{
                            topic: 'goodbye',
                            iconClass: 'fa fa-frown-o',
                            label: 'Say goodbye'
                        }]
                    }
                }
            },
            bookmarks: {
                include: true,
                id: 'bookmarks',
                type: 'titlePane',
                path: 'gis/dijit/Bookmarks',
                title: i18n.viewer.widgets.bookmarks,
                iconClass: 'fa-bookmark',
                open: false,
                position: 2,
                options: 'config/bookmarks'
            },
            find: {
                include: true,
                id: 'find',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Find',
                title: i18n.viewer.widgets.find,
                iconClass: 'fa-search',
                open: false,
                position: 3,
                options: 'config/find'
            },
            draw: {
                include: true,
                id: 'draw',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Draw',
                title: i18n.viewer.widgets.draw,
                iconClass: 'fa-paint-brush',
                open: false,
                position: 4,
                options: {
                    map: true,
                    mapClickMode: true
                }
            },
            measure: {
                include: true,
                id: 'measurement',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Measurement',
                title: i18n.viewer.widgets.measure,
                iconClass: 'fa-expand',//要添加到菜单的图标类
                open: false,
                position: 5,
                options: {
                    map: true,
                    mapClickMode: true,
                    defaultAreaUnit: units.SQUARE_MILES,//默认面积
                    defaultLengthUnit: units.MILES//默认长度
                }
            },
            print: {
                include: true,
                id: 'print',
                type: 'titlePane',
                canFloat: true,
                path: 'gis/dijit/Print',
                title: i18n.viewer.widgets.print,
                iconClass: 'fa-print',
                open: false,
                position: 6,
                options: {
                    map: true,
                    printTaskURL: 'https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task',
                    copyrightText: 'Copyright 2014',
                    authorText: 'Me',
                    defaultTitle: 'Viewer Map',
                    defaultFormat: 'PDF',
                    defaultLayout: 'Letter ANSI A Landscape'
                }
            },
            directions: {
                include: true,
                id: 'directions',
                type: 'titlePane',
                path: 'gis/dijit/Directions',
                title: i18n.viewer.widgets.directions,
                iconClass: 'fa-map-signs',
                open: false,
                position: 7,
                options: {
                    map: true,
                    mapRightClickMenu: true,
                    options: {
                        routeTaskUrl: 'https://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
                        routeParams: {
                            directionsLanguage: 'en-US',
                            directionsLengthUnits: units.MILES
                        },
                        active: false //for 3.12, starts active by default, which we dont want as it interfears with mapClickMode
                    }
                }
            },
            editor: {
                include: has('phone') ? false : true,
                id: 'editor',
                type: 'titlePane',
                path: 'gis/dijit/Editor',
                title: i18n.viewer.widgets.editor,
                iconClass: 'fa-pencil',
                open: false,
                position: 8,
                options: {
                    map: true,
                    mapClickMode: true,
                    editorLayerInfos: true,
                    settings: {
                        toolbarVisible: true,
                        showAttributesOnClick: true,
                        enableUndoRedo: true,
                        createOptions: {
                            polygonDrawTools: ['freehandpolygon', 'autocomplete']
                        },
                        toolbarOptions: {
                            reshapeVisible: true,
                            cutVisible: true,
                            mergeVisible: true
                        }
                    }
                }
            },
            streetview: {
                include: true,
                id: 'streetview',
                type: 'titlePane',
                canFloat: true,
                position: 9,
                path: 'gis/dijit/StreetView',
                title: i18n.viewer.widgets.streetview,
                iconClass: 'fa-street-view',
                paneOptions: {
                    resizable: true,
                    resizeOptions: {
                        minSize: {
                            w: 250,
                            h: 250
                        }
                    }
                },
                options: {
                    map: true,
                    mapClickMode: true,
                    mapRightClickMenu: true
                }
            },
            locale: {
                include: true,
                type: has('phone') ? 'titlePane' : 'domNode',
                id: 'locale',
                position: 0,
                srcNodeRef: 'geocodeDijit',
                path: 'gis/dijit/Locale',
                title: i18n.viewer.widgets.locale,
                iconClass: 'fa-flag',
                options: {
                    style: has('phone') ? null : 'margin-left: 30px;'
                }
            },
            help: {
                include: has('phone') ? false : true,
                id: 'help',
                type: 'floating',
                path: 'gis/dijit/Help',
                title: i18n.viewer.widgets.help,
                iconClass: 'fa-info-circle',
                paneOptions: {
                    draggable: false,
                    html: '<a href="#"><i class="fa fa-fw fa-info-circle"></i>link</a>'.replace('link', i18n.viewer.widgets.help),
                    domTarget: 'helpDijit',
                    style: 'height:345px;width:450px;'
                },
                options: {}
            }

        }
    };
});
