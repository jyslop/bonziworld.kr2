gdjs.GameSceneCode = {};
gdjs.GameSceneCode.localVariables = [];
gdjs.GameSceneCode.idToCallbackMap = new Map();
gdjs.GameSceneCode.GDWallObjects1= [];
gdjs.GameSceneCode.GDWallObjects2= [];
gdjs.GameSceneCode.GDWallObjects3= [];
gdjs.GameSceneCode.GDWallObjects4= [];
gdjs.GameSceneCode.GDBarrierObjects1= [];
gdjs.GameSceneCode.GDBarrierObjects2= [];
gdjs.GameSceneCode.GDBarrierObjects3= [];
gdjs.GameSceneCode.GDBarrierObjects4= [];
gdjs.GameSceneCode.GDFloorObjects1= [];
gdjs.GameSceneCode.GDFloorObjects2= [];
gdjs.GameSceneCode.GDFloorObjects3= [];
gdjs.GameSceneCode.GDFloorObjects4= [];
gdjs.GameSceneCode.GDCameraObjects1= [];
gdjs.GameSceneCode.GDCameraObjects2= [];
gdjs.GameSceneCode.GDCameraObjects3= [];
gdjs.GameSceneCode.GDCameraObjects4= [];
gdjs.GameSceneCode.GDWalkJoystickObjects1= [];
gdjs.GameSceneCode.GDWalkJoystickObjects2= [];
gdjs.GameSceneCode.GDWalkJoystickObjects3= [];
gdjs.GameSceneCode.GDWalkJoystickObjects4= [];
gdjs.GameSceneCode.GDLookJoystickObjects1= [];
gdjs.GameSceneCode.GDLookJoystickObjects2= [];
gdjs.GameSceneCode.GDLookJoystickObjects3= [];
gdjs.GameSceneCode.GDLookJoystickObjects4= [];
gdjs.GameSceneCode.GDCrosshairObjects1= [];
gdjs.GameSceneCode.GDCrosshairObjects2= [];
gdjs.GameSceneCode.GDCrosshairObjects3= [];
gdjs.GameSceneCode.GDCrosshairObjects4= [];
gdjs.GameSceneCode.GDNew3DBoxObjects1= [];
gdjs.GameSceneCode.GDNew3DBoxObjects2= [];
gdjs.GameSceneCode.GDNew3DBoxObjects3= [];
gdjs.GameSceneCode.GDNew3DBoxObjects4= [];
gdjs.GameSceneCode.GDWall2Objects1= [];
gdjs.GameSceneCode.GDWall2Objects2= [];
gdjs.GameSceneCode.GDWall2Objects3= [];
gdjs.GameSceneCode.GDWall2Objects4= [];
gdjs.GameSceneCode.GDWall3Objects1= [];
gdjs.GameSceneCode.GDWall3Objects2= [];
gdjs.GameSceneCode.GDWall3Objects3= [];
gdjs.GameSceneCode.GDWall3Objects4= [];
gdjs.GameSceneCode.GDNew3DBox2Objects1= [];
gdjs.GameSceneCode.GDNew3DBox2Objects2= [];
gdjs.GameSceneCode.GDNew3DBox2Objects3= [];
gdjs.GameSceneCode.GDNew3DBox2Objects4= [];
gdjs.GameSceneCode.GDNew3DModelObjects1= [];
gdjs.GameSceneCode.GDNew3DModelObjects2= [];
gdjs.GameSceneCode.GDNew3DModelObjects3= [];
gdjs.GameSceneCode.GDNew3DModelObjects4= [];
gdjs.GameSceneCode.GDNewSpriteObjects1= [];
gdjs.GameSceneCode.GDNewSpriteObjects2= [];
gdjs.GameSceneCode.GDNewSpriteObjects3= [];
gdjs.GameSceneCode.GDNewSpriteObjects4= [];
gdjs.GameSceneCode.GDNewSprite2Objects1= [];
gdjs.GameSceneCode.GDNewSprite2Objects2= [];
gdjs.GameSceneCode.GDNewSprite2Objects3= [];
gdjs.GameSceneCode.GDNewSprite2Objects4= [];
gdjs.GameSceneCode.GDNewTedObjects1= [];
gdjs.GameSceneCode.GDNewTedObjects2= [];
gdjs.GameSceneCode.GDNewTedObjects3= [];
gdjs.GameSceneCode.GDNewTedObjects4= [];
gdjs.GameSceneCode.GDGrassBlockObjects1= [];
gdjs.GameSceneCode.GDGrassBlockObjects2= [];
gdjs.GameSceneCode.GDGrassBlockObjects3= [];
gdjs.GameSceneCode.GDGrassBlockObjects4= [];
gdjs.GameSceneCode.GDmallObjects1= [];
gdjs.GameSceneCode.GDmallObjects2= [];
gdjs.GameSceneCode.GDmallObjects3= [];
gdjs.GameSceneCode.GDmallObjects4= [];
gdjs.GameSceneCode.GDovenlessObjects1= [];
gdjs.GameSceneCode.GDovenlessObjects2= [];
gdjs.GameSceneCode.GDovenlessObjects3= [];
gdjs.GameSceneCode.GDovenlessObjects4= [];
gdjs.GameSceneCode.GDhitboxObjects1= [];
gdjs.GameSceneCode.GDhitboxObjects2= [];
gdjs.GameSceneCode.GDhitboxObjects3= [];
gdjs.GameSceneCode.GDhitboxObjects4= [];


