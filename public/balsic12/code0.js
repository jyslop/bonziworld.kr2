gdjs.titleCode = {};
gdjs.titleCode.localVariables = [];
gdjs.titleCode.idToCallbackMap = new Map();
gdjs.titleCode.GDNewSpriteObjects1= [];
gdjs.titleCode.GDNewSpriteObjects2= [];
gdjs.titleCode.GDNewTiledSpriteObjects1= [];
gdjs.titleCode.GDNewTiledSpriteObjects2= [];
gdjs.titleCode.GDNewSprite2Objects1= [];
gdjs.titleCode.GDNewSprite2Objects2= [];
gdjs.titleCode.GDNewSprite3Objects1= [];
gdjs.titleCode.GDNewSprite3Objects2= [];
gdjs.titleCode.GDaObjects1= [];
gdjs.titleCode.GDaObjects2= [];
gdjs.titleCode.GDa2Objects1= [];
gdjs.titleCode.GDa2Objects2= [];


gdjs.titleCode.mapOfGDgdjs_9546titleCode_9546GDNewSprite3Objects1Objects = Hashtable.newFrom({"NewSprite3": gdjs.titleCode.GDNewSprite3Objects1});
gdjs.titleCode.eventsList0 = function(runtimeScene) {

{


let isConditionTrue_0 = false;
{
gdjs.copyArray(runtimeScene.getObjects("NewTiledSprite"), gdjs.titleCode.GDNewTiledSpriteObjects1);
{for(var i = 0, len = gdjs.titleCode.GDNewTiledSpriteObjects1.length ;i < len;++i) {
    gdjs.titleCode.GDNewTiledSpriteObjects1[i].setYOffset(gdjs.titleCode.GDNewTiledSpriteObjects1[i].getYOffset() + (5));
}
}
}

}


{

gdjs.copyArray(runtimeScene.getObjects("NewSprite3"), gdjs.titleCode.GDNewSprite3Objects1);

let isConditionTrue_0 = false;
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.cursorOnObject(gdjs.titleCode.mapOfGDgdjs_9546titleCode_9546GDNewSprite3Objects1Objects, runtimeScene, true, false);
if (isConditionTrue_0) {
isConditionTrue_0 = false;
isConditionTrue_0 = gdjs.evtTools.input.isMouseButtonReleased(runtimeScene, "Left");
}
if (isConditionTrue_0) {
{gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, "GameScene", false);
}
}

}


};

gdjs.titleCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.titleCode.GDNewSpriteObjects1.length = 0;
gdjs.titleCode.GDNewSpriteObjects2.length = 0;
gdjs.titleCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.titleCode.GDNewTiledSpriteObjects2.length = 0;
gdjs.titleCode.GDNewSprite2Objects1.length = 0;
gdjs.titleCode.GDNewSprite2Objects2.length = 0;
gdjs.titleCode.GDNewSprite3Objects1.length = 0;
gdjs.titleCode.GDNewSprite3Objects2.length = 0;
gdjs.titleCode.GDaObjects1.length = 0;
gdjs.titleCode.GDaObjects2.length = 0;
gdjs.titleCode.GDa2Objects1.length = 0;
gdjs.titleCode.GDa2Objects2.length = 0;

gdjs.titleCode.eventsList0(runtimeScene);
gdjs.titleCode.GDNewSpriteObjects1.length = 0;
gdjs.titleCode.GDNewSpriteObjects2.length = 0;
gdjs.titleCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.titleCode.GDNewTiledSpriteObjects2.length = 0;
gdjs.titleCode.GDNewSprite2Objects1.length = 0;
gdjs.titleCode.GDNewSprite2Objects2.length = 0;
gdjs.titleCode.GDNewSprite3Objects1.length = 0;
gdjs.titleCode.GDNewSprite3Objects2.length = 0;
gdjs.titleCode.GDaObjects1.length = 0;
gdjs.titleCode.GDaObjects2.length = 0;
gdjs.titleCode.GDa2Objects1.length = 0;
gdjs.titleCode.GDa2Objects2.length = 0;


return;

}

gdjs['titleCode'] = gdjs.titleCode;
