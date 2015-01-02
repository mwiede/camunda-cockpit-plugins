ngDefine('cockpit.plugin.bpmn-stats.data', function(module) {

  var Controller = [ '$scope', 'processData', 'BpmnStatsTaskProcessDefinitionResource',
      function ($scope, processData, BpmnStatsTaskProcessDefinitionResource) {

        processData.provide('activityInstanceHistoricStats', ['processDefinition', function (processDefinition) {
          return BpmnStatsTaskProcessDefinitionResource.queryActivityStatistics({ id : processDefinition.id }).$promise;
        }]);

  }];

  var Configuration = function PluginConfiguration(DataProvider) {

    DataProvider.registerData('cockpit.processDefinition.data', {
      id: 'activity-instance-historic-statistics-data',
      controller: Controller
    }); 
  };

  Configuration.$inject = ['DataProvider'];

  module.config(Configuration);
});