gdjs.GameSceneCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtTools.systemInfo.isMobile());
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("LookJoystick"), gdjs.GameSceneCode.GDLookJoystickObjects1);
gdjs.copyArray(runtimeScene.getObjects("WalkJoystick"), gdjs.GameSceneCode.GDWalkJoystickObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDWalkJoystickObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDWalkJoystickObjects1[i].deleteFromScene(runtimeScene);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDLookJoystickObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDLookJoystickObjects1[i].deleteFromScene(runtimeScene);
}
}
}

}


};gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDBarrierObjects1ObjectsGDgdjs_9546GameSceneCode_9546GDWallObjects1ObjectsGDgdjs_9546GameSceneCode_9546GDWall2Objects1ObjectsGDgdjs_9546GameSceneCode_9546GDWall3Objects1ObjectsGDgdjs_9546GameSceneCode_9546GDNew3DBox2Objects1ObjectsGDgdjs_9546GameSceneCode_9546GDhitboxObjects1Objects = Hashtable.newFrom({"Barrier": gdjs.GameSceneCode.GDBarrierObjects1, "Wall": gdjs.GameSceneCode.GDWallObjects1, "Wall2": gdjs.GameSceneCode.GDWall2Objects1, "Wall3": gdjs.GameSceneCode.GDWall3Objects1, "New3DBox2": gdjs.GameSceneCode.GDNew3DBox2Objects1, "hitbox": gdjs.GameSceneCode.GDhitboxObjects1});
gdjs.GameSceneCode.eventsList1 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__MousePointerLock__isPointerLocked.func(runtimeScene, null);
}
if (isConditionTrue_0) {
{gdjs.evtsExt__CameraShake3D__ShakeCamera.func(runtimeScene, 1, 0.1, 0.9, null);
}
}

}


};gdjs.GameSceneCode.eventsList2 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtsExt__MousePointerLock__isPointerLocked.func(runtimeScene, null));
}
if (isConditionTrue_0) {
{gdjs.evtsExt__MousePointerLock__RequestPointerLock.func(runtimeScene, null);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__MousePointerLock__isPointerLocked.func(runtimeScene, null);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].setAngle(gdjs.GameSceneCode.GDCameraObjects2[i].getAngle() + (gdjs.evtsExt__MousePointerLock__MovementX.func(runtimeScene, null) / 20));
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("Object3D").setRotationY(gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("Object3D").getRotationY() + (gdjs.evtsExt__MousePointerLock__MovementY.func(runtimeScene, null) / 20));
}
}
}

}


};gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects2Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects2});
gdjs.GameSceneCode.eventsList3 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = !(gdjs.evtTools.systemInfo.isMobile());
if (isConditionTrue_0) {

{ //Subevents
gdjs.GameSceneCode.eventsList2(runtimeScene);} //End of subevents
}

}


