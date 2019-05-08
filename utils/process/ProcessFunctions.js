import Wprr from "wprr/Wprr";
import objectPath from "object-path";

// import ProcessFunctions from "wprr/utils/process/ProcessFunctions";
export default class ProcessFunctions {
	
	static createLoaderProcess(aUrl, aBody = {}, aStatusSource = null, aStatusName = "status", aStorage = null, aStorageName = "result", aDataPath = "data") {
		let newChain = new Wprr.utils.process.ProcessChain();
		
		let pathGenerator = Wprr.utils.PathGenerator.create();
		
		newChain.addEmptyStep(pathGenerator.addAndGet("start"));
		pathGenerator.setMarker("start");
		
		if(aStatusSource) {
			newChain.addCommandStep(pathGenerator.addAndGet("setLoadingStatus"), Wprr.commands.setValue(aStatusSource, aStatusName, 2));
		}
		
		let loadingProcess = Wprr.utils.process.parts.LoadingProcess.create(aUrl, aBody);
		
		if(aStorage) {
			newChain.storeLoadedData(aStorage, aStorageName, aDataPath);
		}
		
		newChain.addStepToChain(pathGenerator.addAndGet("loadData"), loadingProcess);
		
		pathGenerator.setMarker("loading");
		
		//Success
		newChain.addEmptyStep(pathGenerator.gotoMarker("loading").addAndGet("success"), true, false);
		if(aStatusSource) {
			newChain.addCommandStep(pathGenerator.addAndGet("setLoadedStatus"), Wprr.commands.setValue(aStatusSource, aStatusName, 1));
		}
		//METODO: add command to complete the chain
		
		//Error
		newChain.addEmptyStep(pathGenerator.gotoMarker("loading").addAndGet("error"), true, false);
		if(aStatusSource) {
			newChain.addCommandStep(pathGenerator.addAndGet("setErrorStatus"), Wprr.commands.setValue(aStatusSource, aStatusName, -1));
		}
		newChain.addEmptyStep(pathGenerator.addAndGet("stopBeforeRetry"), false, true);
		newChain.linkStep(pathGenerator.addAndGet("retry"), pathGenerator.getMarker("start"));
		
		return newChain;
	}
}