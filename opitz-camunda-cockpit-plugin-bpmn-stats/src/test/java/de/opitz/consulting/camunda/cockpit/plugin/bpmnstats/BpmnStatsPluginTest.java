package de.opitz.consulting.camunda.cockpit.plugin.bpmnstats;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.plugin.spi.CockpitPlugin;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Test;

public class BpmnStatsPluginTest extends AbstractCockpitPluginTest {

	@Test
	public void testPluginDiscovery() {
		CockpitPlugin samplePlugin = Cockpit.getRuntimeDelegate()
				.getPluginRegistry().getPlugin(BpmnStatsPlugin.ID);
		Assert.assertNotNull(samplePlugin);		
	}

}
