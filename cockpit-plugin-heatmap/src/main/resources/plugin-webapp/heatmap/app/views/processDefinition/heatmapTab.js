ngDefine('cockpit.plugin.heatmap.views', function(module) {
  
  // create controller to load data for HTML
  function HeatmapController ($scope, HeatmapService, HeatmapEngineSpecificResource) {
    // input: processInstance
    
	$scope.show = false;  
	  
    $scope.activityStats = null;
    
    HeatmapEngineSpecificResource.query({id: $scope.processDefinition.id}).$promise.then(function(response) {
        $scope.activityStats = response;
    });     
    
    angular.element(document).ready(function () {
    	HeatmapService.initHeatMap($scope.processDefinition.id);
    });
    
    
//	var processData = $scope.processData.newChild($scope);   
//	
//	processData.observe(['filter','activityInstanceHistoricStatistics', function(filter,activityInstanceHistoricStatistics) {
//    	
//    	// aufbau der Heatmapdaten:
//    	
//    	// an dieser Stelle kommen die historic-Daten an, mann könnte die
//		// heatmapdaten erzeugen
//    	if(HeatmapService.heatmap){
//    		HeatmapService.clear();
//	    	angular.forEach(activityInstanceHistoricStatistics, function(statsElement) {    				 
//				
//					// find coordinates
//					angular.forEach($scope.$parent.processDiagram.bpmnElements, function(elem){
//						
//						if(elem.id === statsElement.id){
//							 var coord = $scope.getCoordinates(elem);
//							 HeatmapService.heatmap.addData({x:coord.x,y:coord.y,value:1});		
//							$('#'+elem.id).css('z-index', 999);
//						}
//						
//					});
//					
//					//console.log(xx.store);
//			    	
//				
//		     });
//	    	//xx.store.generateRandomDataSet(100);
//    	}
//    	
//        $scope.filter = filter;
//        
//      }]);
       
    
    $scope.getCoordinates = function(elem){
    	return{
    		x:  (elem.bounds.x/1) + (elem.bounds.width/2),
    		y:  (elem.bounds.y/1) + (elem.bounds.height/2)
    	};
    };
    
    $scope.toggleActivityHeatMap = function($event){
    	
    	$($event.target.parentElement).toggleClass('active');
    	
    	HeatmapService.initHeatMap($scope.processDefinition.id);
    	
    	// hide it
    	if($scope.show){
    		HeatmapService.clear();
    	}
    	// show it
    	else{
    		
    		$scope.show = !$scope.show;
    		
    		var bpmnElements = $scope.$parent.processDiagram.bpmnElements;
        	
        	// assoc array für schnellen contains check:
        	var statsElemente = {};
        	angular.forEach($scope.activityStats, function(statsElement) {
        		statsElemente[statsElement.id]=statsElement.count;
        	});
        	
        	// alle Sequencen durchgehen
        	angular.forEach(bpmnElements, function(elem){
        		if(elem.id.toLowerCase().indexOf('sequenceflow')==0){
        			// wenn targetRef in den stats vorkommt, dann datapoints erzeugen!
        			angular.forEach($scope.activityStats, function(statsElement) {
        				if(elem.targetRef==statsElement.id){
        					
        					// wenn startElement nicht in den Stats enthalten, dann kein Punkt zeichnen
        					if(!statsElemente[elem.sourceRef]){
        						return; 
        					}
        					
        					// bei zusammenführenden Gateways soll die Zahl der Source genommen werden
        					var weight = Math.min(statsElemente[elem.sourceRef],statsElement.count);
        					
        					// startKoordinaten
        					var startElement=eval('bpmnElements.'+elem.sourceRef);
        					var coord = $scope.getCoordinates(startElement);
        					HeatmapService.addHeatMapDataPoint(coord,weight);
        					// endKoordinaten
    						var endElement=eval('bpmnElements.'+elem.targetRef);
    						var coord1 = $scope.getCoordinates(endElement);
    						HeatmapService.addHeatMapDataPoint(coord1,weight);
    						
    						// console.log('paint a line ('+elem.id+') from '+elem.sourceRef+ ' -> '+elem.targetRef+ '('+weight+')');
    						
    						// linienkoordinaten
    						var steps = Math.sqrt(((coord.x-coord1.x)*(coord.x-coord1.x))+((coord.y-coord1.y)*(coord.y-coord1.y)))/10;
    						var h_step = -(coord.x-coord1.x)/steps;
    						var v_step = -(coord.y-coord1.y)/steps;
    						var actualx = coord.x+h_step;
    						var actualy = coord.y+v_step;
    						for (var int = 0; int < steps-1; int++) {
    							HeatmapService.addHeatMapDataPoint({x:actualx,y:actualy},weight);
    							actualx = actualx + h_step;
    							actualy = actualy + v_step;
    						} 
        				}
        			});
        		}
        	});
        	
        	// einen dot beim element selbst zeichnen:
        	/*
        	angular.forEach($scope.activityStats, function(statsElement) {
        		console.log(statsElement);
        		
        		
    			angular.forEach(bpmnElements, function(elem){					
    				if(elem.id === statsElement.id){
    					for (var int = 0; int < weight; int++) {
    						var coord = $scope.getCoordinates(elem);
    						$scope.heatmap.addData(coord.x,coord.y);
    					}
    				}
    			});
    	    });    
    	    */
    		
    	}
    	
    };
    
    $scope.clearHeatMap = function(){
    	HeatmapService.clear();
    };
    
  
    
  };
  module.controller('HeatmapController', [ '$scope','HeatmapService', 'HeatmapEngineSpecificResource',HeatmapController ]);

  
  module.service('HeatmapService', function(){
	  
	  this.heatmap = null;
	  this.heatmapElement = null;
	  
	  this.clear = function(){
		  if(this.heatmap){
			  this.heatmap.removeData();
		  }
	  };
	  
	  this.initHeatMap = function(processDefinitionId){
	    	// wir können erst die diagramm-größe abgreifen, wenn das Diagramm gerendert ist
	    	
	   	 if(!document.getElementById('heatmapArea')){
	   		 
	   		 	//TODO: if process Diagramm id differs
	   		 
	   	    	var diagramId = 'processDiagram_' + processDefinitionId.replace(/:/g, '_').replace(/\./g, '_');
	   	    	diagramId = 'processDiagram_1';//since 7.2.0
	   	    	
	   			var diagramHeight = document.getElementsByTagName('svg')[0].style.height.replace(/px/,'') || $('div#'+diagramId).height();
	   			var diagramWidth = document.getElementsByTagName('svg')[0].style.width.replace(/px/,'') || $('div#'+diagramId).width();
	   			
	   			this.heatmapElement = $('<div id="heatmapArea" style="position: absolute;"/>')
	   			.width(diagramWidth)
	   			.height(diagramHeight);
	   			
	   			$('div#'+diagramId).parent().prepend(this.heatmapElement);
	   				
	   				
	   			 var config = {
	   						"radius": 30, 
	   						"visible": true,
	   						"container":document.getElementById('heatmapArea')	   						
	   					};
	   					
	   			 // heatmap erzeugen...
	   			 this.heatmap = h337.create(config);
	   			 //var canvas = this.heatmap.get('canvas');
	   			 //canvas.style.zIndex = 998;
	   	    }
	    };
	    
	    this.addHeatMapDataPoint = function(coord, wertung){    	
//	    	for (var int = 0; int < wertung; int++) {
				this.heatmap.addData({x:coord.x,y:coord.y, value:wertung});
//			}
	    	
	    };
	 
  });
  

  // register Plugin
  var Configuration = function PluginConfiguration(ViewsProvider) {
    
	/*
    ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.tab', {
      id: 'heatmap-tab',
      label: 'Heatmap',
      url: 'plugin://heatmap/static/app/views/processDefinition/heatmap-tab.html',
      controller: 'HeatmapController',
      priority: 66
    });
    */
	  
    ViewsProvider.registerDefaultView('cockpit.processDefinition.runtime.action', {
        id: 'heatmap-action',
        label: 'Heatmap-action',
        url: 'plugin://heatmap/static/app/views/processDefinition/heatmap-action.html',
        controller: 'HeatmapController',
        priority: 66
      });
    
  };

  Configuration.$inject = ['ViewsProvider'];

  module.config(Configuration);
});
