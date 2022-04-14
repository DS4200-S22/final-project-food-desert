d3.csv("data/finaldata.csv").then((data) => populateSearchBar(data));

const populateSearchBar = (data) => {
  const counties1 = d3.select("#counties1");
  const counties2 = d3.select("#counties2");
  const counties3 = d3.select("#counties3");
  data.forEach((d) => {
    const countyName = `${d.County}, ${d.State}`;
    const id = d.id;
    counties1.append("option").attr("value", countyName).attr("id", id);
    counties2.append("option").attr("value", countyName).attr("id", id);
    counties3.append("option").attr("value", countyName).attr("id", id);
  });
};

const updateSearchBar = () => {
  const searchbar1 = document.getElementById("searchbar1");
  const searchbar2 = document.getElementById("searchbar2");
  const searchbar3 = document.getElementById("searchbar3");
  if (counties[0] !== undefined) {
    const county1Id = counties[0];
    searchbar1.value = id_to_name.get(county1Id);
  } else {
    searchbar1.value = "";
  }
  if (counties[1] !== undefined) {
    const county2Id = counties[1];
    searchbar2.value = id_to_name.get(county2Id);
  } else {
    searchbar2.value = "";
  }
  if (counties[2] !== undefined) {
    const county3Id = counties[2];
    searchbar3.value = id_to_name.get(county3Id);
  } else {
    searchbar3.value = "";
  }
};

const clearSelection = (selection) => {
  const prevValue = selection.value;
  selection.value = "";
  const index = counties.indexOf(name_to_id.get(prevValue));
  if (index !== -1) {
    counties.splice(index, 1);
    showHideOutline(prevValue);
  }
};

//https://stackoverflow.com/questions/30022728/perform-action-when-clicking-html5-datalist-option
//add to this later when we connect county selection to the visualizations
function onInput(selectedLocation) {
  if (counties.length >= 3) {
    alert("Can't select more than 3");
  } else if (counties.indexOf(name_to_id.get(selectedLocation)) === -1) {
    const id = name_to_id.get(selectedLocation);
    counties.push(id);

    //show county outline on map
    showHideOutline(selectedLocation);

    update_bar();
    updateScatter();
  }
}

const showHideOutline = (location) => {
  const countyState = location.split(", ");
  const county = countyState[0];
  const state = countyState[1];
  const stateName = state_code_to_name.get(state);
  const elementId = `${county}${stateName}`;
  console.log(elementId);
  let countyElem = document.getElementById(elementId);
  if (countyElem !== undefined) {
    if (countyElem.classList.contains("county-selected")) {
      countyElem.classList.remove("county-selected");
    } else {
      countyElem.classList.add("county-selected");
    }
  }
};
