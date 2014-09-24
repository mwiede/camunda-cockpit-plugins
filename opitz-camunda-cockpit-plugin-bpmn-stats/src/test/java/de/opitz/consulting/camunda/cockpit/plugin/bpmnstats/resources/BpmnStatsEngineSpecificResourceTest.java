package de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.resources;

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
import org.camunda.bpm.engine.test.Deployment;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;

import de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.dto.StatsContainerDto;

public class BpmnStatsEngineSpecificResourceTest extends AbstractCockpitPluginTest {

	private BpmnStatsEngineSpecificResource bpmnStatsEngineSpecificResource;
	private ProcessEngine processEngine;
	private RuntimeService runtimeService;
	private RepositoryService repositoryService;
	private ManagementService managementService;
	private TaskService taskService;
	private HistoryService historyService;

	@Before
	public void setup(){
		super.before();
		bpmnStatsEngineSpecificResource = new BpmnStatsEngineSpecificResource("engineName");
		processEngine = getProcessEngine();	    
	    runtimeService = processEngine.getRuntimeService();
	    repositoryService = processEngine.getRepositoryService();
	    managementService = processEngine.getManagementService();
	    taskService = processEngine.getTaskService();
	     historyService = processEngine.getHistoryService();
	}
	
	@Test
	public void testGetTaskActitityStats() {		
		List<StatsContainerDto> result = bpmnStatsEngineSpecificResource.getTaskActitityStats("processDefinitionId");
		Assert.assertEquals(0, result.size());
	}
	
	@Test
	@Deployment(resources = "processes/simple-user-task-process.bpmn")
	public void testGetTaskActitityStatsWithResult() {
		
		String processDefId = startAndCompleteProcesses();
		
		List<StatsContainerDto> result = bpmnStatsEngineSpecificResource.getTaskActitityStats(processDefId);
		
		Assert.assertEquals(1, result.size());
		StatsContainerDto statsContainerDto = result.get(0);		
		Assert.assertNotNull(statsContainerDto.getAvg());
		Assert.assertNotNull(statsContainerDto.getCount());
		Assert.assertEquals(2,statsContainerDto.getCount());
		Assert.assertNotNull(statsContainerDto.getMax());
		Assert.assertNotNull(statsContainerDto.getMin());
		Assert.assertNotNull(statsContainerDto.getStddev());
	}

	@Test
	public void testGetProcessInstanceStats() {
		StatsContainerDto processInstanceStats = bpmnStatsEngineSpecificResource.getProcessInstanceStats("processDefinitionId");
		Assert.assertNull(processInstanceStats);
	}
	
	@Test
	@Deployment(resources = "processes/simple-user-task-process.bpmn")
	public void testGetProcessInstanceStatsWithResult() {
		String  processDefId = startAndCompleteProcesses();		
		StatsContainerDto statsContainerDto = bpmnStatsEngineSpecificResource.getProcessInstanceStats(processDefId);
		Assert.assertNotNull(statsContainerDto);
		Assert.assertNotNull(statsContainerDto.getAvg());
		Assert.assertNotNull(statsContainerDto.getCount());
		Assert.assertEquals(2,statsContainerDto.getCount());
		Assert.assertNotNull(statsContainerDto.getMax());
		Assert.assertNotNull(statsContainerDto.getMin());
		Assert.assertNotNull(statsContainerDto.getStddev());
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
