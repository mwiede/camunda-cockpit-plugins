package de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.resources;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;

import de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.BpmnStatsPlugin;

/**
 * root resource to select sub resource for the selected engine (as you could run multiple engines)
 * 
 * @author ruecker
 *
 */
@Path("plugin/" + BpmnStatsPlugin.ID)
public class BpmnStatsRootResource extends AbstractCockpitPluginRootResource {

  public BpmnStatsRootResource() {
    super(BpmnStatsPlugin.ID);
  }

  @Path("{engineName}/")
  public BpmnStatsEngineSpecificResource getProcessInstanceResource(@PathParam("engineName") String engineName) {
    BpmnStatsEngineSpecificResource bpmnStatsEngineSpecificResource = new BpmnStatsEngineSpecificResource(engineName);
	return subResource(bpmnStatsEngineSpecificResource, engineName);
  }
}
