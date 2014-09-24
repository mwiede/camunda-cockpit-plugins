package de.matez.camunda.cockpit.plugin.heatmap;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.plugin.spi.CockpitPlugin;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Test;

import de.matez.camunda.cockpit.plugin.heatmap.HeatmapPlugin;

public class HeatmapPluginTest extends AbstractCockpitPluginTest {

	@Test
	public void testPluginDiscovery() {
		CockpitPlugin samplePlugin = Cockpit.getRuntimeDelegate()
				.getPluginRegistry().getPlugin(HeatmapPlugin.ID);
		Assert.assertNotNull(samplePlugin);		
	}

}
