package de.opitz.consulting.camunda.cockpit.plugin.bpmnstats;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.camunda.bpm.cockpit.plugin.spi.impl.AbstractCockpitPlugin;

import de.opitz.consulting.camunda.cockpit.plugin.bpmnstats.resources.BpmnStatsRootResource;

public class BpmnStatsPlugin extends AbstractCockpitPlugin {

  public static final String ID = "bpmn-stats";

  private static final String[] MAPPING_FILES = {
	    "org/camunda/bpm/cockpit/plugin/bpmn-stats/queries/stats.xml"
	  };
  
  public String getId() {
    return ID;
  }

  @Override
  public Set<Class<?>> getResourceClasses() {
    Set<Class<?>> classes = new HashSet<Class<?>>();

    classes.add(BpmnStatsRootResource.class);

    return classes;
  }
  
  @Override
	public List<String> getMappingFiles() {
	  return Arrays.asList(MAPPING_FILES);
	}

}
