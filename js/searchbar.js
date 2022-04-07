d3.csv("data/finaldata.csv").then((data) => populateSearchBar(data));

const populateSearchBar = (data) => {
  const counties1 = d3.select("#counties1");
  const counties2 = d3.select("#counties2");
  const counties3 = d3.select("#counties3");
  data.forEach((d) => {
    const countyName = `${d.County}, ${d.State}`;
    counties1.append("option").attr("value", countyName);
    counties2.append("option").attr("value", countyName);
    counties3.append("option").attr("value", countyName);
  });
};

//https://stackoverflow.com/questions/30022728/perform-action-when-clicking-html5-datalist-option
//add to this later when we connect county selection to the visualizations
function onInput() {
  let value = document.getElementById("searchbar1").value; //the value current in the first search bar
  let opts = document.getElementById("counties1").childNodes; //the datalist options
  for (var i = 0; i < opts.length; i++) {
    if (opts[i].value === value) {
      // An item was selected from the list!
      // yourCallbackHere()
      //   alert(opts[i].value);
      break;
    }
  }
}
