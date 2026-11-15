package org.centralhacks.project.accessbilitymap;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.io.File;

@SpringBootApplication
@RestController
public class App {
	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}

	@GetMapping("/BuildingData/{buildingName}")
	public Building buildingData(@PathVariable String buildingName) {
		Building building; 
		try {
			building = readBuilding(buildingName);
			return building;
		} catch(Exception e) {
			return new Building(e.getMessage());
		}
	}

	@GetMapping("/Buildings")
	public ArrayList<String> buildingData() {
		ArrayList<String> buildingNames = new ArrayList<String>(); 
		File folder = new File("Data");
		String[] fileNames = folder.list();

		if (fileNames != null) {
			System.out.println(fileNames);
			for (String name : fileNames) {
				buildingNames.add(name.replace(".json",""));
			}
		}

		return buildingNames;
	}

	public Building readBuilding(String buildingName) throws Exception {
		String filePath = "Data/"+buildingName+".json";
		File buildingJSON = new File(filePath);
		ObjectMapper mapper = new ObjectMapper();
		return mapper.readValue(buildingJSON, Building.class);
	}
	public void writeBuilding(Building building) throws Exception {
		String filePath = "Data/"+building.getName()+".json";
		File buildingJSON = new File(filePath);
		ObjectMapper mapper = new ObjectMapper();
		mapper.writerWithDefaultPrettyPrinter().writeValue(buildingJSON, building);
	}
}