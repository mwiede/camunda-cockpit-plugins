ngDefine('cockpit.plugin.heatmap.data', function(module) {

  var Controller = [ '$scope', 'processData', 'HeatmapEngineSpecificResource',
      function ($scope, processData, HeatmapEngineSpecificResource) {

        processData.provide('activityInstanceHistoricStatistics', ['processDefinition', function (processDefinition) {
          return HeatmapEngineSpecificResource.queryActivityStatistics({ id : processDefinition.id }).$promise;
        }]);

  }];

  var Configuration = function PluginConfiguration(DataProvider) {

    DataProvider.registerData('cockpit.processDefinition.data', {
      id: 'activity-instance-historic-heatmap-data',
      controller: Controller
    }); 
  };

  Configuration.$inject = ['DataProvider'];

  module.config(Configuration);
});
