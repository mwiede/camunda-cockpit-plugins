package de.matez.camunda.cockpit.plugin.heatmap.resources;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;

import de.matez.camunda.cockpit.plugin.heatmap.HeatmapPlugin;

/**
 * root resource to select sub resource for the selected engine (as you could run multiple engines)
 * 
 * @author MWI
 *
 */
@Path("plugin/" + HeatmapPlugin.ID)
public class HeatmapRootResource extends AbstractCockpitPluginRootResource {

  public HeatmapRootResource() {
    super(HeatmapPlugin.ID);
  }

  @Path("{engineName}/")
  public HeatmapEngineSpecificResource getProcessInstanceResource(@PathParam("engineName") String engineName) {
    return subResource(new HeatmapEngineSpecificResource(engineName), engineName);
  }
}
