function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    var resultArray = metadata.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0];

    var sampleData = d3.select("#sample-metadata");

    sampleData.html("");


    Object.entries(result).forEach(([key, value]) => {
      sampleData.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObject => sampleObject.id == sample);
    var result = resultArray[0];

    var otuIds = result.otuIds;
    var otuLabels = result.otuLabels;
    var sampleValues = result.sampleValues;

    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xAxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    var bubbleData = [
      {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: "markers",
        marker: {
          size: sampleValues,
          color: otuIds,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    var yTicks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [
      {
        y: yTicks,
        x: sampleValues.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);
  });
}

function init() {

  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    var sampleName = data.names;

    sampleName.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    var firstSample = sampleName[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChange(newSample) {

  buildCharts(newSample);
  buildMetadata(newSample);
}

init();