package de.matez.camunda.cockpit.plugin.heatmap.resources;

import java.util.List;

import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.camunda.bpm.engine.HistoryService;
import org.camunda.bpm.engine.ManagementService;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.junit.Before;

public class HeatmapEngineSpecificResourceTest extends AbstractCockpitPluginTest {

	private HeatmapEngineSpecificResource bpmnStatsEngineSpecificResource;
	private ProcessEngine processEngine;
	private RuntimeService runtimeService;
	private RepositoryService repositoryService;
	private ManagementService managementService;
	private TaskService taskService;
	private HistoryService historyService;

	@Before
	public void setup(){
		super.before();
		bpmnStatsEngineSpecificResource = new HeatmapEngineSpecificResource("engineName");
		processEngine = getProcessEngine();	    
	    runtimeService = processEngine.getRuntimeService();
	    repositoryService = processEngine.getRepositoryService();
	    managementService = processEngine.getManagementService();
	    taskService = processEngine.getTaskService();
	     historyService = processEngine.getHistoryService();
	}
	
	private String startAndCompleteProcesses() {
		ProcessInstance startProcessInstanceByKey = runtimeService.startProcessInstanceByKey("simpleUserTaskProcess");		
		runtimeService.startProcessInstanceByKey("simpleUserTaskProcess");
		List<Task> list = taskService.createTaskQuery().list();
		for (Task task : list) {
			taskService.complete(task.getId());			
		}
		return startProcessInstanceByKey.getProcessDefinitionId();
	}
	
	
}