{

gdjs.copyArray(runtimeScene.getObjects("LookJoystick"), gdjs.GameSceneCode.GDLookJoystickObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.GameSceneCode.GDLookJoystickObjects2.length;i<l;++i) {
    if ( gdjs.GameSceneCode.GDLookJoystickObjects2[i].IsPressed(null) ) {
        isConditionTrue_0 = true;
        gdjs.GameSceneCode.GDLookJoystickObjects2[k] = gdjs.GameSceneCode.GDLookJoystickObjects2[i];
        ++k;
    }
}
gdjs.GameSceneCode.GDLookJoystickObjects2.length = k;
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
/* Reuse gdjs.GameSceneCode.GDLookJoystickObjects2 */
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("TopDownWalk").SimulateRotationStick((( gdjs.GameSceneCode.GDLookJoystickObjects2.length === 0 ) ? 0 :gdjs.GameSceneCode.GDLookJoystickObjects2[0].StickForceX(null)), null);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("Object3D").setRotationY(gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("Object3D").getRotationY() + ((( gdjs.GameSceneCode.GDLookJoystickObjects2.length === 0 ) ? 0 :gdjs.GameSceneCode.GDLookJoystickObjects2[0].StickForceY(null)) * 120 * gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene)));
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__Gamepads__C_Controller_X_is_connected.func(runtimeScene, 1, null);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("TopDownWalk").SimulateRotationStick(gdjs.evtsExt__Gamepads__StickForceX.func(runtimeScene, 1, "Right", null), null);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("Object3D").setRotationY(gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("Object3D").getRotationY() + (gdjs.evtsExt__Gamepads__StickForceY.func(runtimeScene, 1, "Right", null) * 120 * gdjs.evtTools.runtimeScene.getElapsedTimeInSeconds(runtimeScene)));
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("Object3D").setRotationY(gdjs.evtTools.common.clamp((gdjs.GameSceneCode.GDCameraObjects2[i].getRotationY()), -90, 90));
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{gdjs.evtsExt__FirstPersonCamera__LookFromObjectEyes.func(runtimeScene, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects2Objects, "", null);
}
{gdjs.scene3d.camera.setCameraZ(runtimeScene, gdjs.scene3d.camera.getCameraZ(runtimeScene, "", 0) + ((( gdjs.GameSceneCode.GDCameraObjects2.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects2[0].getBehavior("Object3D").getDepth())), "", 0);
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Crosshair"), gdjs.GameSceneCode.GDCrosshairObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDCrosshairObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCrosshairObjects1[i].setPosition(gdjs.evtTools.camera.getCameraX(runtimeScene, "Crosshair", 0),gdjs.evtTools.camera.getCameraY(runtimeScene, "Crosshair", 0));
}
}
}

}


};gdjs.GameSceneCode.eventsList4 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, "w");
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("TopDownWalk").SimulateMoveForwardKey(null);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, "s");
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("TopDownWalk").SimulateMoveBackwardKey(null);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, "d");
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("TopDownWalk").SimulateMoveRightKey(null);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, "a");
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("TopDownWalk").SimulateMoveLeftKey(null);
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("WalkJoystick"), gdjs.GameSceneCode.GDWalkJoystickObjects2);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.GameSceneCode.GDWalkJoystickObjects2.length;i<l;++i) {
    if ( gdjs.GameSceneCode.GDWalkJoystickObjects2[i].IsPressed(null) ) {
        isConditionTrue_0 = true;
        gdjs.GameSceneCode.GDWalkJoystickObjects2[k] = gdjs.GameSceneCode.GDWalkJoystickObjects2[i];
        ++k;
    }
}
gdjs.GameSceneCode.GDWalkJoystickObjects2.length = k;
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects2);
/* Reuse gdjs.GameSceneCode.GDWalkJoystickObjects2 */
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects2.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects2[i].getBehavior("TopDownWalk").SimulateMoveStick((( gdjs.GameSceneCode.GDWalkJoystickObjects2.length === 0 ) ? 0 :gdjs.GameSceneCode.GDWalkJoystickObjects2[0].StickAngle(null)), (( gdjs.GameSceneCode.GDWalkJoystickObjects2.length === 0 ) ? 0 :gdjs.GameSceneCode.GDWalkJoystickObjects2[0].StickForce(null)), null);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtsExt__Gamepads__C_Controller_X_is_connected.func(runtimeScene, 1, null);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects1[i].getBehavior("TopDownWalk").SimulateMoveStick(gdjs.evtsExt__Gamepads__StickAngle.func(runtimeScene, 1, "Left", null), gdjs.evtsExt__Gamepads__StickForce.func(runtimeScene, 1, "Left", null), null);
}
}
}

}


};gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNew3DBoxObjects1Objects = Hashtable.newFrom({"New3DBox": gdjs.GameSceneCode.GDNew3DBoxObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNewTedObjects1Objects = Hashtable.newFrom({"NewTed": gdjs.GameSceneCode.GDNewTedObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDovenlessObjects1Objects = Hashtable.newFrom({"ovenless": gdjs.GameSceneCode.GDovenlessObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNewTedObjects1Objects = Hashtable.newFrom({"NewTed": gdjs.GameSceneCode.GDNewTedObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNewTedObjects1Objects = Hashtable.newFrom({"NewTed": gdjs.GameSceneCode.GDNewTedObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDovenlessObjects1Objects = Hashtable.newFrom({"ovenless": gdjs.GameSceneCode.GDovenlessObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDovenlessObjects1Objects = Hashtable.newFrom({"ovenless": gdjs.GameSceneCode.GDovenlessObjects1});
gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects = Hashtable.newFrom({"Camera": gdjs.GameSceneCode.GDCameraObjects1});
gdjs.GameSceneCode.eventsList5 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects1[i].hide();
}
}

{ //Subevents
gdjs.GameSceneCode.eventsList0(runtimeScene);} //End of subevents
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Barrier"), gdjs.GameSceneCode.GDBarrierObjects1);
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("New3DBox2"), gdjs.GameSceneCode.GDNew3DBox2Objects1);
gdjs.copyArray(runtimeScene.getObjects("Wall"), gdjs.GameSceneCode.GDWallObjects1);
gdjs.copyArray(runtimeScene.getObjects("Wall2"), gdjs.GameSceneCode.GDWall2Objects1);
gdjs.copyArray(runtimeScene.getObjects("Wall3"), gdjs.GameSceneCode.GDWall3Objects1);
gdjs.copyArray(runtimeScene.getObjects("hitbox"), gdjs.GameSceneCode.GDhitboxObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects1[i].getBehavior("Jump3D").SeparateFromPlatforms(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDBarrierObjects1ObjectsGDgdjs_9546GameSceneCode_9546GDWallObjects1ObjectsGDgdjs_9546GameSceneCode_9546GDWall2Objects1ObjectsGDgdjs_9546GameSceneCode_9546GDWall3Objects1ObjectsGDgdjs_9546GameSceneCode_9546GDNew3DBox2Objects1ObjectsGDgdjs_9546GameSceneCode_9546GDhitboxObjects1Objects, "Object3D", null);
}
}
}

}


{


gdjs.GameSceneCode.eventsList1(runtimeScene);
}


{


gdjs.GameSceneCode.eventsList3(runtimeScene);
}


{


gdjs.GameSceneCode.eventsList4(runtimeScene);
}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("New3DBox"), gdjs.GameSceneCode.GDNew3DBoxObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDNew3DBoxObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNew3DBoxObjects1[i].rotateTowardObject((gdjs.GameSceneCode.GDCameraObjects1.length !== 0 ? gdjs.GameSceneCode.GDCameraObjects1[0] : null), 0, runtimeScene);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDNew3DBoxObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNew3DBoxObjects1[i].getBehavior("Pathfinding").moveTo(runtimeScene, (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getX()), (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getY()) - (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getHeight()) * 5);
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("NewTed"), gdjs.GameSceneCode.GDNewTedObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDNewTedObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNewTedObjects1[i].rotateTowardObject((gdjs.GameSceneCode.GDCameraObjects1.length !== 0 ? gdjs.GameSceneCode.GDCameraObjects1[0] : null), 0, runtimeScene);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDNewTedObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNewTedObjects1[i].getBehavior("Pathfinding").moveTo(runtimeScene, (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getX()), (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getY()) - (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getHeight()) * 5);
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("ovenless"), gdjs.GameSceneCode.GDovenlessObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDovenlessObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDovenlessObjects1[i].rotateTowardObject((gdjs.GameSceneCode.GDCameraObjects1.length !== 0 ? gdjs.GameSceneCode.GDCameraObjects1[0] : null), 0, runtimeScene);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDovenlessObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDovenlessObjects1[i].getBehavior("Pathfinding").moveTo(runtimeScene, (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getX()), (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getY()) - (( gdjs.GameSceneCode.GDCameraObjects1.length === 0 ) ? 0 :gdjs.GameSceneCode.GDCameraObjects1[0].getHeight()) * 2);
}
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isKeyPressed(runtimeScene, "Space");
if (isConditionTrue_0) {
gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDCameraObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDCameraObjects1[i].getBehavior("Jump3D").SimulateJumpKey(null);
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("New3DBox"), gdjs.GameSceneCode.GDNew3DBoxObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNew3DBoxObjects1Objects, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects, false, runtimeScene, false);
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "GameScene", false);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("NewTed"), gdjs.GameSceneCode.GDNewTedObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNewTedObjects1Objects, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects, false, runtimeScene, false);
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "GameScene", false);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("ovenless"), gdjs.GameSceneCode.GDovenlessObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDovenlessObjects1Objects, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects, false, runtimeScene, false);
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "GameScene", false);
}
}

}


