ngDefine('cockpit.plugin.heatmap.resources', function(module) {

  //	define Angular ressource for REST communication  
  var ActivityResource = function ($resource, Uri) {
	    return $resource(Uri.appUri('plugin://heatmap/:engine/process-definition/:id/activitystats'), {id: '@id'}, {
	      queryActivityStatistics:{method: 'GET', isArray: true}  // stats per activity in process definition 
	    });
	  };

  module.factory('HeatmapEngineSpecificResource', ActivityResource);
  
});

