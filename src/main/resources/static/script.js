const pinTypes = Object.freeze({
    DOOR: "Assets/DoorPin.png",
    RAMP: "Assets/RampPin.png",
    ELEVATOR: "Assets/ElevatorPin.png",
    WHEELCHAIR: "Assets/WheelchairPin.png",
    BUILDING: "Assets/BuildingPin.png"
})

function placePin(x, y, pinType, link="") {
    console.log(x,y,pinType);
    //if (!(x.ok & y.ok)) {return;}
    var pin;
    if (link!="") {
        pin = document.createElement('a');
        pin.href = link;
        
        const img = document.createElement('img');
        img.src = pinType;
        img.className = "mapPin";
        pin.appendChild(img);
    } else {
        pin = document.createElement('img');
    }
    
    
    pin.src = pinType;
    pin.className = "mapPin";
    pin.style.cssText = `left: ${x*100}%; top: ${y*100}%;`;
    document.getElementById("pinContainer").appendChild(pin);
    return pin;
}

async function fetchData(buildingName) {
    try {
        const response = await fetch(`http://localhost:8080/BuildingData/${buildingName}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
        

    } catch (error) {
        console.error('Request failed:',error);
    }
}
async function getBuildings() {
    try {
        const response = await fetch(`http://localhost:8080/Buildings`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
        

    } catch (error) {
        console.error('Request failed:',error);
    }
}

const currentBuildingName = document.currentScript.dataset.building;

document.addEventListener("DOMContentLoaded", async () => {
    console.log(currentBuildingName);
    if (currentBuildingName == null) {return;}
    
    if (currentBuildingName == "Campus") {
        const data = await getBuildings();
        for (const buildingName of data) {
            const building = await fetchData(buildingName)
            if (building.position === null) {return;}
            placePin(building.position.x,building.position.y,pinTypes.BUILDING,buildingName+".html");
        }
    } else {
        const data = await fetchData(currentBuildingName);
        //if(!data.ok) {return;}
        
        for (const pinData of data.doors) {
            if (pinData.position === null) {continue;}
            placePin(pinData.position.x,pinData.position.y,pinTypes.DOOR);
        }
        for (const pinData of data.ramps) {
            if (pinData.position === null) {continue;}
            placePin(pinData.position.x,pinData.position.y,pinTypes.RAMP);
        }
        for (const pinData of data.elevators) {
            if (pinData.position === null) {continue;}
            placePin(pinData.position.x,pinData.position.y,pinTypes.ELEVATOR);
        }
        for (const pinData of data.wheelchairAreas) {
            if (pinData.position === null) {continue;}
            placePin(pinData.position.x,pinData.position.y,pinTypes.WHEELCHAIR);
        }
    }
});