{


let isConditionTrue_0 = false;
isConditionTrue_0 = false;
/* Unknown object - skipped. */if (isConditionTrue_0) {
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("NewTed"), gdjs.GameSceneCode.GDNewTedObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.distanceTest(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNewTedObjects1Objects, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects, 350, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.distanceTest(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDNewTedObjects1Objects, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects, 345, true);
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.playSound(runtimeScene, "pizza.mp3", false, 100, 1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("Camera"), gdjs.GameSceneCode.GDCameraObjects1);
gdjs.copyArray(runtimeScene.getObjects("ovenless"), gdjs.GameSceneCode.GDovenlessObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.distanceTest(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDovenlessObjects1Objects, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects, 350, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.object.distanceTest(gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDovenlessObjects1Objects, gdjs.GameSceneCode.mapOfGDgdjs_9546GameSceneCode_9546GDCameraObjects1Objects, 345, true);
}
if (isConditionTrue_0) {
{gdjs.evtTools.sound.playSound(runtimeScene, "ovenlessbrownies.mp3", false, 100, 1);
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("ovenless"), gdjs.GameSceneCode.GDovenlessObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.GameSceneCode.GDovenlessObjects1.length;i<l;++i) {
    if ( gdjs.GameSceneCode.GDovenlessObjects1[i].getBehavior("Object3D").getZ() < -1000 ) {
        isConditionTrue_0 = true;
        gdjs.GameSceneCode.GDovenlessObjects1[k] = gdjs.GameSceneCode.GDovenlessObjects1[i];
        ++k;
    }
}
gdjs.GameSceneCode.GDovenlessObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.GameSceneCode.GDovenlessObjects1 */
{for(var i = 0, len = gdjs.GameSceneCode.GDovenlessObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDovenlessObjects1[i].setPosition(3200,4425);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDovenlessObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDovenlessObjects1[i].getBehavior("Object3D").setZ(-32);
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("New3DBox"), gdjs.GameSceneCode.GDNew3DBoxObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.GameSceneCode.GDNew3DBoxObjects1.length;i<l;++i) {
    if ( gdjs.GameSceneCode.GDNew3DBoxObjects1[i].getBehavior("Object3D").getZ() < -1000 ) {
        isConditionTrue_0 = true;
        gdjs.GameSceneCode.GDNew3DBoxObjects1[k] = gdjs.GameSceneCode.GDNew3DBoxObjects1[i];
        ++k;
    }
}
gdjs.GameSceneCode.GDNew3DBoxObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.GameSceneCode.GDNew3DBoxObjects1 */
{for(var i = 0, len = gdjs.GameSceneCode.GDNew3DBoxObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNew3DBoxObjects1[i].setPosition(725,25);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDNew3DBoxObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNew3DBoxObjects1[i].getBehavior("Object3D").setZ(96);
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("NewTed"), gdjs.GameSceneCode.GDNewTedObjects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
for (var i = 0, k = 0, l = gdjs.GameSceneCode.GDNewTedObjects1.length;i<l;++i) {
    if ( gdjs.GameSceneCode.GDNewTedObjects1[i].getBehavior("Object3D").getZ() < -1000 ) {
        isConditionTrue_0 = true;
        gdjs.GameSceneCode.GDNewTedObjects1[k] = gdjs.GameSceneCode.GDNewTedObjects1[i];
        ++k;
    }
}
gdjs.GameSceneCode.GDNewTedObjects1.length = k;
if (isConditionTrue_0) {
/* Reuse gdjs.GameSceneCode.GDNewTedObjects1 */
{for(var i = 0, len = gdjs.GameSceneCode.GDNewTedObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNewTedObjects1[i].setPosition(-3975,525);
}
}
{for(var i = 0, len = gdjs.GameSceneCode.GDNewTedObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDNewTedObjects1[i].getBehavior("Object3D").setZ(0);
}
}
}

}


{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("hitbox"), gdjs.GameSceneCode.GDhitboxObjects1);
{for(var i = 0, len = gdjs.GameSceneCode.GDhitboxObjects1.length ;i < len;++i) {
    gdjs.GameSceneCode.GDhitboxObjects1[i].hide();
}
}
}

}


};

gdjs.GameSceneCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.GameSceneCode.GDWallObjects1.length = 0;
gdjs.GameSceneCode.GDWallObjects2.length = 0;
gdjs.GameSceneCode.GDWallObjects3.length = 0;
gdjs.GameSceneCode.GDWallObjects4.length = 0;
gdjs.GameSceneCode.GDBarrierObjects1.length = 0;
gdjs.GameSceneCode.GDBarrierObjects2.length = 0;
gdjs.GameSceneCode.GDBarrierObjects3.length = 0;
gdjs.GameSceneCode.GDBarrierObjects4.length = 0;
gdjs.GameSceneCode.GDFloorObjects1.length = 0;
gdjs.GameSceneCode.GDFloorObjects2.length = 0;
gdjs.GameSceneCode.GDFloorObjects3.length = 0;
gdjs.GameSceneCode.GDFloorObjects4.length = 0;
gdjs.GameSceneCode.GDCameraObjects1.length = 0;
gdjs.GameSceneCode.GDCameraObjects2.length = 0;
gdjs.GameSceneCode.GDCameraObjects3.length = 0;
gdjs.GameSceneCode.GDCameraObjects4.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects1.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects2.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects3.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects4.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects1.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects2.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects3.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects4.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects1.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects2.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects3.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects4.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects1.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects2.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects3.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects4.length = 0;
gdjs.GameSceneCode.GDWall2Objects1.length = 0;
gdjs.GameSceneCode.GDWall2Objects2.length = 0;
gdjs.GameSceneCode.GDWall2Objects3.length = 0;
gdjs.GameSceneCode.GDWall2Objects4.length = 0;
gdjs.GameSceneCode.GDWall3Objects1.length = 0;
gdjs.GameSceneCode.GDWall3Objects2.length = 0;
gdjs.GameSceneCode.GDWall3Objects3.length = 0;
gdjs.GameSceneCode.GDWall3Objects4.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects1.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects2.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects3.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects4.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects1.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects2.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects3.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects4.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects1.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects2.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects3.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects4.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects1.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects2.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects3.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects4.length = 0;
gdjs.GameSceneCode.GDNewTedObjects1.length = 0;
gdjs.GameSceneCode.GDNewTedObjects2.length = 0;
gdjs.GameSceneCode.GDNewTedObjects3.length = 0;
gdjs.GameSceneCode.GDNewTedObjects4.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects1.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects2.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects3.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects4.length = 0;
gdjs.GameSceneCode.GDmallObjects1.length = 0;
gdjs.GameSceneCode.GDmallObjects2.length = 0;
gdjs.GameSceneCode.GDmallObjects3.length = 0;
gdjs.GameSceneCode.GDmallObjects4.length = 0;
gdjs.GameSceneCode.GDovenlessObjects1.length = 0;
gdjs.GameSceneCode.GDovenlessObjects2.length = 0;
gdjs.GameSceneCode.GDovenlessObjects3.length = 0;
gdjs.GameSceneCode.GDovenlessObjects4.length = 0;
gdjs.GameSceneCode.GDhitboxObjects1.length = 0;
gdjs.GameSceneCode.GDhitboxObjects2.length = 0;
gdjs.GameSceneCode.GDhitboxObjects3.length = 0;
gdjs.GameSceneCode.GDhitboxObjects4.length = 0;

gdjs.GameSceneCode.eventsList5(runtimeScene);
gdjs.GameSceneCode.GDWallObjects1.length = 0;
gdjs.GameSceneCode.GDWallObjects2.length = 0;
gdjs.GameSceneCode.GDWallObjects3.length = 0;
gdjs.GameSceneCode.GDWallObjects4.length = 0;
gdjs.GameSceneCode.GDBarrierObjects1.length = 0;
gdjs.GameSceneCode.GDBarrierObjects2.length = 0;
gdjs.GameSceneCode.GDBarrierObjects3.length = 0;
gdjs.GameSceneCode.GDBarrierObjects4.length = 0;
gdjs.GameSceneCode.GDFloorObjects1.length = 0;
gdjs.GameSceneCode.GDFloorObjects2.length = 0;
gdjs.GameSceneCode.GDFloorObjects3.length = 0;
gdjs.GameSceneCode.GDFloorObjects4.length = 0;
gdjs.GameSceneCode.GDCameraObjects1.length = 0;
gdjs.GameSceneCode.GDCameraObjects2.length = 0;
gdjs.GameSceneCode.GDCameraObjects3.length = 0;
gdjs.GameSceneCode.GDCameraObjects4.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects1.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects2.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects3.length = 0;
gdjs.GameSceneCode.GDWalkJoystickObjects4.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects1.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects2.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects3.length = 0;
gdjs.GameSceneCode.GDLookJoystickObjects4.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects1.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects2.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects3.length = 0;
gdjs.GameSceneCode.GDCrosshairObjects4.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects1.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects2.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects3.length = 0;
gdjs.GameSceneCode.GDNew3DBoxObjects4.length = 0;
gdjs.GameSceneCode.GDWall2Objects1.length = 0;
gdjs.GameSceneCode.GDWall2Objects2.length = 0;
gdjs.GameSceneCode.GDWall2Objects3.length = 0;
gdjs.GameSceneCode.GDWall2Objects4.length = 0;
gdjs.GameSceneCode.GDWall3Objects1.length = 0;
gdjs.GameSceneCode.GDWall3Objects2.length = 0;
gdjs.GameSceneCode.GDWall3Objects3.length = 0;
gdjs.GameSceneCode.GDWall3Objects4.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects1.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects2.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects3.length = 0;
gdjs.GameSceneCode.GDNew3DBox2Objects4.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects1.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects2.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects3.length = 0;
gdjs.GameSceneCode.GDNew3DModelObjects4.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects1.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects2.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects3.length = 0;
gdjs.GameSceneCode.GDNewSpriteObjects4.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects1.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects2.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects3.length = 0;
gdjs.GameSceneCode.GDNewSprite2Objects4.length = 0;
gdjs.GameSceneCode.GDNewTedObjects1.length = 0;
gdjs.GameSceneCode.GDNewTedObjects2.length = 0;
gdjs.GameSceneCode.GDNewTedObjects3.length = 0;
gdjs.GameSceneCode.GDNewTedObjects4.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects1.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects2.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects3.length = 0;
gdjs.GameSceneCode.GDGrassBlockObjects4.length = 0;
gdjs.GameSceneCode.GDmallObjects1.length = 0;
gdjs.GameSceneCode.GDmallObjects2.length = 0;
gdjs.GameSceneCode.GDmallObjects3.length = 0;
gdjs.GameSceneCode.GDmallObjects4.length = 0;
gdjs.GameSceneCode.GDovenlessObjects1.length = 0;
gdjs.GameSceneCode.GDovenlessObjects2.length = 0;
gdjs.GameSceneCode.GDovenlessObjects3.length = 0;
gdjs.GameSceneCode.GDovenlessObjects4.length = 0;
gdjs.GameSceneCode.GDhitboxObjects1.length = 0;
gdjs.GameSceneCode.GDhitboxObjects2.length = 0;
gdjs.GameSceneCode.GDhitboxObjects3.length = 0;
gdjs.GameSceneCode.GDhitboxObjects4.length = 0;


return;

}

gdjs['GameSceneCode'] = gdjs.GameSceneCode;
