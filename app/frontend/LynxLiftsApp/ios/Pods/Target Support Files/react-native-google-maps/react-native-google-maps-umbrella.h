#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "AIRDummyView.h"
#import "AIRGMSMarker.h"
#import "AIRGMSPolygon.h"
#import "AIRGMSPolyline.h"
#import "AIRGoogleMap.h"
#import "AIRGoogleMapCallout.h"
#import "AIRGoogleMapCalloutManager.h"
#import "AIRGoogleMapCalloutSubview.h"
#import "AIRGoogleMapCalloutSubviewManager.h"
#import "AIRGoogleMapCircle.h"
#import "AIRGoogleMapCircleManager.h"
#import "AIRGoogleMapCoordinate.h"
#import "AIRGoogleMapHeatmap.h"
#import "AIRGoogleMapHeatmapManager.h"
#import "AIRGoogleMapManager.h"
#import "AIRGoogleMapMarker.h"
#import "AIRGoogleMapMarkerManager.h"
#import "AIRGoogleMapOverlay.h"
#import "AIRGoogleMapOverlayManager.h"
#import "AIRGoogleMapPolygon.h"
#import "AIRGoogleMapPolygonManager.h"
#import "AIRGoogleMapPolyline.h"
#import "AIRGoogleMapPolylineManager.h"
#import "AIRGoogleMapUrlTile.h"
#import "AIRGoogleMapUrlTileManager.h"
#import "AIRGoogleMapWMSTile.h"
#import "AIRGoogleMapWMSTileManager.h"
#import "RCTConvert+GMSMapViewType.h"
#import "RNMapsGoogleMapView.h"
#import "RNMapsGooglePolygonView.h"

FOUNDATION_EXPORT double react_native_google_mapsVersionNumber;
FOUNDATION_EXPORT const unsigned char react_native_google_mapsVersionString[];

